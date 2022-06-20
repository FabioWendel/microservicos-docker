import { Request, Response } from 'express';
import { appDataSourcePostgres } from '../database/data-source-postgres';
import { Cliente } from '../entity/Cliente';
import { Saldo } from '../entity/Saldo';
import { Transacao } from '../entity/Transacao';
import { ISaldo } from '../interface/ISaldo';
import { kafka } from '../kafka/kafka';

class ClienteController {
  async consultaSaldo(req: Request, res: Response) {
    const idCliente = req.query.id_do_cliente
      ? +req.query.id_do_cliente
      : undefined;

    const repository = appDataSourcePostgres.getRepository(Cliente);

    try {
      const clienteExist = await repository.findOneBy({
        id: idCliente,
      });

      if (!clienteExist) {
        throw new Error(`Cliente não existente na Base de dados.`);
      }
      const result = await repository.findOne({
        relations: {
          saldo: true,
        },
        where: {
          id: idCliente,
        },
      });

      if (result) {
        const { saldo } = result;

        const saldoType: ISaldo = saldo;

        return res.status(200).json({ saldo: saldoType.quantidade });
      }
    } catch (err) {
      return res.status(500).send({ message: 'ERROR ' + err });
    }
  }

  async enviarTransacao(req: Request, res: Response) {
    const idCliente = req.query.id_do_cliente
      ? +req.query.id_do_cliente
      : undefined;

    const dadosTransacao = req.body;

    const repository = appDataSourcePostgres.getRepository(Cliente);
    const repository_saldo = appDataSourcePostgres.getRepository(Saldo);
    const repository_transacao = appDataSourcePostgres.getRepository(Transacao);

    try {
      const cliente = await repository.findOne({
        relations: {
          saldo: true,
        },
        where: {
          id: idCliente,
        },
      });

      if (!cliente) {
        throw new Error(`Cliente não existente na Base de dados.`);
      }

      if (dadosTransacao.valor < 0 && dadosTransacao.tipo == 'crédito') {
        throw new Error(
          `Transação de crédito não é permitido saldo negativo!, tente novamente.`,
        );
      }

      const transacao = await repository_transacao.save({
        quantidade: dadosTransacao.valor,
        tipo: dadosTransacao.tipo,
        cliente: cliente,
      });

      const { saldo } = cliente;

      const saldoType: ISaldo = saldo;

      const saldo_atual = transacao.quantidade + saldoType.quantidade;

      const saldo_update = await repository_saldo.save({
        id: saldoType.id,
        quantidade: saldo_atual,
      });

      if (saldo_update) {
        const producer = kafka.producer({
          allowAutoTopicCreation: true,
        });

        const cliente = await repository.findOne({
          relations: {
            saldo: true,
          },
          where: {
            id: idCliente,
          },
        });

        await producer.connect();
        await producer.send({
          topic: 'update-cliente-topic',
          messages: [{ value: JSON.stringify(cliente) }],
        });
        console.log('==> Atualizações enviada para MS-USERS');

        await producer.disconnect();
      }

      return res.status(201).send();
    } catch (err) {
      return res.status(500).send({ message: 'ERROR ' + err });
    }
  }

  async consultaTransacao(req: Request, res: Response) {
    const repository = appDataSourcePostgres.getRepository(Cliente);
    const repository_transacao = appDataSourcePostgres.getRepository(Transacao);
    const idCliente = +req.params.id;

    if (idCliente) {
      try {
        const cliente = await repository.findOne({
          relations: {
            saldo: true,
            transacao: true,
          },
          where: {
            id: idCliente,
          },
        });

        const result = await repository_transacao
          .createQueryBuilder('Transacao')
          .leftJoinAndSelect('Transacao.cliente', 'transacao')
          .where('transacao.id = :id', { id: idCliente })
          .select(['quantidade', 'tipo'])
          .getRawMany();

        return res.status(200).json(result);
      } catch (err) {
        return res.status(500).send({ message: 'ERROR ' + err });
      }
    }

    try {
      const result: Transacao[] = await repository_transacao.find({
        relations: {
          cliente: true,
        },
        order: {
          updated_at: 'DESC',
        },
      });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({ message: 'ERROR ' + err });
    }
  }
}

export default new ClienteController();
