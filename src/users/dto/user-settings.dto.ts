import { UserSettings } from '../model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSettingsDto implements UserSettings {
  @Field(() => ID)
  readonly id?: string;
}
