import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;
}
