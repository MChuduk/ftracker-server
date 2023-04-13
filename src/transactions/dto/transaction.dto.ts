import { Transaction } from '../model';
import { Field, ObjectType } from '@nestjs/graphql';
import { WalletDto } from '../../wallets/dto';
import { TransactionCategoryDto } from '../../transaction-categories/dto';

@ObjectType()
export class TransactionDto implements Transaction {
  @Field()
  readonly id?: string;
  @Field()
  readonly amount: number;
  @Field()
  readonly description: string;
  @Field(() => String)
  readonly date: Date;
  @Field(() => String)
  readonly createdAt: Date;
  @Field(() => String)
  readonly updatedAt: Date;
  @Field()
  readonly categoryId: string;
  @Field()
  readonly userId: string;
  @Field()
  readonly walletId: string;
  @Field()
  readonly wallet?: WalletDto;
  @Field()
  readonly category?: TransactionCategoryDto;
}
