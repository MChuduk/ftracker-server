import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from './pagination.dto';
import { IsOptional } from 'class-validator';

@InputType()
export class BaseQueryRequestDto {
  @Field({ nullable: true })
  @IsOptional()
  readonly pagination?: PaginationDto;
}
