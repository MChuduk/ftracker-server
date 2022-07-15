import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({ ...createUserDto });
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
