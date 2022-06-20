import { Kafka, logLevel } from 'kafkajs';

if (!process.env.KAFKA_BROKER) {
  throw new Error('Endereço do Kafka não está configurado!');
}

export const kafka = new Kafka({
  clientId: 'clientes',
  brokers: [process.env.KAFKA_BROKER],
  logLevel: logLevel.ERROR,
});
