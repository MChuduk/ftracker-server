import { ExecutionContext, Req, Session } from '@nestjs/common';
import {
  Args,
  Context,
  GqlExecutionContext,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Request, Response } from 'express';
import { SessionsService } from 'src/sessions/sessions.service';
import { SessionType } from 'src/sessions/types';
import { UserEntity } from 'src/users/entities';
import { UserType } from 'src/users/types';
import { AuthService } from './auth.service';
import { CurrentUser, Public, SessionId } from './decorators';
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
  @Query(() => SessionType)
  public async signInLocal(
    @SessionId() sessionId: string,
    @Context('res') res: Response,
    @Args('credentials') credentials: SignInLocalInput,
  ) {
    if (sessionId) {
      const session = await this.sessionsService.findById(sessionId);
      if (session) return session;
    }

    const { session, accessToken, refreshToken } =
      await this.authService.signInLocal(credentials);

    const { accessCookie, refreshCookie } = this.authService.getAuthCookies(
      accessToken,
      refreshToken,
    );
    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Query(() => String)
  public async test(@CurrentUser() user: UserEntity) {
    console.log(user);
    return `user`;
  }
}
