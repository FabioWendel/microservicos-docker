import { appDataSourcePostgres } from '../database/data-source-postgres';
import { Cliente } from '../entity/Cliente';
import { ICliente } from '../interface/ICliente';

class ClienteRepository {
  async update(data: ICliente): Promise<Cliente | null> {
    const repository = appDataSourcePostgres.getRepository(Cliente);

    try {
      const clienteExist = await repository.findOneBy({
        cpf: data.cpf,
      });

      if (!clienteExist) {
        throw new Error(`Cliente não existente com CPF: ${data.cpf}.`);
      }

      const { saldo } = data;

      const saldoType: any = saldo;

      const result = await repository.save({
        id: data.id,
        saldo: saldoType.quantidade,
      });

      console.log('==> Cliente atualizado.');

      return result;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export default new ClienteRepository();
