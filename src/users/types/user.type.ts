import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  displayName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
