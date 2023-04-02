import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  WalletCreateRequestDto,
  WalletDeleteRequestDto,
  WalletDto,
} from './dto';
import { WalletEntity } from './entities';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletsRepository: Repository<WalletEntity>,
    private readonly usersService: UsersService,
    private readonly currencyService: CurrencyService,
  ) {}

  public async getAll(userId: string): Promise<WalletDto[]> {
    return await this.walletsRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .leftJoinAndSelect('wallet.currency', 'currency')
      .where('wallet.user.id = :userId', { userId })
      .getMany();
  }

  public async create(
    userId: string,
    request: WalletCreateRequestDto,
  ): Promise<WalletDto> {
    const { currencyId } = request;
    const user = await this.usersService.getById(userId);
    const currency = await this.currencyService.findById(currencyId);

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

  public async deleteWallet(request: WalletDeleteRequestDto) {
    const { walletId } = request;

    const wallet = await this.findById(walletId);
    if (!wallet) {
      throw new NotFoundException('wallet not found');
    }

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
      .where('wallet.id = :id', { id })
      .getOne();
  }
}
