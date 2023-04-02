import { forwardRef, Module } from '@nestjs/common';
import { TransactionCategoriesResolver } from './transaction-categories.resolver';
import { TransactionCategoriesService } from './transaction.categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TransactionCategoryEntity,
  UserTransactionCategoriesEntity,
} from './entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([
      TransactionCategoryEntity,
      UserTransactionCategoriesEntity,
    ]),
  ],
  providers: [TransactionCategoriesResolver, TransactionCategoriesService],
  exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule {}
