import { UserEntity } from 'src/users/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ nullable: true })
  refreshToken: string;
}
