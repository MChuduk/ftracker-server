import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  displayName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
