import { Request, Response } from 'express';
import { appDataSourcePostgres } from '../database/data-source-postgres';
import { Cliente } from '../entity/Cliente';
import { ICliente } from '../interface/ICliente';
import { kafka } from '../kafka/kafka';

class ClienteController {
  async index(req: Request, res: Response) {
    const repository = appDataSourcePostgres.getRepository(Cliente);
    const idCliente = +req.params.id;

    if (idCliente) {
      try {
        const result = await repository.findOne({
          where: {
            id: idCliente,
          },
        });

        return res.status(200).json(result);
      } catch (err) {
        return res.status(500).send({ message: 'ERROR ' + err });
      }
    }

    try {
      const result: Cliente[] = await repository.find({
        order: {
          updated_at: 'DESC',
        },
      });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({ message: 'ERROR ' + err });
    }
  }

  async store(req: Request, res: Response) {
    const cliente: ICliente = req.body;
    const repository = appDataSourcePostgres.getRepository(Cliente);

    try {
      const clienteExist = await repository.findOneBy({
        cpf: cliente.cpf,
      });

      if (clienteExist) {
        throw new Error(`Cliente já existente com CPF: ${cliente.cpf}.`);
      }

      const result = await repository.save({
        nome: cliente.nome,
        telefone: cliente.telefone,
        cpf: cliente.cpf,
      });

      if (result) {
        const producer = kafka.producer({
          allowAutoTopicCreation: true,
        });

        await producer.connect();
        await producer.send({
          topic: 'new-cliente-topic',
          messages: [{ value: JSON.stringify(result) }],
        });
        console.log('==> Atualizações enviada para MS-FINANCIAL');

        await producer.disconnect();
      }

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({ message: 'ERROR ' + err });
    }
  }

  async delete(req: Request, res: Response) {
    const repository = appDataSourcePostgres.getRepository(Cliente);
    const idCliente = +req.params.id;

    try {
      const clienteExist = await repository.findOneBy({
        id: idCliente,
      });

      if (!clienteExist) {
        throw new Error(`Cliente não existente na Base de dados.`);
      }

      const result = await repository.delete(idCliente);

      return res.status(200).send({ message: 'Cliente deletado com sucesso.' });
    } catch (err) {
      return res.status(500).send({ message: 'ERROR ' + err });
    }
  }

  async update(req: Request, res: Response) {
    const cliente: ICliente = req.body;
    const repository = appDataSourcePostgres.getRepository(Cliente);

    try {
      const clienteExist = await repository.findOneBy({
        cpf: cliente.cpf,
      });

      if (!clienteExist) {
        throw new Error(`Cliente não existente na Base de dados.`);
      }

      const result = await repository.save({
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        cpf: cliente.cpf,
      });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({ message: 'ERROR ' + err });
    }
  }
}

export default new ClienteController();
