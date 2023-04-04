import { Query, Resolver } from '@nestjs/graphql';
import { TransactionCategoryDto } from './dto';
import { TransactionCategoriesService } from './transaction.categories.service';
import { UserId } from '../auth/decorators';

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

  @Query(() => [TransactionCategoryDto], { name: 'transactionCategories' })
  public async transactionCategories(
    @UserId() userId: string,
  ): Promise<TransactionCategoryDto[]> {
    return this.transactionCategoriesService.getUserCategories(userId);
  }
}
