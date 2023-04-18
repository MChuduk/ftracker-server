import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  WalletCreateRequestDto,
  WalletDeleteRequestDto,
  WalletDto,
  WalletQueryRequestDto, WalletUpdateRequestDto,
} from './dto';
import { WalletsService } from './wallets.service';
import { UserId } from '../auth/decorators';

@Resolver()
export class WalletsResolver {
  constructor(private readonly walletsService: WalletsService) {}

  @Query(() => [WalletDto], { name: 'wallets' })
  public async wallets(
    @Args('request') request: WalletQueryRequestDto,
  ): Promise<WalletDto[]> {
    return await this.walletsService.getAll(request);
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
    @UserId() userId: string,
    @Args('request') request: WalletDeleteRequestDto,
  ): Promise<WalletDto> {
    return this.walletsService.deleteWallet(userId, request);
  }

  @Mutation(() => WalletDto, { name: 'updateWallet' })
  public async updateWallet(@Args('request') request: WalletUpdateRequestDto) {
    return this.walletsService.updateWallet(request);
  }
}
