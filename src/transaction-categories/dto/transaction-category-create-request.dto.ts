import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class TransactionCategoryCreateRequestDto {
  @Field()
  @IsString()
  readonly name: string;
  @Field()
  @IsString()
  readonly svgPath: string;
  @Field()
  @IsString()
  readonly color: string;
}
