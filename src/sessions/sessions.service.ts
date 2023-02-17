import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities';
import { Repository } from 'typeorm';
import { SessionEntity } from './entities';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
  ) {}

  public async create(user: UserEntity) {
    const session = this.sessionsRepository.create({ user });

    await this.sessionsRepository
      .createQueryBuilder()
      .insert()
      .into(SessionEntity)
      .values(session)
      .execute();

    return session;
  }

  public async findById(sessionId: string) {
    return await this.sessionsRepository
      .createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId })
      .getOne();
  }
}
