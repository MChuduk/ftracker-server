import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class TransactionCategoryUpdateDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly categoryId: string;

  @Field({ nullable: true })
  @IsOptional()
  readonly active?: boolean;
}
