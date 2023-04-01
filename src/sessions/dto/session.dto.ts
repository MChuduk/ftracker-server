import { Session } from '../model';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../users/dto';

@ObjectType()
export class SessionDto implements Session {
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly refreshToken: string;
  @Field()
  readonly user: UserDto;
}
