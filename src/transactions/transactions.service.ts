import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionCreateRequestDto } from './dto';
import { Transaction } from './model';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsService } from '../wallets/wallets.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletService: WalletsService,
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  public async getAll(userId: string): Promise<Transaction[]> {
    return this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoinAndSelect('wallet.currency', 'currency')
      .where('transaction.user.id = :userId', { userId })
      .getMany();
  }

  public async create(
    userId: string,
    request: TransactionCreateRequestDto,
  ): Promise<Transaction> {
    const user = await this.usersService.getById(userId);
    const wallet = await this.walletService.findById(request.walletId);
    if (!user) throw new NotFoundException('user not found');
    if (!wallet) throw new NotFoundException('wallet not found');

    const transaction = this.transactionsRepository.create({ ...request });
    //transaction.user = user;
    transaction.wallet = wallet;

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
}
