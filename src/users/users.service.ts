import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(user: User): Promise<User> {
    await this.usersRepository.save(user);
    return user;
  }

  public async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  public async findBy(options: Partial<User>): Promise<User[]> {
    const users = await this.usersRepository.findBy({ ...options });
    return users;
  }
}
