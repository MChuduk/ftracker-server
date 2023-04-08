import { Field, ObjectType } from '@nestjs/graphql';
import { WalletDto } from '../../wallets/dto';

@ObjectType()
class DatesDto {
  @Field()
  readonly date: string;
  @Field()
  readonly amount: number;
}

@ObjectType()
export class WalletStatsByDatesDto {
  @Field()
  readonly wallet: WalletDto;
  @Field(() => [DatesDto])
  readonly dates: Array<DatesDto>;
}
