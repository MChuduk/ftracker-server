import { Transaction } from '../model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionDto implements Transaction {
  @Field()
  readonly id?: string;
  @Field()
  readonly amount: number;
  @Field()
  readonly description: string;
  @Field()
  readonly date: Date;
  @Field()
  readonly userId: string;
  @Field()
  readonly walletId: string;
}
