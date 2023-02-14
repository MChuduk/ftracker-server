import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async create(user: UserEntity) {
    const query = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        password: 'test',
      });
    return query.execute();
  }

  public async findByEmail(email: string): Promise<UserEntity | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  public async findBy(options: Partial<UserEntity>): Promise<UserEntity[]> {
    const users = await this.usersRepository.findBy({ ...options });
    return users;
  }
}
