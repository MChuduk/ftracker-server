import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  public signupLocal(@Body() signupDto: SignupDto) {
    return this.authService.signupLocal(signupDto);
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  public signinLocal(@Body() signinDto: SigninDto) {
    return this.authService.signinLocal(signinDto);
  }

  @Post('test')
  test() {
    return this.authService.test();
  }
}
