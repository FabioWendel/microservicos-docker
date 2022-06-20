import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Cliente } from './Cliente';

@Entity({ database: process.env.NAME_DB_POSTGRES })
export class Saldo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantidade!: number;

  @OneToOne(() => Cliente, (cliente) => cliente.saldo)
  cliente!: Cliente;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
