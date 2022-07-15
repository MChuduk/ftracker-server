import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
  ) {}

  public async signUp(signUpDto: SignUpDto): Promise<User> {
    if (!this.isPasswordConfirmed(signUpDto)) {
      throw new BadRequestException('confirm the password');
    }
    if (await this.isAlreadyRegistered(signUpDto)) {
      throw new BadRequestException(
        `user with login ${signUpDto.login} already exists`,
      );
    }
    const hashPassword = await this.utilsService.hashString(signUpDto.password);
    const user = await this.usersService.create({
      login: signUpDto.login,
      password: hashPassword,
    });
    return user;
  }

  private isPasswordConfirmed(signUpDto: SignUpDto): boolean {
    return signUpDto.password === signUpDto.confirmPassword;
  }

  private async isAlreadyRegistered(signUpDto: SignUpDto): Promise<boolean> {
    const [candidate] = await this.usersService.findBy({
      login: signUpDto.login,
    });
    return candidate ? true : false;
  }
}
