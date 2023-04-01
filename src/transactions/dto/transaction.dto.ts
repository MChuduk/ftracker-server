import { Transaction } from '../model';
import { UserDto } from '../../users/dto';
import { WalletDto } from '../../wallets/dto';
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
  readonly user: UserDto;
  @Field()
  readonly wallet: WalletDto;
}
