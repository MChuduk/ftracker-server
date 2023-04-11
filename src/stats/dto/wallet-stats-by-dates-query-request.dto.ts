import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class WalletStatsByDatesQueryRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly walletId: string;

  // @Field(() => ID)
  // @IsUUID('4')
  // readonly currencyId: string;

  @Field()
  @IsOptional()
  @IsDateString()
  readonly fromDate?: string;

  @Field()
  @IsOptional()
  @IsDateString()
  readonly toDate?: string;
}
