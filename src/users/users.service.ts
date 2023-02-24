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

  public async create(user: UserEntity): Promise<UserEntity> {
    await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(user)
      .execute();

    return await this.findByEmail(user.email);
  }

  public async findById(userId: string): Promise<UserEntity> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }
}
