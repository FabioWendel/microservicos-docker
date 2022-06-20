import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Cliente } from './Cliente';

@Entity({ database: process.env.NAME_DB_POSTGRES })
export class Transacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantidade!: number;

  @Column()
  tipo!: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.transacao)
  cliente!: Cliente;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
