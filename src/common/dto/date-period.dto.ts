import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@InputType()
export class DatePeriodDto {
  @Field()
  @IsDate()
  readonly startDate: string;
  @Field()
  @IsDate()
  readonly endDate: string;
}
