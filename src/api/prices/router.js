import { Router } from 'express';
import getPrices from './controller';

const pricesRouter = new Router();

pricesRouter.get('/', getPrices);

export default pricesRouter;
