import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class WalletStatsQueryRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly walletId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  readonly fromDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  readonly toDate?: string;
}
