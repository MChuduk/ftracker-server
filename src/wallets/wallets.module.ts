import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { WalletEntity } from './entities';
import { WalletsResolver } from './wallets.resolver';
import { WalletsService } from './wallets.service';
import { CurrencyModule } from '../currency/currency.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    UsersModule,
    CurrencyModule,
    forwardRef(() => TransactionsModule),
    TypeOrmModule.forFeature([WalletEntity]),
  ],
  providers: [WalletsResolver, WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
