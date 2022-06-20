import { Router } from 'express';
import ClienteController from './controllers/ClienteController';

const routes = Router();

routes.get('/cliente', ClienteController.index);

routes.get('/cliente/:id', ClienteController.index);

routes.post('/cliente', ClienteController.store);

routes.delete('/cliente/:id', ClienteController.delete);

routes.put('/cliente', ClienteController.update);

export default routes;
