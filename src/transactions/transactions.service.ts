import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionCreateRequestDto, TransactionQueryRequestDto } from './dto';
import { Transaction, TransactionFilter } from './model';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TransactionEntity } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsService } from '../wallets/wallets.service';
import { UsersService } from '../users/users.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction.categories.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,
    private readonly transactionCategoriesService: TransactionCategoriesService,
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  public async findAllWithParams(request?: TransactionQueryRequestDto) {
    const query = this.createQueryFindManyConditionWithRelations(request);

    return await query.getMany();
  }

  public async create(
    userId: string,
    request: TransactionCreateRequestDto,
  ): Promise<Transaction> {
    const [user, wallet, category] = await Promise.all([
      this.usersService.getById(userId),
      this.walletService.findById(request.walletId),
      this.transactionCategoriesService.getById(request.categoryId),
    ]);
    if (!user || !wallet || !category)
      throw new NotFoundException('user, wallet or category not found');

    const transaction = this.transactionsRepository.create({
      ...request,
      userId,
      walletId: wallet.id,
    });

    const { raw } = await this.transactionsRepository
      .createQueryBuilder()
      .insert()
      .into(TransactionEntity)
      .values(transaction)
      .execute();

    return await this.findById(raw[0].id);
  }

  public async findById(id: string): Promise<Transaction> {
    return this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.id = :id', { id })
      .getOne();
  }

  public async delete(id: string): Promise<Transaction> {
    const transaction = await this.findById(id);
    if (!transaction) throw new NotFoundException('transaction not found');
    await this.transactionsRepository
      .createQueryBuilder('transaction')
      .delete()
      .from(TransactionEntity)
      .where('id = :id', { id })
      .execute();
    return transaction;
  }

  private createQueryFindManyConditionWithRelations(
    request?: TransactionQueryRequestDto,
  ): SelectQueryBuilder<TransactionEntity> {
    const defaultFilter = new TransactionFilter();
    const filter = { ...defaultFilter, ...request };
    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('wallet.currency', 'currency')
      .where((qb) => {
        qb.where(
          `(cast(:userId as uuid) is null OR transaction.user_id = :userId) AND ` +
            `(cast(:currencyId as uuid) is null OR wallet.currency.id = :currencyId) AND ` +
            `(cast(:walletId as uuid) is null OR transaction.wallet.id = :walletId) AND ` +
            `(cast(:date as date) is null OR transaction.date = :date) AND ` +
            `(cast(:fromDate as date) is null OR transaction.date >= :fromDate) AND ` +
            `(cast(:toDate as date) is null OR transaction.date <= :toDate)`,
          filter,
        );
      });
    if (filter.dateOrder) query.orderBy('transaction.date', filter.dateOrder);
    if (filter.pagination) {
      query.skip(filter.pagination.page * filter.pagination.limit);
      query.limit(filter.pagination.limit);
    }
    return query;
  }
}
