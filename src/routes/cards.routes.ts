import express, {Request, Response} from 'express';
import { createCard } from '../services/trelloCards.service';
import { logger } from '../utils/logger';

const router = express.Router();

router.post('/create', async function postCreate(req : Request, res : Response){
    const ROUTER_NAME = 'cards/routes/create'
    try {
        logger.info('Posting /create', ROUTER_NAME as string);
        const {idList, name, desc} = req.body;
        logger.info(idList, ROUTER_NAME);
        const response = await createCard(name, desc, idList);
        res.status(201). json(response);
    } catch (error) {
      logger.error('/create Error:' + (error as Error).message, ROUTER_NAME);
      res.status(500).json({error: (error as Error).message});
    }
})

export default router;