import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
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
      await this.authService.getAuthCookies(user);
    request.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout() {

  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh() {}
}
