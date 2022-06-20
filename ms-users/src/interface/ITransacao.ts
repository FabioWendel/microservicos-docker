import { ICliente } from './ICliente';
import { ISaldo } from './ISaldo';

export interface ITransacao {
  id: number;
  cliente: ICliente;
  saldo: ISaldo;
  quantidade: string;
  tipo: string;
}
