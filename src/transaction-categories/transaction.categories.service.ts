import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionCategory } from './model';
import { Repository } from 'typeorm';
import {
  TransactionCategoryEntity,
  UserTransactionCategoriesEntity,
} from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { TransactionQueryCategoryDto } from './dto/transaction-query-category.dto';
import { TransactionCategoryUpdateDto } from './dto/transaction-category-update.dto';
import { TransactionCategoryCreateRequestDto } from './dto';
import { TransactionCategoryDeleteRequestDto } from './dto/transaction-category-delete-request.dto';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectRepository(TransactionCategoryEntity)
    private readonly transactionCategoriesRepository: Repository<TransactionCategoryEntity>,
    @InjectRepository(UserTransactionCategoriesEntity)
    private readonly userTransactionCategoriesRepository: Repository<UserTransactionCategoriesEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async create(
    userId: string,
    request: TransactionCategoryCreateRequestDto,
  ): Promise<TransactionCategory> {
    const user = await this.usersService.getById(userId);

    const category = this.transactionCategoriesRepository.create({
      ...request,
      userId,
      user,
    });
    const userCategory = this.userTransactionCategoriesRepository.create({
      userId,
      user,
    });
    const { raw } = await this.transactionCategoriesRepository
      .createQueryBuilder()
      .insert()
      .into(TransactionCategoryEntity)
      .values(category)
      .execute();
    await this.userTransactionCategoriesRepository
      .createQueryBuilder()
      .insert()
      .into(UserTransactionCategoriesEntity)
      .values({ ...userCategory, transactionCategoryId: raw[0].id })
      .execute();
    const transactionCategory = await this.getById(raw[0].id);
    return { ...transactionCategory, active: true };
  }

  public async delete(
    request: TransactionCategoryDeleteRequestDto,
  ): Promise<TransactionCategory> {
    const userCategory = await this.userTransactionCategoriesRepository
      .createQueryBuilder('userCategory')
      .where('userCategory.transaction_category_id = :categoryId', {
        categoryId: request.categoryId,
      })
      .getOne();
    const category = await this.getById(request.categoryId);
    if (!category) throw new NotFoundException('category not found');
    await this.userTransactionCategoriesRepository.delete({
      transactionCategoryId: category.id,
    });
    await this.transactionCategoriesRepository.delete({ id: category.id });
    return { ...category, active: userCategory.active };
  }

  public async getDefaultTransactionCategories(): Promise<
    TransactionCategory[]
  > {
    return this.transactionCategoriesRepository
      .createQueryBuilder('category')
      .where('category.user_id IS NULL')
      .getMany();
  }

  public async getById(
    transactionCategoryId: string,
  ): Promise<TransactionCategory> {
    return await this.transactionCategoriesRepository
      .createQueryBuilder('category')
      .where('category.id = :transactionCategoryId', { transactionCategoryId })
      .getOne();
  }

  public async getUserCategories(
    userId: string,
    request: TransactionQueryCategoryDto,
  ): Promise<TransactionCategory[]> {
    const query = this.userTransactionCategoriesRepository
      .createQueryBuilder('userCategory')
      .leftJoinAndSelect(
        'userCategory.transactionCategory',
        'transactionCategory',
      )
      .where('userCategory.user_id = :userId', { userId });

    if (request.pagination) {
      query
        .skip(request.pagination.page * request.pagination.limit)
        .take(request.pagination.limit);
    }

    if (request.active) {
      query.andWhere('userCategory.active = :active', {
        active: request.active,
      });
    }

    const userCategories = await query.getMany();
    return userCategories.map((category) => ({
      ...category.transactionCategory,
      active: category.active,
      userId,
    }));
  }

  public async addCategoryToUser(
    userId: string,
    transactionCategoryId: string,
  ): Promise<void> {
    const user = await this.usersService.getById(userId);
    if (!user) throw new NotFoundException('User not found');
    const category = await this.getById(transactionCategoryId);
    if (!category)
      throw new NotFoundException('Transaction category not found');

    await this.userTransactionCategoriesRepository
      .createQueryBuilder()
      .insert()
      .into(UserTransactionCategoriesEntity)
      .values({ userId, transactionCategoryId })
      .execute();
  }

  public async updateTransactionCategory(
    userId: string,
    request: TransactionCategoryUpdateDto,
  ): Promise<TransactionCategory> {
    const transactionCategory = await this.getById(request.categoryId);
    if (!transactionCategory) throw new NotFoundException('category not found');

    const userTransactionCategory =
      await this.userTransactionCategoriesRepository
        .createQueryBuilder('userCategory')
        .where('userCategory.transaction_category_id = :categoryId', {
          categoryId: request.categoryId,
        })
        .getOne();

    if (request.active !== undefined) {
      userTransactionCategory.active = request.active;
    }
    await this.userTransactionCategoriesRepository.save(
      userTransactionCategory,
    );
    return transactionCategory;
  }
}
