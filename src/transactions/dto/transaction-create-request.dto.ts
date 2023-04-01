import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class TransactionCreateRequestDto {
  @Field()
  @IsNumber()
  readonly amount: number;
  @Field()
  @IsString()
  readonly description: string;
  @Field()
  @IsDate()
  date: Date;
  @Field(() => ID)
  @IsUUID()
  readonly walletId: string;
}
