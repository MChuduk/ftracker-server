import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class WalletQueryRequestDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4')
  readonly userId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4')
  readonly walletId?: string;

  @Field({ nullable: true })
  @IsOptional()
  readonly searchByName?: string;
}
