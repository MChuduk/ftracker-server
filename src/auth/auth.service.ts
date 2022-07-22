import {
  BadRequestException,
  CACHE_MANAGER,
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
  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async signupLocal(signupDto: SignupDto) {
    if (await this.findCandidate(signupDto.email)) {
      throw new BadRequestException(
        `user with email ${signupDto.email} already exists`,
      );
    }
    const hashPassword = await this.utilsService.hashString(signupDto.password);
    const user = await this.usersService.create({
      email: signupDto.email,
      password: hashPassword,
    });
    return user;
  }

  public async signinLocal(signinDto: SigninDto) {
    const user = await this.findCandidate(signinDto.email);
    if (!user) {
      throw new BadRequestException('wrong credentials');
    }
    if (!(await this.matchPasswords(signinDto.password, user))) {
      throw new BadRequestException('wrong credentials');
    }
    const tokens = await this.signUser(user);
    return { user, tokens };
  }

  public async test() {
    await this.cacheManager.set('test', 123);
    // return await this.cacheManager.get('test');
  }

  private async findCandidate(email: string): Promise<User> {
    const [user] = await this.usersService.findBy({ email });
    return user;
  }

  private async matchPasswords(password: string, user: User): Promise<boolean> {
    const [, salt] = user.password.split(':');
    const hashPassword = await this.utilsService.hashString(password, salt);
    return user.password === hashPassword;
  }

  private async signUser(user: User): Promise<string> {
    const payload: JwtPayload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('APP_JWT_SECRET'),
      expiresIn: '15m',
    });
    return token;
  }
}
