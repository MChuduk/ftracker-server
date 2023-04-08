import { Field, InputType } from '@nestjs/graphql';
import { DatePeriodDto, PaginationDto } from '../../common/dto';
import { IsOptional } from 'class-validator';

@InputType()
export class TransactionQueryRequestDto {
  @Field({ nullable: true })
  @IsOptional()
  readonly pagination?: PaginationDto;

  @Field({ nullable: true })
  @IsOptional()
  readonly dateBetween?: DatePeriodDto;
  @Field({ nullable: true })
  @IsOptional()
  readonly dateOrder?: 'ASC' | 'DESC';
}
