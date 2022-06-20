import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Saldo } from './Saldo';
import { Transacao } from './Transacao';

@Entity({ database: process.env.NAME_DB_POSTGRES })
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  telefone!: string;

  @Column()
  cpf!: string;

  @OneToOne(() => Saldo, (saldo) => saldo.cliente, { cascade: true })
  @JoinColumn()
  saldo!: Saldo;

  @OneToMany(() => Transacao, (transacao) => transacao.cliente)
  transacao!: Transacao[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
