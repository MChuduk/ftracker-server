import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  WalletCreateRequestDto,
  WalletDeleteRequestDto,
  WalletDto,
  WalletQueryRequestDto,
  WalletUpdateRequestDto,
} from './dto';
import { WalletEntity } from './entities';
import { CurrencyService } from '../currency/currency.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletFilter } from './model';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletsRepository: Repository<WalletEntity>,
    private readonly usersService: UsersService,
    private readonly currencyService: CurrencyService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {}

  public async getAll(request: WalletQueryRequestDto): Promise<WalletDto[]> {
    const defaultFilter = new WalletFilter();
    const filter = { ...defaultFilter, ...request };
    const query = this.walletsRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .leftJoinAndSelect('wallet.currency', 'currency')
      .where((qb) => {
        qb.where(
          `(cast(:userId as uuid) is null OR wallet.user_id = :userId) AND ` +
            `(cast(:walletId as uuid) is null OR wallet.id = :walletId)`,
          filter,
        );
      });

    if (request.searchByName) {
      query.andWhere('wallet.name ILIKE :name', {
        name: `%${request.searchByName}%`,
      });
    }
    return query.getMany();
  }

  public async create(
    userId: string,
    request: WalletCreateRequestDto,
  ): Promise<WalletDto> {
    const { currencyId } = request;
    const user = await this.usersService.getById(userId);
    const currency = await this.currencyService.getById(currencyId);

    if (!user) {
      throw new NotFoundException(`user with id ${userId} not found`);
    }

    const wallet = this.walletsRepository.create({
      ...request,
      currency,
      user,
    });

    const { raw } = await this.walletsRepository
      .createQueryBuilder()
      .insert()
      .into(WalletEntity)
      .values(wallet)
      .returning('id')
      .execute();

    return await this.findById(raw[0].id);
  }

  public async deleteWallet(userId: string, request: WalletDeleteRequestDto) {
    const { walletId } = request;

    const wallet = await this.findById(walletId);
    if (!wallet) {
      throw new NotFoundException('wallet not found');
    }
    const transactions = await this.transactionsService.findAllWithParams({
      userId,
      walletId,
    });
    await Promise.all([
      transactions.map((transaction) =>
        this.transactionsService.delete(transaction.id),
      ),
    ]);

    await this.walletsRepository
      .createQueryBuilder('wallet')
      .delete()
      .from(WalletEntity)
      .where('id = :walletId', { walletId })
      .execute();

    return wallet;
  }

  public async findById(id: string): Promise<WalletEntity> {
    return await this.walletsRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .leftJoinAndSelect('wallet.currency', 'currency')
      .where('wallet.id = :id', { id })
      .getOne();
  }

  public async updateWallet(request: WalletUpdateRequestDto) {
    const wallet = await this.findById(request.walletId);
    if (!wallet) throw new NotFoundException('wallet not found');
    if (request.currencyId) {
      const currency = await this.currencyService.getById(request.currencyId);
      if (!currency) throw new NotFoundException('currency not found');
      wallet.currency = {
        id: currency.id,
        ...currency,
      };
      wallet.currencyId = request.currencyId;

      const transactions = await this.transactionsService.findAllWithParams({
        walletId: wallet.id,
      });
      for (const transaction of transactions) {
        transaction.amount =
          (transaction.amount * transaction.wallet.currency.rate) /
          currency.rate;
        await this.transactionsService.saveTransaction(transaction);
      }
    }
    if (request.name) wallet.name = request.name;
    return await this.walletsRepository.save(wallet);
  }
}
