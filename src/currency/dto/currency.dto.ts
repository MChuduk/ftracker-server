import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Currency, CurrencyType } from '../model';

registerEnumType(CurrencyType, {
  name: 'CurrencyType',
});

@ObjectType()
export class CurrencyDto implements Currency {
  @Field(() => ID)
  readonly id?: string;
  @Field(() => CurrencyType)
  readonly type: CurrencyType;

  @Field()
  readonly name: string;

  @Field()
  readonly color: string;
  @Field()
  readonly rate: number;
}
