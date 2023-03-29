import { Query, Resolver } from '@nestjs/graphql';
import { CurrencyDto } from './dto';
import { CurrencyService } from './currency.service';

@Resolver()
export class CurrencyResolver {
  constructor(private readonly currencyService: CurrencyService) {}
  @Query(() => [CurrencyDto])
  public async getAllCurrency() {
    return await this.currencyService.getAll();
  }
}
