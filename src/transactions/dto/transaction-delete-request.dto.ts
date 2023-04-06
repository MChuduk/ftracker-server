import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class TransactionDeleteRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly transactionId: string;
}
