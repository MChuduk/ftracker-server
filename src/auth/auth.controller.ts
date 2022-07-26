import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/users/entities';
import { AuthService } from './auth.service';
import { GetUserId, GetRefreshToken, GetUser } from './decorators';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  public async signupLocal(@Body() signupDto: SignupDto) {
    return this.authService.signupLocal(signupDto);
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  public async signinLocal(
    @Req() request: Request,
    @Body() signinDto: SigninDto,
  ) {
    const user = await this.authService.signinLocal(signinDto);
    const { accessCookie, refreshCookie } =
      await this.authService.getJwtCookies(user);
    request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() request: Request,
    @GetUserId() userId: string,
    @GetRefreshToken() refreshToken: string,
  ) {
    const { accessCookie, refreshCookie } = this.authService.getLogoutCookies();
    request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return this.authService.logout(userId, refreshToken);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Req() request: Request,
    @GetUser() user: User,
    @GetRefreshToken() refreshToken: string,
  ) {
    const { accessCookie, refreshCookie } = await this.authService.refresh(
      user,
      refreshToken,
    );
    request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
  }
}
