"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApisResponseScheduler = startApisResponseScheduler;
const bcvService_1 = require("./bcvService");
const binanceP2PService_1 = require("./binanceP2PService");
const apisResponse_1 = require("../models/apisResponse");
const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;
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
function startApisResponseScheduler() {
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
