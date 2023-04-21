import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entity';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionCategoriesModule } from '../transaction-categories/transaction-categories.module';

@Module({
  imports: [
    UsersModule,
    TransactionCategoriesModule,
    forwardRef(() => WalletsModule),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  providers: [TransactionsResolver, TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
