import {Entity,Column,PrimaryGeneratedColumn,BaseEntity,OneToMany} from 'typeorm';
import { Todos } from './Todos';

@Entity()
export class Users extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todos, todos => todos.users)
    todo: Todos[];
    cascade: true
}