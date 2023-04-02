import { TransactionCategory } from '../model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionCategoryDto implements TransactionCategory {
  @Field(() => ID)
  readonly id?: string;
  @Field()
  readonly name: string;
  @Field()
  readonly color: string;
  @Field()
  readonly svgPath: string;
}
