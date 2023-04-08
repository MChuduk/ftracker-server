import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';
import { DatePeriodDto } from '../../common/dto';

@InputType()
export class WalletStatsQueryRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly walletId: string;
  @Field({ nullable: true })
  @IsOptional()
  readonly dateBetween?: DatePeriodDto;
}
