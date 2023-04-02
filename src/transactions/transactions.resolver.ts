import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { TransactionCreateRequestDto, TransactionDto } from './dto';
import { UserId } from '../auth/decorators';

@Resolver()
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [TransactionDto])
  public async transactions(@UserId() userId: string): Promise<TransactionDto[]> {
    return this.transactionsService.getAll(userId);
  }

  @Mutation(() => TransactionDto, { name: 'createTransaction' })
  public async create(
    @UserId() userId: string,
    @Args('request') request: TransactionCreateRequestDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.create(userId, request);
  }
}