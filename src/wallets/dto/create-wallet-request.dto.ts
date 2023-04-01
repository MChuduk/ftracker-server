import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateWalletRequestDto {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @Field(() => ID)
  @IsUUID('4')
  userId: string;

  @Field(() => ID)
  @IsUUID('4')
  currencyId: string;
}
