import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Currency, CurrencyType } from '../model';

registerEnumType(CurrencyType, {
  name: 'CurrencyType',
});

@ObjectType()
export class CurrencyDto implements Currency {
  @Field(() => ID)
  id: string;
  @Field(() => CurrencyType)
  type: CurrencyType;

  @Field()
  name: string;

  @Field()
  color: string;
  @Field()
  rate: number;
}
