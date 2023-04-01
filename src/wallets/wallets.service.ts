import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateWalletRequestDto, WalletDto } from './dto';
import { WalletEntity } from './entities';
import {CurrencyService} from "../currency/currency.service";

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletsRepository: Repository<WalletEntity>,
    private readonly usersService: UsersService,
    private readonly currencyService: CurrencyService,
  ) {}

  public async getAll(userId: string): Promise<WalletEntity[]> {
    return await this.walletsRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .leftJoinAndSelect('wallet.currency', 'currency')
      .where('wallet.user.id = :userId', { userId })
      .getMany();
  }

  public async create(input: CreateWalletRequestDto): Promise<WalletEntity> {
    const { currencyId, userId } = input;
    const user = await this.usersService.findById(userId);
    const currency = await this.currencyService.findById(currencyId);

    if (!user) {
      throw new NotFoundException(`user with id ${userId} not found`);
    }

    const wallet = this.walletsRepository.create({ ...input, currency, user });

    const { raw } = await this.walletsRepository
      .createQueryBuilder()
      .insert()
      .into(WalletEntity)
      .values(wallet)
      .returning('id')
      .execute();

    return await this.findById(raw[0].id);
  }

  public async findById(id: string): Promise<WalletEntity> {
    return await this.walletsRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('wallet.id = :id', { id })
      .getOne();
  }
}
