import fetch from 'node-fetch';
import { logger } from '../utils/logger';
import { TrelloResponse } from '../types/trello.types';

async function createCard(name: string, desc: string, idList: string): Promise<TrelloResponse> {
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const URL = `https://api.trello.com/1/cards?idList=${encodeURIComponent(idList)}&key=${encodeURIComponent(TRELLO_KEY as string)}&token=${encodeURIComponent(TRELLO_TOKEN as string)}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}`;
  logger.info(URL);

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok){
    const errorMessage = `Error creating card: ${response.statusText}`;
    
    logger.error(errorMessage)
    throw new Error(errorMessage);
  }

  return await response.json();
}

export {createCard}