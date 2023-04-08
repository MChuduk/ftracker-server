import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TransactionCreateRequestDto,
  TransactionDeleteRequestDto,
  TransactionQueryRequestDto,
} from './dto';
import { Transaction } from './model';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsService } from '../wallets/wallets.service';
import { UsersService } from '../users/users.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction.categories.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletService: WalletsService,
    private readonly transactionCategoriesService: TransactionCategoriesService,
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  public async getAll(
    userId: string,
    request: TransactionQueryRequestDto,
  ): Promise<Transaction[]> {
    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('wallet.currency', 'currency')
      .where('transaction.user.id = :userId', { userId });
    if (request.pagination) {
      query.skip(request.pagination.page * request.pagination.limit);
      query.take(request.pagination.limit);
    }
    if (request.dateBetween) {
      query.andWhere(`transaction.date between :startDate and :endDate`, {
        startDate: request.dateBetween.startDate,
        endDate: request.dateBetween.endDate,
      });
    }
    if (request.dateOrder) {
      query.orderBy('transaction.date', request.dateOrder);
    }
    return query.getMany();
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
}
