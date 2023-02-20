import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/types';

@ObjectType()
export class SessionType {
  @Field(() => ID)
  id: string;

  @Field()
  user: UserType;

  @Field()
  refreshToken: string;
}
