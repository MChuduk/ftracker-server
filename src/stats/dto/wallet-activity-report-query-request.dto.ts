import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class WalletActivityReportQueryRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly walletId: string;
  @Field({ nullable: true })
  @IsOptional()
  readonly fromDate?: string;
  @Field({ nullable: true })
  @IsOptional()
  readonly toDate?: string;
}
