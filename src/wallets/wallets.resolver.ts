import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  WalletCreateRequestDto,
  WalletDeleteRequestDto,
  WalletDto,
} from './dto';
import { WalletsService } from './wallets.service';
import { UserId } from '../auth/decorators';

@Resolver()
export class WalletsResolver {
  constructor(private readonly walletsService: WalletsService) {}

  @Query(() => [WalletDto], { name: 'wallets' })
  public async wallets(@UserId() userId: string): Promise<WalletDto[]> {
    return await this.walletsService.getAll(userId);
  }

  @Mutation(() => WalletDto, { name: 'createWallet' })
  public async createWallet(
    @UserId() userId: string,
    @Args('request') request: WalletCreateRequestDto,
  ): Promise<WalletDto> {
    return await this.walletsService.create(userId, request);
  }

  @Mutation(() => WalletDto, { name: 'deleteWallet' })
  public async deleteWallet(
    @Args('request') request: WalletDeleteRequestDto,
  ): Promise<WalletDto> {
    return this.walletsService.deleteWallet(request);
  }
}
