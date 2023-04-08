import { Field, ID, InputType } from '@nestjs/graphql';
import { DatePeriodDto, PaginationDto } from '../../common/dto';
import { IsOptional } from 'class-validator';

@InputType()
export class TransactionQueryRequestDto {
  @Field({ nullable: true })
  @IsOptional()
  readonly pagination?: PaginationDto;

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
  readonly dateBetween?: DatePeriodDto;

  @Field({ nullable: true })
  @IsOptional()
  readonly dateOrder?: 'ASC' | 'DESC';
}
