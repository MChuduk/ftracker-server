import { User } from '../model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDto implements User {
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly displayName: string;
  @Field()
  readonly email: string;
  @Field()
  readonly password: string;
  @Field()
  readonly settingsId?: string;
}
