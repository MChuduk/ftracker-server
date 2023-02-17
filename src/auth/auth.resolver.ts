import { HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
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
      const session = await this.sessionsService.findById(sessionId);
      console.log('123', session.user);
      if (session) return session;
    }

    const { session, accessToken, refreshToken } =
      await this.authService.signInLocal(credentials);

    const { accessCookie, refreshCookie } = this.getAuthCookies(
      accessToken,
      refreshToken,
    );
    console.log('2');
    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Mutation(() => SessionType)
  public async logout(
    @Context('res') res: Response,
    @SessionId() sessionId: string,
  ) {
    const session = await this.sessionsService.findById(sessionId);
    if (session) {
      await this.sessionsService.delete(sessionId);
    } else {
      throw new UnauthorizedException();
    }

    const { accessCookie, refreshCookie } = this.getLogoutCookies();
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

  private getAuthCookies(accessToken: string, refreshToken: string) {
    const accessCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.authService.ACCESS_TOKEN_EXPIRES_SECONDS}`;
    const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.authService.REFRESH_TOKEN_EXPIRES_SECONDS}`;
    return { accessCookie, refreshCookie };
  }

  private getLogoutCookies() {
    const accessCookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    const refreshCookie = `Refresh=; HttpOnly; Path=/; Max-Age=0`;
    return { accessCookie, refreshCookie };
  }
}
