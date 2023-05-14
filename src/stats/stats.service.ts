import { TransactionsService } from '../transactions/transactions.service';
import {
  TransactionCategoriesReport,
  TransactionCategoriesReportDataDto,
  TransactionCategoriesStatsQueryDto,
  UserBudgetReportDataDto,
  UserBudgetReportDto,
  WalletActivityReportDataDto,
  WalletActivityReportDto,
  WalletActivityReportQueryRequestDto,
  WalletStatsDto,
  WalletStatsQueryRequestDto,
} from './dto';
import { WalletsService } from '../wallets/wallets.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';
import { TransactionQueryRequestDto } from '../transactions/dto';
import dataSource from '../config/database.config';

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
    const currency = await this.currencyService.getById(request.currencyId);
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
          fromDate,
          toDate: row.date,
          ...request,
          currencyId: null, //exclude from query
        });
      const transactions = await query.getMany();
      const totalAmount = transactions
        .map(
          (transaction) =>
            +(transaction.amount * transaction.wallet.currency.rate),
        )
        .reduce((acc, amount) => acc + amount, 0);
      data.push({
        date: row.date,
        totalAmount: currency ? totalAmount / currency.rate : totalAmount,
      });
    }
    return { data };
  }

  public async getWalletActivityReport(
    request: WalletActivityReportQueryRequestDto,
  ): Promise<WalletActivityReportDto> {
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
    )) as WalletActivityReportDataDto[];
    await db.destroy();
    const data: WalletActivityReportDataDto[] = [];
    for (const row of dateRows) {
      const query =
        this.transactionsService.createQueryFindManyConditionWithRelations({
          date: row.date,
          ...request,
        });
      const count = await query.getCount();
      data.push({
        date: row.date,
        count,
      });
    }
    return { data };
  }

  public async getTransactionsCategoriesReport(
    userId: string,
    request: TransactionCategoriesStatsQueryDto,
  ): Promise<TransactionCategoriesReport> {
    const date = new Date();
    const fromDate =
      request.fromDate ||
      new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const toDate =
      request.toDate ||
      new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    const transactions = await this.transactionsService.findAllWithParams({
      userId,
      fromDate,
      toDate,
      ...request,
    });
    const data: TransactionCategoriesReportDataDto[] = [];
    const transactionCategories = new Set(
      ...[transactions.map((x) => x.category.name)],
    );
    for (const category of transactionCategories) {
      const categoryColor = transactions.find(
        (x) => x.category.name === category,
      ).category.color;
      const totalAmount = transactions
        .filter((x) => x.category.name === category)
        .reduce(
          (acc, curr) => (acc += +(curr.amount * curr.wallet.currency.rate)),
          0,
        );
      data.push({ category, totalAmount, categoryColor });
    }
    return { data };
  }
}
