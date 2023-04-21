import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from '../../common/dto';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class TransactionQueryCategoryDto {
  @Field(() => PaginationDto, { nullable: true })
  @IsOptional()
  readonly pagination?: PaginationDto;

  @Field({ nullable: true })
  @IsOptional()
  readonly active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly searchByName?: string;
}
