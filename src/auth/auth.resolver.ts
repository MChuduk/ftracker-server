import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { UserType } from 'src/users/types';
import { AuthService } from './auth.service';
import { Public, SessionId } from './decorators';
import { JwtRefreshGuard } from './guards';
import { UserDto } from '../users/dto';
import { SignInRequestDto, SignUpRequestDto } from './dto';
import { SessionDto } from '../sessions/dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => UserDto, { name: 'signUp' })
  public async signUp(
    @Args('request') request: SignUpRequestDto,
  ): Promise<UserDto> {
    return await this.authService.signUp(request);
  }

  @Public()
  @Mutation(() => SessionDto, { name: 'signIn' })
  public async signIn(
    @Context('res') res: Response,
    @SessionId() sessionId: string,
    @Args('request') request: SignInRequestDto,
  ): Promise<SessionDto> {
    const { session, accessCookie, refreshCookie } =
      await this.authService.signIn(sessionId, request);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Public()
  @Mutation(() => SessionDto, { name: 'logout' })
  public async logout(
    @Context('res') res: Response,
    @SessionId() sessionId: string,
  ): Promise<SessionDto> {
    const { session, accessCookie, refreshCookie } =
      await this.authService.logout(sessionId);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Mutation(() => SessionDto, { name: 'refresh' })
  public async refresh(
    @Context('req') req: Request,
    @Context('res') res: Response,
    @SessionId() sessionId: string,
  ): Promise<SessionDto> {
    const oldRefreshToken = req?.cookies?.Refresh;
    const { session, accessCookie, refreshCookie } =
      await this.authService.refresh(sessionId, oldRefreshToken);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Query(() => UserDto, { name: 'currentUser' })
  public async currentUser(@SessionId() sessionId: string): Promise<UserDto> {
    return await this.authService.getCurrentUser(sessionId);
  }
}
