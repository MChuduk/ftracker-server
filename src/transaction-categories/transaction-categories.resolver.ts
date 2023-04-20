import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionCategoryDto } from './dto';
import { TransactionCategoriesService } from './transaction.categories.service';
import { UserId } from '../auth/decorators';
import { TransactionQueryCategoryDto } from './dto/transaction-query-category.dto';
import { TransactionCategoryUpdateDto } from './dto/transaction-category-update.dto';
import { TransactionCategoryCreateRequestDto } from './dto/transaction-category-create-request.dto';
import { TransactionCategoryDeleteRequestDto } from './dto/transaction-category-delete-request.dto';

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
    @Args('request') request: TransactionQueryCategoryDto,
  ): Promise<TransactionCategoryDto[]> {
    return this.transactionCategoriesService.getUserCategories(userId, request);
  }

  @Mutation(() => TransactionCategoryDto, { name: 'updateTransactionCategory' })
  public async updateTransactionCategory(
    @UserId() userId: string,
    @Args('request') request: TransactionCategoryUpdateDto,
  ): Promise<TransactionCategoryDto> {
    return this.transactionCategoriesService.updateTransactionCategory(
      userId,
      request,
    );
  }

  @Mutation(() => TransactionCategoryDto, { name: 'createTransactionCategory' })
  public async create(
    @UserId() userId: string,
    @Args('request') request: TransactionCategoryCreateRequestDto,
  ) {
    return this.transactionCategoriesService.create(userId, request);
  }

  @Mutation(() => TransactionCategoryDto, { name: 'deleteTransactionCategory' })
  public delete(@Args('request') request: TransactionCategoryDeleteRequestDto) {
    return this.transactionCategoriesService.delete(request);
  }
}
