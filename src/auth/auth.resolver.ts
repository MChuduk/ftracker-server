import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { SignUpLocalInput } from './dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => String)
  public async signUpLocal(
    @Args('input') input: SignUpLocalInput,
  ) {}
}
