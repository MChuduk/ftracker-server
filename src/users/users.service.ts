import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { UtilsService } from 'src/utils/utils.service';
import { Repository } from 'typeorm';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    private readonly utilsService: UtilsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(user: User): Promise<User> {
    await this.usersRepository.save(user);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  public async findBy(options: Partial<User>): Promise<User[]> {
    const users = await this.usersRepository.findBy({ ...options });
    return users;
  }

  public async saveRefreshToken(user: User, token: string) {
    const tokenHashed = await this.utilsService.hashString(token);
    const tokens: string[] =
      (await this.cacheManager.get(user.id)) || new Array<string>();
    tokens.push(tokenHashed);
    await this.cacheManager.set(user.id, tokens);
  }
}
