import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Wallet } from '../model';

@ObjectType()
export class WalletDto implements Wallet {
  @Field(() => ID)
  readonly id?: string;

  @Field()
  readonly name: string;

  @Field(() => ID)
  readonly userId: string;

  @Field(() => ID)
  readonly currencyId: string;
}
