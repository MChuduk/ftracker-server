import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/types';

@ObjectType()
export class WalletType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  user: UserType;
}
