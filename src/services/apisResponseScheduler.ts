import { getBcvRates } from './bcvService';
import { getBinanceUsdtP2PPrice } from './binanceP2PService';
import { ApisResponseModel } from '../models/apisResponse';

// Horas fijas de actualización en horario de Venezuela (UTC-4):
// 03:30, 09:30, 15:30 y 21:30.
// Asumimos que el servidor corre en UTC y ajustamos restando 4 horas.
const VENEZUELA_UTC_OFFSET_MINUTES = -4 * 60;
const SCHEDULED_HOURS_VE = [3, 9, 15, 21];
const SCHEDULED_MINUTE_VE = 30;

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

function getNextRunDelayMsFromNow(): number {
  const nowUtc = new Date();

  // Convertimos la hora actual a hora de Venezuela (UTC-4)
  const nowVe = new Date(
    nowUtc.getTime() + VENEZUELA_UTC_OFFSET_MINUTES * 60 * 1000
  );

  const year = nowVe.getUTCFullYear();
  const month = nowVe.getUTCMonth();
  const day = nowVe.getUTCDate();

  // Construimos las horas objetivo de hoy en hora de Venezuela
  const candidateTimesVe = SCHEDULED_HOURS_VE.map((hour) => {
    return new Date(Date.UTC(year, month, day, hour, SCHEDULED_MINUTE_VE, 0, 0));
  });

  // Buscamos la siguiente hora futura en horario VE
  let nextRunVe: Date | null = null;
  for (const candidate of candidateTimesVe) {
    if (candidate.getTime() > nowVe.getTime()) {
      nextRunVe = candidate;
      break;
    }
  }

  // Si no hay ninguna futura hoy, tomamos la primera de mañana
  if (!nextRunVe) {
    const tomorrow = new Date(Date.UTC(year, month, day + 1));
    const yearT = tomorrow.getUTCFullYear();
    const monthT = tomorrow.getUTCMonth();
    const dayT = tomorrow.getUTCDate();
    nextRunVe = new Date(
      Date.UTC(yearT, monthT, dayT, SCHEDULED_HOURS_VE[0], SCHEDULED_MINUTE_VE, 0, 0)
    );
  }

  // Convertimos la hora objetivo (VE) nuevamente a UTC
  const nextRunUtcMs =
    nextRunVe.getTime() - VENEZUELA_UTC_OFFSET_MINUTES * 60 * 1000;

  return nextRunUtcMs - nowUtc.getTime();
}

function scheduleNextRun(): void {
  const delayMs = getNextRunDelayMsFromNow();

  setTimeout(() => {
    updateApisResponseOnce()
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(
          'Error actualizando apis_response en ejecución programada:',
          error
        );
      })
      .finally(() => {
        // Programamos la siguiente ejecución
        scheduleNextRun();
      });
  }, delayMs);
}

export function startApisResponseScheduler(): void {
  // Ejecutar una vez al iniciar
  updateApisResponseOnce()
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(
        'Error ejecutando actualización inicial de apis_response:',
        error
      );
    })
    .finally(() => {
      // Alinear las siguientes ejecuciones a las horas fijas en horario VE
      scheduleNextRun();
    });
}
