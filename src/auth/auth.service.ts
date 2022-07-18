import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signUpLocal(signUpDto: SignUpDto): Promise<User> {
    if (!this.isPasswordConfirmed(signUpDto)) {
      throw new BadRequestException('confirm the password');
    }
    if (await this.isAlreadyRegistered(signUpDto)) {
      throw new BadRequestException(
        `user with email ${signUpDto.email} already exists`,
      );
    }
    const hashPassword = await this.utilsService.hashString(signUpDto.password);
    const user = await this.usersService.create({
      email: signUpDto.email,
      password: hashPassword,
    });
    console.log(await this.generateTokens(user));
    return user;
  }

  private isPasswordConfirmed(signUpDto: SignUpDto): boolean {
    return signUpDto.password === signUpDto.confirmPassword;
  }

  private async isAlreadyRegistered(signUpDto: SignUpDto): Promise<boolean> {
    const [candidate] = await this.usersService.findBy({
      email: signUpDto.email,
    });
    return candidate ? true : false;
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const payload = { id: user.id, email: user.email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('APP_JWT_AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('APP_JWT_RT_SECRET'),
        expiresIn: '14d',
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
