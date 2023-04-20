import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class TransactionCategoryDeleteRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly categoryId: string;
}
