import { Query, Resolver } from '@nestjs/graphql';
import { TransactionCategoryDto } from './dto';
import { TransactionCategoriesService } from './transaction.categories.service';

@Resolver()
export class TransactionCategoriesResolver {
  constructor(
    private readonly transactionCategoriesService: TransactionCategoriesService,
  ) {}
  @Query(() => [TransactionCategoryDto], {
    name: 'defaultTransactionCategories',
  })
  public async defaultTransactionCategories(): Promise<
    TransactionCategoryDto[]
  > {
    return this.transactionCategoriesService.getDefaultTransactionCategories();
  }
}
