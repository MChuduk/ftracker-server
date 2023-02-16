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
import { SessionType } from 'src/sessions/types';
import { UserEntity } from 'src/users/entities';
import { UserType } from 'src/users/types';
import { AuthService } from './auth.service';
import { CurrentUser, IsAuthorized, Public } from './decorators';
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
    @IsAuthorized() isAuthorized: boolean,
    @Context('res') res: Response,
    @Args('credentials') credentials: SignInLocalInput,
  ) {
    // const response: Response = context.getContext;
    // if (user) console.log('already sign in');

    const { session, accessToken, refreshToken } =
      await this.authService.signInLocal(credentials);

    const { accessCookie, refreshCookie } = this.authService.getAuthCookies(
      accessToken,
      refreshToken,
    );
    //context.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    //const ctx = GqlExecutionContext.create(context);
    //console.log(ctx.req);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return session;
  }

  @Query(() => String)
  public async test(@CurrentUser() user: UserEntity) {
    console.log(user);
    return `user`;
  }
}
