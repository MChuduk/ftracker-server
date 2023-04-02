import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserSettingsEntity } from './entities';
import { User, UserSettings } from './model';
import { UserDto } from './dto';
import { UserSettingsDto } from './dto/user-settings.dto';
import { TransactionCategoriesService } from '../transaction-categories/transaction.categories.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: Repository<UserSettingsEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => TransactionCategoriesService))
    private readonly transactionCategoriesService: TransactionCategoriesService,
  ) {}

  public async create(user: UserDto): Promise<User> {
    const settings = await this.createSettings({});
    const { raw } = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({ ...user, settings })
      .execute();
    return await this.getById(raw[0].id);
  }

  public async getById(userId: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  public async getByEmail(email: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  public async getSettingsById(id: string): Promise<UserSettings> {
    return await this.userSettingsRepository
      .createQueryBuilder('settings')
      .where('settings.id = :id', { id })
      .getOne();
  }

  public async

  public async addDefaultCategories(userId: string): Promise<void> {
    const categories =
      await this.transactionCategoriesService.getDefaultTransactionCategories();
    for (const category of categories) {
      await this.transactionCategoriesService.addCategoryToUser(
        userId,
        category.id,
      );
    }
  }

  private async createSettings(
    settings: UserSettingsDto,
  ): Promise<UserSettings> {
    const { raw } = await this.userSettingsRepository
      .createQueryBuilder()
      .insert()
      .into(UserSettingsEntity)
      .values(settings)
      .execute();
    return await this.getSettingsById(raw[0].id);
  }
}
