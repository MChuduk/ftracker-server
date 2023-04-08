import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class PaginationDto {
  @Field()
  @IsNumber()
  readonly page: number;
  @Field()
  @IsNumber()
  readonly limit: number;
}
