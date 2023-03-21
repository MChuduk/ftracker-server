import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateWalletDto, GetAllWalletsDto, WalletDto } from './dto';
import { WalletsService } from './wallets.service';

@Resolver()
export class WalletsResolver {
  constructor(private readonly walletsService: WalletsService) {}

  @Query(() => [WalletDto])
  public async getAllWallets(@Args('input') input: GetAllWalletsDto) {
    return await this.walletsService.getAll(input.userId);
  }

  @Mutation(() => WalletDto)
  public async createWallet(@Args('input') input: CreateWalletDto) {
    return await this.walletsService.create(input);
  }
}
