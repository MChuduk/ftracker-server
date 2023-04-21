import { Field, ObjectType } from '@nestjs/graphql';
import { UserBudgetReportDataDto } from './user-budget-report-data.dto';

@ObjectType()
export class UserBudgetReportDto {
  @Field(() => [UserBudgetReportDataDto])
  readonly data: UserBudgetReportDataDto[];
}
