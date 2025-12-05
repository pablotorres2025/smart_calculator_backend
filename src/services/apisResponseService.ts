import { ApisResponseModel } from '../models/apisResponse';
import { BcvRatesResponse } from './bcvService';
import { BinanceP2PPriceResponse } from './binanceP2PService';

export async function getBcvRatesFromDb(): Promise<BcvRatesResponse> {
  const doc = await ApisResponseModel.findOne().lean();

  if (!doc || !doc.bcv) {
    throw new Error('No hay datos de BCV almacenados en la base de datos');
  }

  return {
    usd: doc.bcv.usd,
    eur: doc.bcv.eur,
    source: doc.bcv.source,
    lastUpdateUsd: doc.bcv.lastUpdateUsd,
    lastUpdateEur: doc.bcv.lastUpdateEur,
  };
}

export async function getBinanceUsdtP2PPriceFromDb(): Promise<BinanceP2PPriceResponse> {
  const doc = await ApisResponseModel.findOne().lean();

  if (!doc || !doc.binance) {
    throw new Error('No hay datos de Binance P2P almacenados en la base de datos');
  }

  return {
    asset: doc.binance.asset,
    fiat: doc.binance.fiat,
    price: doc.binance.price,
    source: doc.binance.source,
  };
}
