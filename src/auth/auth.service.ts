import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { UserEntity } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { SigninDto, SignupDto, SignUpLocalInput } from './dto';
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

  public async signUpLocal(input: SignUpLocalInput) {
    // const user: UserEntity = {
    //   email: '',
    //   password: '',
    // };
    return this.usersService.create(input);
  }

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
    const passwordMatches = this.utilsService.compareHash(
      signinDto.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new BadRequestException('wrong credentials');
    }
    return user;
  }

  public async getAuthCookies(accessToken: string, refreshToken: string) {
    const accessCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.ACCESS_TOKEN_EXPIRES_IN}`;
    const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.REFRESH_TOKEN_EXPIRES_IN}`;
    return { accessCookie, refreshCookie };
  }

  public getLogoutCookies() {
    const accessCookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    const refreshCookie = `Refresh=; HttpOnly; Path=/; Max-Age=0`;
    return { accessCookie, refreshCookie };
  }

  public async signUser(user: UserEntity) {
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
