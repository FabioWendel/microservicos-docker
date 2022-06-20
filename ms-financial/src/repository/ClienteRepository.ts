import { appDataSourcePostgres } from '../database/data-source-postgres';
import { Cliente } from '../entity/Cliente';
import { Saldo } from '../entity/Saldo';
import { ICliente } from '../interface/ICliente';

class ClienteRepository {
  async create(data: ICliente): Promise<Cliente | null> {
    const repository = appDataSourcePostgres.getRepository(Cliente);
    const repository_saldo = appDataSourcePostgres.getRepository(Saldo);

    try {
      const clienteExist = await repository.findOneBy({
        cpf: data.cpf,
      });

      if (clienteExist) {
        throw new Error(`Cliente já existente com CPF: ${data.cpf}.`);
      }

      const saldo = await repository_saldo.save({ quantidade: 0 });

      const result = await repository.save({
        nome: data.nome,
        telefone: data.telefone,
        cpf: data.cpf,
        saldo: saldo,
      });

      console.log('Novo Cliente ==>', result);

      return result;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export default new ClienteRepository();
