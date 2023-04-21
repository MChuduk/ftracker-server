import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class WalletUpdateRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly walletId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @Field(() => ID)
  @IsOptional()
  @IsUUID('4')
  readonly currencyId?: string;
}
