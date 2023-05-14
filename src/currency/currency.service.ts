import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CurrencyEntity } from './entity';
import { Currency, CurrencyType } from './model';

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {}

  async onModuleInit() {
    await this.addDefaultCurrency();
    // await this.fetchCurrency();
  }

  public async create(currency: Currency): Promise<void> {
    await this.currencyRepository
      .createQueryBuilder()
      .insert()
      .into(CurrencyEntity)
      .values(currency)
      .execute();
  }

  public async getAll(): Promise<Currency[]> {
    return await this.currencyRepository.createQueryBuilder().getMany();
  }

  public async updateCurrencyRate(id: string, rate: number) {
    await this.currencyRepository
      .createQueryBuilder('currency')
      .update(CurrencyEntity)
      .set({ rate })
      .where('currency.id = :id', { id })
      .execute();
  }

  public async getByType(type: string): Promise<Currency> {
    const query = await this.currencyRepository
      .createQueryBuilder('currency')
      .where('currency.type = :type', { type });

    return query.getOne();
  }

  public async getById(id: string): Promise<Currency> {
    return await this.currencyRepository
      .createQueryBuilder('currency')
      .where('currency.id = :id', { id })
      .getOne();
  }

  private async addDefaultCurrency() {
    await this.upsertCurrency({
      type: CurrencyType.BYN,
      name: 'Белорусский рубль',
      createdAt: new Date(),
      updatedAt: new Date(),
      rate: 1,
      color: '',
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  private async fetchCurrency() {
    console.log('[CurrencyServiceCron]: start fetching data');
    const currencyIds = {
      [CurrencyType.USD]: '431',
      [CurrencyType.EUR]: '451',
    };
    for (const [type, id] of Object.entries(currencyIds)) {
      try {
        const { data } = await this.httpService.axiosRef.get(
          `https://www.nbrb.by/api/exrates/rates/${id}`,
        );
        await this.upsertCurrency({
          type: CurrencyType[type],
          name: data.Cur_Name,
          rate: +data.Cur_OfficialRate,
          createdAt: new Date(),
          updatedAt: new Date(),
          color: '',
        });
      } catch (error) {
        console.log(`[CurrencyServiceCron]: fetching currency error ${error}`);
      }
    }
  }

  private async upsertCurrency(newCurrency: Currency): Promise<void> {
    const currency = await this.getByType(newCurrency.type);
    if (currency) {
      return await this.updateCurrencyRate(currency.id, newCurrency.rate);
    } else {
      return await this.create(newCurrency);
    }
  }
}
