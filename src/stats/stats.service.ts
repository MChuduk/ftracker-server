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
    const transactions = await this.transactionsService.getAll(userId, {
      walletId: request.walletId,
      dateBetween: request.dateBetween,
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
    const startDate = new Date(request.dateBetween.startDate);
    const endDate = new Date(request.dateBetween.endDate);
    const dates = [];
    while (startDate <= endDate) {
      const transactions = await this.transactionsService.getAll(userId, {
        walletId: request.walletId,
        date: startDate.toISOString(),
      });
      const amount = transactions
        .map((transaction) => +transaction.amount)
        .reduce((totalAmount, amount) => totalAmount + amount, 0);
      dates.push({ date: new Date(startDate).toISOString(), amount });
      startDate.setDate(startDate.getDate() + 1);
    }
    return { wallet, dates };
  }
}
