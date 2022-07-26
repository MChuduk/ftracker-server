import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { User } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { SigninDto, SignupDto } from './dto';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = 60 * 15;
  private readonly REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7;

  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

  public async refresh(user: User, refreshToken: string) {
    const token = await this.findRefreshToken(user.id, refreshToken);
    if (!token) {
      throw new ForbiddenException('access denied');
    }
    await this.deleteRefreshToken(user.id, refreshToken);
    return await this.getJwtCookies(user);
  }

  public async logout(userId: string, refreshToken: string) {
    await this.deleteRefreshToken(userId, refreshToken);
  }

  public async getJwtCookies(user: User) {
    const { accessToken, refreshToken } = await this.signUser(user);
    const accessCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.ACCESS_TOKEN_EXPIRES_IN}`;
    const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.REFRESH_TOKEN_EXPIRES_IN}`;
    return { accessCookie, refreshCookie };
  }

  public getLogoutCookies() {
    const accessCookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    const refreshCookie = `Refresh=; HttpOnly; Path=/; Max-Age=0`;
    return { accessCookie, refreshCookie };
  }

  private async matchPasswords(password: string, user: User) {
    return await this.utilsService.compareHash(password, user.password);
  }

  private async signUser(user: User) {
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
    await this.saveRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const resfreshTokenHashed = await this.utilsService.hashString(
      refreshToken,
    );
    const tokens = await this.getRefreshTokens(userId);
    tokens.push(resfreshTokenHashed);

    await this.cacheManager.set(userId, tokens);
  }

  private async deleteRefreshToken(userId: string, refreshToken: string) {
    refreshToken = await this.findRefreshToken(userId, refreshToken);
    if (refreshToken) {
      let tokens = await this.getRefreshTokens(userId);
      tokens = tokens.filter((token) => token !== refreshToken);
      await this.cacheManager.set(userId, tokens);
    }
  }

  private async findRefreshToken(userId: string, refreshToken: string) {
    const tokens = await this.getRefreshTokens(userId);
    return tokens.find(
      async (token) => await this.utilsService.compareHash(refreshToken, token),
    );
  }

  private async getRefreshTokens(userId: string): Promise<string[]> {
    return (await this.cacheManager.get(userId)) || new Array<string>();
  }
}
