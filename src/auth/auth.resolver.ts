import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { SessionType } from 'src/sessions/types';
import { UserType } from 'src/users/types';
import { AuthService } from './auth.service';
import { Public, SessionId } from './decorators';
import { JwtRefreshGuard } from './guards';
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
  @Mutation(() => SessionType)
  public async signInLocal(
    @Context('res') res: Response,
    @SessionId() sessionId: string,
    @Args('credentials') credentials: SignInLocalInput,
  ) {
    const { session, accessCookie, refreshCookie } =
      await this.authService.signInLocal(sessionId, credentials);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Public()
  @Mutation(() => SessionType)
  public async logout(
    @Context('res') res: Response,
    @SessionId() sessionId: string,
  ) {
    const { session, accessCookie, refreshCookie } =
      await this.authService.logout(sessionId);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Mutation(() => SessionType)
  public async refresh(
    @Context('req') req: Request,
    @Context('res') res: Response,
    @SessionId() sessionId: string,
  ) {
    const oldRefreshToken = req?.cookies?.Refresh;
    const { session, accessCookie, refreshCookie } =
      await this.authService.refresh(sessionId, oldRefreshToken);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Query(() => UserType)
  public async currentUser(@SessionId() sessionId: string) {
    return await this.authService.getCurrentUser(sessionId);
  }

  @Public()
  @Query(() => String)
  public async test() {
    return `user`;
  }
}
