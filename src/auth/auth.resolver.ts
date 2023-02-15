import { Req } from '@nestjs/common';
import { Args, Context, GqlExecutionContext, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { SessionType } from 'src/sessions/types';
import { UserType } from 'src/users/types';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { SignInLocalInput, SignUpLocalInput } from './types-input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => UserType)
  public async signUpLocal(@Args('credentials') credentials: SignUpLocalInput) {
    return await this.authService.signUpLocal(credentials);
  }

  @Public()
  @Query(() => SessionType)
  public async signInLocal(
    @Context() context: GraphQLExecutionContext,
    @Args('credentials') credentials: SignInLocalInput,
  ) {
    const { session, accessToken, refreshToken } =
      await this.authService.signInLocal(credentials);

    const { accessCookie, refreshCookie } = this.authService.getAuthCookies(
      accessToken,
      refreshToken,
    );
    //const ctx = GqlExecutionContext.create(context);
    //console.log(ctx.req);

    // request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }
}
