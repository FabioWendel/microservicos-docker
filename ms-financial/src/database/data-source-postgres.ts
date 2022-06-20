import { DataSource } from 'typeorm';
import { Cliente } from '../entity/Cliente';
import { Saldo } from '../entity/Saldo';
import { Transacao } from '../entity/Transacao';

export const appDataSourcePostgres = new DataSource({
  type: 'postgres',
  host: process.env.HOST_DB_POSTGRES,
  port: parseInt(<string>process.env.PORT_DB_POSTGRES),
  username: process.env.USERNAME_DB_POSTGRES,
  password: process.env.PASSWORD_DB_POSTGRES,
  database: process.env.NAME_DB_POSTGRES,
  migrationsRun: true,
  synchronize: true,
  logging: false,
  entities: [Cliente, Saldo, Transacao],
  subscribers: [],
  migrations: [],
});

appDataSourcePostgres
  .initialize()
  .then(() => {
    console.log('Data Source MS-FINANCIAL has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source MS-FINANCIAL initialization:', err);
  });
