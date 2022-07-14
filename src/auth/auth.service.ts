import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  public signUp(signUpDto: SignUpDto) {
    return 'test';
  }
}
