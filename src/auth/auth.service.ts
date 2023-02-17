import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from 'src/sessions/sessions.service';
import { UserEntity } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import JwtPayload from './interfaces/jwt-payload.interface';
import { SignInLocalInput, SignUpLocalInput } from './types-input';

@Injectable()
export class AuthService {
  public readonly ACCESS_TOKEN_EXPIRES_SECONDS = 60 * 15;
  public readonly REFRESH_TOKEN_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    const { accessToken, refreshToken } = await this.signUser(user, session.id);

    return { session, accessToken, refreshToken };
  }

  public async refresh(sessionId: string) {
    const session = await this.sessionsService.findById(sessionId);
    console.log(session);
    return session;
  }

  private async signUser(user: UserEntity, sessionId: string) {
    const payload: JwtPayload = { userId: user.id, sessionId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('APP_JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.ACCESS_TOKEN_EXPIRES_SECONDS,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('APP_JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.REFRESH_TOKEN_EXPIRES_SECONDS,
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
