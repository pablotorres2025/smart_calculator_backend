"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("./config/mongo");
const apisResponse_1 = require("./models/apisResponse");
const bcvService_1 = require("./services/bcvService");
const binanceP2PService_1 = require("./services/binanceP2PService");
async function runSeed() {
    try {
        await (0, mongo_1.connectMongo)();
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
        // eslint-disable-next-line no-console
        console.log('Semilla ejecutada correctamente: datos guardados en apis_response');
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error ejecutando la semilla de apis_response:', error);
    }
    finally {
        process.exit(0);
    }
}
runSeed();
