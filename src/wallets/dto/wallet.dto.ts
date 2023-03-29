import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/types';
import { CurrencyDto } from '../../currency/dto';

@ObjectType()
export class WalletDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  user: UserType;

  @Field()
  currency: CurrencyDto;
}
