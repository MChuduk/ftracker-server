import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities';
import { Repository } from 'typeorm';
import { SessionEntity } from './entities';
import { Session } from './model';
import {User} from "../users/model";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
  ) {}

  public async create(user: User): Promise<Session> {
    const session = this.sessionsRepository.create({ user });

    await this.sessionsRepository
      .createQueryBuilder()
      .insert()
      .into(SessionEntity)
      .values(session)
      .execute();

    return session;
  }

  public async findById(sessionId: string): Promise<Session> {
    const query = await this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .where('session.id = :sessionId', { sessionId });

    return query.getOne();
  }

  public async delete(sessionId: string): Promise<void> {
    await this.sessionsRepository
      .createQueryBuilder('sessions')
      .delete()
      .from(SessionEntity)
      .where('id = :sessionId', { sessionId })
      .execute();
  }

  public async setRefreshToken(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.sessionsRepository
      .createQueryBuilder()
      .update(SessionEntity)
      .set({ refreshToken })
      .where('id = :sessionId', { sessionId })
      .execute();
  }
}
