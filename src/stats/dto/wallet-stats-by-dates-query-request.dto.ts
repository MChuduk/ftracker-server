import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';
import { DatePeriodDto } from '../../common/dto';

@InputType()
export class WalletStatsByDatesQueryRequestDto {
  @Field(() => ID)
  @IsUUID('4')
  readonly walletId: string;

  // @Field(() => ID)
  // @IsUUID('4')
  // readonly currencyId: string;

  @Field()
  @IsOptional()
  readonly dateBetween: DatePeriodDto;
}
