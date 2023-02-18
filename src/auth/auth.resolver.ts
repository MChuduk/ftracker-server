import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { SessionsService } from 'src/sessions/sessions.service';
import { SessionType } from 'src/sessions/types';
import { UserType } from 'src/users/types';
import { AuthService } from './auth.service';
import { Public, SessionId } from './decorators';
import { SignInLocalInput, SignUpLocalInput } from './types-input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
  ) {}

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
    if (sessionId) {
      await this.sessionsService.delete(sessionId);
    }

    const { session, accessCookie, refreshCookie } =
      await this.authService.signInLocal(credentials);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

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

  @Mutation(() => SessionType)
  public async refresh(@SessionId() sessionId: string) {
    return await this.authService.refresh(sessionId);
  }

  @Query(() => String)
  public async test() {
    return `user`;
  }
}
