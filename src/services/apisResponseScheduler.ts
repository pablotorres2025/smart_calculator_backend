import { getBcvRates } from './bcvService';
import { getBinanceUsdtP2PPrice } from './binanceP2PService';
import { ApisResponseModel } from '../models/apisResponse';

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;

async function updateApisResponseOnce(): Promise<void> {
  const [bcv, binance] = await Promise.all([
    getBcvRates(),
    getBinanceUsdtP2PPrice(),
  ]);

  await ApisResponseModel.findOneAndUpdate(
    {},
    {
      bcv,
      binance,
      updatedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
    }
  );
}

export function startApisResponseScheduler(): void {
  // Ejecutar una vez al iniciar
  updateApisResponseOnce().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error ejecutando actualización inicial de apis_response:', error);
  });

  // Programar ejecución cada 6 horas
  setInterval(() => {
    updateApisResponseOnce().catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error actualizando apis_response de forma programada:', error);
    });
  }, SIX_HOURS_IN_MS);
}
