import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.create({
      login: '1',
      password: '2',
    });
    return 'test';
  }
}
