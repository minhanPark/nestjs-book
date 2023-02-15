import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;
}
