import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { WalletType } from './types';
import { CreateWalletInput } from './types-input';
import { WalletsService } from './wallets.service';

@Resolver()
export class WalletsResolver {
  constructor(private readonly walletsService: WalletsService) {}

  @Mutation(() => WalletType)
  public async createWallet(@Args('input') input: CreateWalletInput) {
    return await this.walletsService.create(input);
  }
}
