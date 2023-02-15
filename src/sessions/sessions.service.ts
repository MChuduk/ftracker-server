import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from 'src/utils/utils.service';
import { Repository } from 'typeorm';
import { SessionEntity } from './entities';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    private readonly utilsService: UtilsService,
  ) {}

  public async create(refreshToken: string) {
    const refreshTokenHashed = await this.utilsService.hashString(refreshToken);
    const session = this.sessionsRepository.create({
      refreshToken: refreshTokenHashed,
    });

    await this.sessionsRepository
      .createQueryBuilder()
      .insert()
      .into(SessionEntity)
      .values(session)
      .execute();

    console.log(session);

    return session;
  }
}
