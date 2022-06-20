import { ICliente } from './ICliente';
import { ITransacao } from './ITransacao';

export interface ISaldo {
  id: number;
  cliente: ICliente;
  transacao?: ITransacao;
  quantidade: number;
}
