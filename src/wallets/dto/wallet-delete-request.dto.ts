import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class WalletDeleteRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly walletId: string;
}
