import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CurrencyDto } from '../../currency/dto';
import { Wallet } from '../model';
import { UserDto } from '../../users/dto';

@ObjectType()
export class WalletDto implements Wallet {
  @Field(() => ID)
  readonly id?: string;

  @Field()
  readonly name: string;

  @Field()
  readonly user: UserDto;

  @Field()
  readonly currency: CurrencyDto;
}
