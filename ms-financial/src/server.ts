import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes';
import { kafka } from './kafka/kafka';
import ClienteRepository from './repository/ClienteRepository';

const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`MS-FINANCIAL => Listening on port ${process.env.PORT}`);
});

async function main() {
  const consumer = kafka.consumer({ groupId: 'cliente-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'new-cliente-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const userJson = message.value?.toString();
      if (!userJson) {
        return;
      }

      const clienteCreate = await ClienteRepository.create(
        JSON.parse(userJson),
      );
    },
  });
}

main().then(() => {
  console.log('===> Kafka consumer inicializado.');
});
