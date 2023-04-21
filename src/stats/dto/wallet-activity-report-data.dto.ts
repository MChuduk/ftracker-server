import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WalletActivityReportDataDto {
  @Field()
  readonly date: string;
  @Field()
  readonly count: number;
}
