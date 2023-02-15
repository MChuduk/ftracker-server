import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities';
import { AuthService } from './auth.service';
import { GetUserId, GetRefreshToken, GetUser, Public } from './decorators';
import { SigninDto, SignupDto } from './dto';
import { JwtRefreshGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  public async signupLocal(@Body() signupDto: SignupDto) {
    // return this.authService.signupLocal(signupDto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  public async signinLocal(
    @Req() request: Request,
    @Body() signinDto: SigninDto,
  ) {
    // const user = await this.authService.signinLocal(signinDto);

    // const { accessToken, refreshToken } = await this.authService.signUser(user);
    // await this.authService.saveRefreshToken(user.id, refreshToken);

    // const { accessCookie, refreshCookie } =
    //   await this.authService.getAuthCookies(accessToken, refreshToken);
    // request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    // return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() request: Request,
    @GetUserId() userId: string,
    @GetRefreshToken() refreshToken: string,
  ) {
    if (await this.authService.existsRefreshToken(userId, refreshToken)) {
      await this.authService.deleteRefreshToken(userId, refreshToken);
    }
    const { accessCookie, refreshCookie } = this.authService.getLogoutCookies();
    request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Req() request: Request,
    @GetUser() user: UserEntity,
    @GetRefreshToken() oldRefreshToken: string,
  ) {
    // if (
    //   !(await this.authService.existsRefreshToken(user.id, oldRefreshToken))
    // ) {
    //   throw new ForbiddenException('access denied');
    // }
    // const { accessToken, refreshToken } = await this.authService.signUser(user);
    // await this.authService.updateRefreshToken(
    //   user.id,
    //   oldRefreshToken,
    //   refreshToken,
    // );

    // const { accessCookie, refreshCookie } =
    //   await this.authService.getAuthCookies(accessToken, refreshToken);
    // request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
  }
}
