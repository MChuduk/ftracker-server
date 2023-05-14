import { Field, ObjectType } from '@nestjs/graphql';
import { TransactionCategoriesReportDataDto } from './transaction-categories-report-data.dto';

@ObjectType()
export class TransactionCategoriesReport {
  @Field(() => [TransactionCategoriesReportDataDto])
  readonly data: TransactionCategoriesReportDataDto[];
}
