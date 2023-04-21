import { Field, ObjectType } from '@nestjs/graphql';
import { WalletActivityReportDataDto } from './wallet-activity-report-data.dto';

@ObjectType()
export class WalletActivityReportDto {
  @Field(() => [WalletActivityReportDataDto])
  readonly data: WalletActivityReportDataDto[];
}
