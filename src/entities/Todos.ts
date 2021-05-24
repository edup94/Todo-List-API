import {Entity,PrimaryGeneratedColumn,  Column, BaseEntity, ManyToOne} from 'typeorm';
import { Users } from './Users';

@Entity()
export class Todos extends BaseEntity{

@PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  done: boolean;

  @ManyToOne(() => Users, users => users.todo, {onDelete: "CASCADE"})
    users: Users;
}