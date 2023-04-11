import { TransactionsService } from '../transactions/transactions.service';
import {
  WalletStatsByDatesDto,
  WalletStatsByDatesQueryRequestDto,
  WalletStatsDto,
  WalletStatsQueryRequestDto,
} from './dto';
import { WalletsService } from '../wallets/wallets.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly currencyService: CurrencyService,
    private readonly transactionsService: TransactionsService,
  ) {}

  public async getWalletStats(
    userId: string,
    request: WalletStatsQueryRequestDto,
  ): Promise<WalletStatsDto> {
    const wallet = await this.walletsService.findById(request.walletId);
    if (!wallet) throw new NotFoundException('Wallet not found');
    const transactions = await this.transactionsService.findAllWithParams({
      userId,
      ...request,
    });
    const totalAmount = transactions
      .map((transaction) => +transaction.amount)
      .reduce((totalAmount, amount) => totalAmount + amount, 0);

    return { wallet, totalAmount };
  }

  public async getWalletsStatsByDates(
    userId: string,
    request: WalletStatsByDatesQueryRequestDto,
  ): Promise<WalletStatsByDatesDto> {
    const wallet = await this.walletsService.findById(request.walletId);
    if (!wallet) throw new NotFoundException('Wallet not found');
    const currentDate = new Date(request.fromDate);
    const endDate = new Date(request.toDate);
    const dates = [];
    while (currentDate <= endDate) {
      const transactions = await this.transactionsService.findAllWithParams({
        userId,
        ...request,
      });
      const amount = transactions
        .map((transaction) => +transaction.amount)
        .reduce((totalAmount, amount) => totalAmount + amount, 0);
      dates.push({ date: new Date(currentDate).toISOString(), amount });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return { wallet, dates };
  }
}
