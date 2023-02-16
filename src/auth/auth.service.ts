import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { SessionsService } from 'src/sessions/sessions.service';
import { UserEntity } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { JwtPayload } from './types';
import { SignInLocalInput, SignUpLocalInput } from './types-input';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRES_SECONDS = 60 * 15;
  private readonly REFRESH_TOKEN_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async signUpLocal(credentials: SignUpLocalInput) {
    if (await this.usersService.findByEmail(credentials.email)) {
      throw new BadRequestException(
        `user with email ${credentials.email} already exists`,
      );
    }
    const passwordHashed = await this.utilsService.hashString(
      credentials.password,
    );
    const user = await this.usersService.create({
      email: credentials.email,
      password: passwordHashed,
    });
    return user;
  }

  public async signInLocal(credentials: SignInLocalInput) {
    const user = await this.usersService.findByEmail(credentials.email);
    if (!user) {
      throw new BadRequestException('wrong credentials');
    }
    const passwordMatches = await this.utilsService.compareHash(
      credentials.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new BadRequestException('wrong credentials');
    }

    const session = await this.sessionsService.create(user);
    const refreshToken = await this.generateRefreshToken(session.id);
    const accessToken = await this.generateAccessToken(user.id);

    return { session, accessToken, refreshToken };
  }

  public async generateRefreshToken(sessionId: string) {
    const payload = { sessionId };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('APP_JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.REFRESH_TOKEN_EXPIRES_SECONDS,
    });
  }

  public async generateAccessToken(userId: string) {
    const payload = { userId };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('APP_JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.REFRESH_TOKEN_EXPIRES_SECONDS,
    });
  }

  public getAuthCookies(accessToken: string, refreshToken: string) {
    const accessCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.ACCESS_TOKEN_EXPIRES_SECONDS}`;
    const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.REFRESH_TOKEN_EXPIRES_SECONDS}`;
    return { accessCookie, refreshCookie };
  }

  public getLogoutCookies() {
    const accessCookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    const refreshCookie = `Refresh=; HttpOnly; Path=/; Max-Age=0`;
    return { accessCookie, refreshCookie };
  }

  public async getRefreshTokens(userId: string) {
    const tokensList: string[] = (await this.cacheManager.get(userId)) || [];
    return tokensList;
  }

  public async saveRefreshToken(userId: string, refreshToken: string) {
    const tokensList = await this.getRefreshTokens(userId);
    tokensList.push(refreshToken);
    await this.cacheManager.set(userId, tokensList);
  }

  public async updateRefreshToken(
    userId: string,
    refreshToken: string,
    newRefreshToken: string,
  ) {
    const tokensList = await this.getRefreshTokens(userId);
    const index = tokensList.indexOf(refreshToken);
    tokensList[index] = newRefreshToken;
    await this.cacheManager.set(userId, tokensList);
  }

  public async deleteRefreshToken(userId: string, refreshToken: string) {
    let tokensList = await this.getRefreshTokens(userId);
    tokensList = tokensList.filter((token) => token !== refreshToken);
    if (tokensList.length === 0) {
      await this.cacheManager.del(userId);
      return;
    }
    await this.cacheManager.set(userId, tokensList);
  }

  public async existsRefreshToken(userId: string, refreshToken: string) {
    const tokensList = await this.getRefreshTokens(userId);
    return tokensList.includes(refreshToken);
  }
}
