import { Router, Request, Response } from 'express';
import { getBinanceUsdtP2PPriceFromDb } from '../services/apisResponseService';

export const binanceRouter = Router();

// GET /api/binance/usdt-p2p
// Se pueden recibir query params en el futuro, por ejemplo: ?fiat=VES&asset=USDT
binanceRouter.get('/usdt-p2p', async (req: Request, res: Response) => {
  try {
    // Por ahora siempre se devuelve el último valor almacenado en BD
    // ignorando los query params asset/fiat.
    const data = await getBinanceUsdtP2PPriceFromDb();
    res.json(data);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error en /api/binance/usdt-p2p:', error?.message ?? error);
    res.status(500).json({
      error: 'Error obteniendo precio USDT P2P en Binance',
    });
  }
});
