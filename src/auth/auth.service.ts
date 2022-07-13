import { Injectable } from '@nestjs/common';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Injectable()
export class AuthService {
  public signUp(signUpUserDto: SignUpUserDto) {
    return 'test';
  }
}
