import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { SigninDto, SignupDto } from './dto';
import { JwtPayload, JwtTokens } from './types';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = '15m';
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signupLocal(signupDto: SignupDto) {
    if (await this.usersService.findByEmail(signupDto.email)) {
      throw new BadRequestException(
        `user with email ${signupDto.email} already exists`,
      );
    }
    const passwordHashed = await this.utilsService.hashString(
      signupDto.password,
    );
    const user = await this.usersService.create({
      email: signupDto.email,
      password: passwordHashed,
    });
    return user;
  }

  public async signinLocal(signinDto: SigninDto) {
    const user = await this.usersService.findByEmail(signinDto.email);
    if (!user) {
      throw new BadRequestException('wrong credentials');
    }
    if (!(await this.matchPasswords(signinDto.password, user))) {
      throw new BadRequestException('wrong credentials');
    }
    return user;
  }

  public async logout() {}

  public async getAuthCookies(user: User) {
    const tokens = await this.signUser(user);

    const accessCookie = `Authentication=${tokens.accessToken}; HttpOnly; Path=/; Max-Age=${this.ACCESS_TOKEN_EXPIRES_IN}`;
    const refreshCookie = `Refresh=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=${this.REFRESH_TOKEN_EXPIRES_IN}`;

    await this.usersService.saveRefreshToken(user, tokens.refreshToken);

    return { accessCookie, refreshCookie };
  }

  private async matchPasswords(password: string, user: User): Promise<boolean> {
    const [, salt] = user.password.split(':');
    const hashPassword = await this.utilsService.hashString(password, salt);
    return user.password === hashPassword;
  }

  private async signUser(user: User): Promise<JwtTokens> {
    const payload: JwtPayload = { id: user.id, email: user.email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('APP_JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('APP_JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
