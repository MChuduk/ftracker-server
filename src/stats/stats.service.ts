import { TransactionsService } from '../transactions/transactions.service';
import {
  UserBudgetReportDataDto,
  UserBudgetReportDto,
  WalletStatsByDatesDto,
  WalletStatsByDatesQueryRequestDto,
  WalletStatsDto,
  WalletStatsQueryRequestDto,
} from './dto';
import { WalletsService } from '../wallets/wallets.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';
import { TransactionQueryRequestDto } from '../transactions/dto';
import dataSource from '../config/database.config';
import { Transaction } from '../transactions/model';

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

  public async getUserBudgetReport(
    request: TransactionQueryRequestDto,
  ): Promise<UserBudgetReportDto> {
    const date = new Date();
    const fromDate =
      request.fromDate ||
      new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const toDate =
      request.toDate ||
      new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    const db = await dataSource.initialize();
    const dateRows = (await db.query(
      `select cast(date(date) as text) from generate_series(cast($1 as date), cast($2 as date), '1 day') as date order by date`,
      [fromDate, toDate],
    )) as UserBudgetReportDataDto[];
    await db.destroy();
    const data: UserBudgetReportDataDto[] = [];
    for (const row of dateRows) {
      const query =
        this.transactionsService.createQueryFindManyConditionWithRelations({
          toDate: row.date,
          ...request,
        });
      const transactions = await query.getMany();
      const totalAmount = transactions
        .map((transaction) => +transaction.amount)
        .reduce((acc, amount) => acc + amount, 0);
      data.push({ date: row.date, totalAmount });
    }
    return { data };
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
