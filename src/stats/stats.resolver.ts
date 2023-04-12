import { Args, Query, Resolver } from '@nestjs/graphql';
import { StatsService } from './stats.service';
import {
  UserBudgetReportDto,
  WalletStatsByDatesDto,
  WalletStatsByDatesQueryRequestDto,
  WalletStatsDto,
  WalletStatsQueryRequestDto,
} from './dto';
import { UserId } from '../auth/decorators';
import { TransactionQueryRequestDto } from '../transactions/dto';

@Resolver()
export class StatsResolver {
  constructor(private readonly statsService: StatsService) {}

  @Query(() => WalletStatsDto, { name: 'walletStats' })
  public async walletStats(
    @UserId() userId: string,
    @Args('request') request: WalletStatsQueryRequestDto,
  ): Promise<WalletStatsDto> {
    return this.statsService.getWalletStats(userId, request);
  }

  @Query(() => WalletStatsByDatesDto, { name: 'walletStatsByDates' })
  public async walletStatsByDates(
    @UserId() userId: string,
    @Args('request') request: WalletStatsByDatesQueryRequestDto,
  ): Promise<WalletStatsByDatesDto> {
    return this.statsService.getWalletsStatsByDates(userId, request);
  }

  @Query(() => UserBudgetReportDto, { name: 'userBudgetReport' })
  public async userBudgetReport(
    @Args('request') request: TransactionQueryRequestDto,
  ): Promise<UserBudgetReportDto> {
    return this.statsService.getUserBudgetReport(request);
  }
}
