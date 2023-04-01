import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import AccessTokenPayload from './model/access-token-payload';
import RefreshTokenPayload from './model/refresh-token-payload';
import { SignInRequestDto, SignUpRequestDto } from './dto';
import { User } from '../users/model';
import { LogoutResponse, RefreshResponse, SignInResponse } from './model';

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
  ) {}

  public async signUp(request: SignUpRequestDto): Promise<User> {
    if (await this.usersService.findByEmail(request.email)) {
      throw new BadRequestException(
        `user with email ${request.email} already exists`,
      );
    }
    const passwordHashed = await this.utilsService.hashString(request.password);
    return await this.usersService.create({
      displayName: request.displayName,
      email: request.email,
      password: passwordHashed,
    });
  }

  public async signIn(
    sessionId: string,
    request: SignInRequestDto,
  ): Promise<SignInResponse> {
    if (sessionId) {
      await this.sessionsService.delete(sessionId);
    }
    const user = await this.usersService.findByEmail(request.email);
    if (!user) {
      throw new BadRequestException('wrong credentials');
    }
    const passwordMatches = await this.utilsService.compareHash(
      request.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new BadRequestException('wrong credentials');
    }

    const session = await this.sessionsService.create(user);
    const accessToken = await this.generateAccessToken({ userId: user.id });
    const refreshToken = await this.generateRefreshToken({
      sessionId: session.id,
    });
    const refreshTokenHashed = await this.utilsService.hashString(refreshToken);

    await this.sessionsService.setRefreshToken(session.id, refreshTokenHashed);

    const { accessCookie, refreshCookie } = this.getAuthCookies(
      accessToken,
      refreshToken,
    );

    return { session, accessCookie, refreshCookie };
  }

  public async logout(sessionId: string): Promise<LogoutResponse> {
    const session = await this.sessionsService.findById(sessionId);
    if (session) {
      await this.sessionsService.delete(sessionId);
    } else {
      throw new UnauthorizedException();
    }

    const { accessCookie, refreshCookie } = this.getLogoutCookies();

    return { session, accessCookie, refreshCookie };
  }

  public async refresh(
    sessionId: string,
    oldRefreshToken: string,
  ): Promise<RefreshResponse> {
    const session = await this.sessionsService.findById(sessionId);
    if (!session) {
      throw new UnauthorizedException();
    }

    const refreshTokenMatches = await this.utilsService.compareHash(
      oldRefreshToken,
      session.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.generateAccessToken({
      userId: session.user.id,
    });
    const refreshToken = await this.generateRefreshToken({
      sessionId: session.id,
    });
    const refreshTokenHashed = await this.utilsService.hashString(refreshToken);

    await this.sessionsService.setRefreshToken(sessionId, refreshTokenHashed);

    const { accessCookie, refreshCookie } = this.getAuthCookies(
      accessToken,
      refreshToken,
    );

    return { session, accessCookie, refreshCookie };
  }

  public async getCurrentUser(sessionId: string): Promise<User> {
    const session = await this.sessionsService.findById(sessionId);
    return session?.user;
  }

  private async generateAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('APP_JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.ACCESS_TOKEN_EXPIRES_SECONDS,
    });
  }

  private async generateRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('APP_JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.REFRESH_TOKEN_EXPIRES_SECONDS,
    });
  }

  private getAuthCookies(accessToken: string, refreshToken: string) {
    const accessCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.ACCESS_TOKEN_EXPIRES_SECONDS}`;
    const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.REFRESH_TOKEN_EXPIRES_SECONDS}`;
    return { accessCookie, refreshCookie };
  }

  private getLogoutCookies() {
    const accessCookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    const refreshCookie = `Refresh=; HttpOnly; Path=/; Max-Age=0`;
    return { accessCookie, refreshCookie };
  }
}
