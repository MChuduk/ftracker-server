import { Injectable } from '@nestjs/common';
import { TransactionCategory } from './model';
import { Repository } from 'typeorm';
import { TransactionCategoryEntity } from './entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectRepository(TransactionCategoryEntity)
    private readonly transactionCategoriesRepository: Repository<TransactionCategoryEntity>,
  ) {}

  public async getDefaultTransactionCategories(): Promise<
    TransactionCategory[]
  > {
    return this.transactionCategoriesRepository
      .createQueryBuilder('category')
      .where('category.userId IS NULL')
      .getMany();
  }
}
