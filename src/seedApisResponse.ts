import { connectMongo } from './config/mongo';
import { ApisResponseModel } from './models/apisResponse';
import { getBcvRates } from './services/bcvService';
import { getBinanceUsdtP2PPrice } from './services/binanceP2PService';

async function runSeed() {
  try {
    await connectMongo();

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

    // eslint-disable-next-line no-console
    console.log('Semilla ejecutada correctamente: datos guardados en apis_response');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error ejecutando la semilla de apis_response:', error);
  } finally {
    process.exit(0);
  }
}

runSeed();
