import { Module } from '@nestjs/common';
import { TransactionCategoriesResolver } from './transaction-categories.resolver';
import { TransactionCategoriesService } from './transaction.categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionCategoryEntity } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionCategoryEntity])],
  providers: [TransactionCategoriesResolver, TransactionCategoriesService],
  exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule {}
