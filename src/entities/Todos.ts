import {Entity,PrimaryGeneratedColumn,  Column, BaseEntity} from 'typeorm';

@Entity()
export class Todos extends BaseEntity{

@PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  done: boolean;
}