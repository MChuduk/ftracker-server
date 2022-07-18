import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  public signUpLocal(@Body() signUpDto: SignUpDto) {
    return this.authService.signUpLocal(signUpDto);
  }

  @Post('local/signin')
  public signInLocal() {}

  @Post('logout')
  public logout() {}

  @Post('refresh')
  public refreshTokens() {}
}
