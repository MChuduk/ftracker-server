import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionCategory } from './model';
import { Repository } from 'typeorm';
import { TransactionCategoryEntity } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTransactionCategoriesEntity } from '../users/entities';
import { UsersService } from '../users/users.service';

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
      .execute();
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
}
