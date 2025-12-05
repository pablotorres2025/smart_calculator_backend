"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBcvRatesFromDb = getBcvRatesFromDb;
exports.getBinanceUsdtP2PPriceFromDb = getBinanceUsdtP2PPriceFromDb;
const apisResponse_1 = require("../models/apisResponse");
async function getBcvRatesFromDb() {
    const doc = await apisResponse_1.ApisResponseModel.findOne().lean();
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
async function getBinanceUsdtP2PPriceFromDb() {
    const doc = await apisResponse_1.ApisResponseModel.findOne().lean();
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
