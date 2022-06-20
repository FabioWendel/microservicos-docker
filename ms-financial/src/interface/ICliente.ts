import { ISaldo } from './ISaldo';

export interface ICliente {
  id: number;
  saldo: ISaldo;
  nome: string;
  telefone: string;
  cpf: string;
}
