import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionCategoriesReportDataDto {
  @Field()
  readonly category: string;
  @Field()
  readonly categoryColor: string;
  @Field()
  readonly totalAmount: number;
}
