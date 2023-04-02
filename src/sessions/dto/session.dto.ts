import { Session } from '../model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionDto implements Session {
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly refreshToken: string;
  @Field(() => ID)
  readonly userId: string;
}
