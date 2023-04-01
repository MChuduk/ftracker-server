import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class WalletCreateRequestDto {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @Field(() => ID)
  @IsUUID('4')
  readonly currencyId: string;
}
