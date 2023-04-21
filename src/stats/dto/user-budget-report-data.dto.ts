import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserBudgetReportDataDto {
  @Field()
  readonly date: string;
  @Field()
  readonly totalAmount: number;
}
