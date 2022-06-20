import { Router } from 'express';
import ClienteController from './controllers/ClienteController';

const routes = Router();

routes.get('/saldo', ClienteController.consultaSaldo);

routes.post('/transacao', ClienteController.enviarTransacao);

routes.get('/transacao', ClienteController.consultaTransacao);

routes.get('/transacao/:id', ClienteController.consultaTransacao);

export default routes;
