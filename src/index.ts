import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import logger from './utils/logger';
import cardRoutes from './routes/cards.routes';

function Start(){
  logger.info('Starting express');
  const app = express();
  
  logger.info('Configuring routes');
  app.use(express.json());
  
  logger.info('Configuring CardRoutes');
  app.use('/cards', cardRoutes);

  logger.info('Loading constants');
  const PORT = process.env.PORT_LISTEN;

  app.listen(PORT, function OnAppListen() {
    logger.info('Listening port ' + PORT);
  })
}

Start();