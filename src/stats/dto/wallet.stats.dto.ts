import { Field, ObjectType } from '@nestjs/graphql';
import { WalletDto } from '../../wallets/dto';

@ObjectType()
export class WalletStatsDto {
  @Field()
  readonly wallet: WalletDto;

  @Field()
  readonly totalAmount: number;
}
