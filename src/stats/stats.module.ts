import { Module } from '@nestjs/common';
import { StatsResolver } from './stats.resolver';
import { StatsService } from './stats.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletsModule } from '../wallets/wallets.module';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [WalletsModule, TransactionsModule, CurrencyModule],
  providers: [StatsResolver, StatsService],
  exports: [StatsService],
})
export class StatsModule {}
