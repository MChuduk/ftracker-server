import { Field, ID, InputType } from '@nestjs/graphql';
import { BaseQueryRequestDto } from '../../common/dto';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class TransactionQueryRequestDto extends BaseQueryRequestDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  readonly userId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  readonly walletId?: string;
  @Field(() => ID, { nullable: true })
  @IsOptional()
  readonly currencyId?: string;

  @Field({ nullable: true })
  @IsOptional()
  readonly date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  readonly fromDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  readonly toDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  readonly dateOrder?: 'ASC' | 'DESC';
}
