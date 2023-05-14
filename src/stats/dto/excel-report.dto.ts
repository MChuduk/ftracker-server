import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExcelReportDto {
  @Field()
  readonly filename: string;
  @Field()
  readonly mimetype: string;
  @Field()
  readonly encoding: string;
  @Field()
  readonly content: string;
}
