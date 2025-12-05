"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApisResponseScheduler = startApisResponseScheduler;
const bcvService_1 = require("./bcvService");
const binanceP2PService_1 = require("./binanceP2PService");
const apisResponse_1 = require("../models/apisResponse");
// Scheduler en horario de Venezuela (UTC-4).
// Se ejecutará cada hora en punto (00:00, 01:00, 02:00, ...).
// Asumimos que el servidor corre en UTC y ajustamos restando 4 horas.
const VENEZUELA_UTC_OFFSET_MINUTES = -4 * 60;
async function updateApisResponseOnce() {
    const [bcv, binance] = await Promise.all([
        (0, bcvService_1.getBcvRates)(),
        (0, binanceP2PService_1.getBinanceUsdtP2PPrice)(),
    ]);
    await apisResponse_1.ApisResponseModel.findOneAndUpdate({}, {
        bcv,
        binance,
        updatedAt: new Date(),
    }, {
        upsert: true,
        new: true,
    });
}
function getNextRunDelayMsFromNow() {
    const nowUtc = new Date();
    // Convertimos la hora actual a hora de Venezuela (UTC-4)
    const nowVe = new Date(nowUtc.getTime() + VENEZUELA_UTC_OFFSET_MINUTES * 60 * 1000);
    const year = nowVe.getUTCFullYear();
    const month = nowVe.getUTCMonth();
    const day = nowVe.getUTCDate();
    // Próxima hora en punto en horario VE
    const nextHourVe = new Date(Date.UTC(year, month, day, nowVe.getUTCHours(), 0, 0, 0));
    if (nextHourVe.getTime() <= nowVe.getTime()) {
        // Si ya pasamos la hora en punto actual, usamos la siguiente hora
        nextHourVe.setUTCHours(nextHourVe.getUTCHours() + 1);
    }
    // Convertimos la hora objetivo (VE) nuevamente a UTC
    const nextRunUtcMs = nextHourVe.getTime() - VENEZUELA_UTC_OFFSET_MINUTES * 60 * 1000;
    return nextRunUtcMs - nowUtc.getTime();
}
function scheduleNextRun() {
    const delayMs = getNextRunDelayMsFromNow();
    setTimeout(() => {
        updateApisResponseOnce()
            .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Error actualizando apis_response en ejecución programada:', error);
        })
            .finally(() => {
            // Programamos la siguiente ejecución
            scheduleNextRun();
        });
    }, delayMs);
}
function startApisResponseScheduler() {
    // Ejecutar una vez al iniciar
    updateApisResponseOnce()
        .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error ejecutando actualización inicial de apis_response:', error);
    })
        .finally(() => {
        // Alinear las siguientes ejecuciones a cada hora en punto en horario VE
        scheduleNextRun();
    });
}
