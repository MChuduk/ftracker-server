import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateWalletInput {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @Field(() => ID)
  @IsUUID('4')
  userId: string;
}
