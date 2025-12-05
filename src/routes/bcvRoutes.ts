import { Router, Request, Response } from 'express';
import { getBcvRatesFromDb } from '../services/apisResponseService';

export const bcvRouter = Router();

// GET /api/bcv/rates
bcvRouter.get('/rates', async (_req: Request, res: Response) => {
  try {
    const data = await getBcvRatesFromDb();
    res.json(data);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error en /api/bcv/rates:', error?.message ?? error);
    res.status(500).json({
      error: 'Error obteniendo tasas del BCV',
    });
  }
});
