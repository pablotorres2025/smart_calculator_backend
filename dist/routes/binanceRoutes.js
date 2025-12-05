"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binanceRouter = void 0;
const express_1 = require("express");
const apisResponseService_1 = require("../services/apisResponseService");
exports.binanceRouter = (0, express_1.Router)();
// GET /api/binance/usdt-p2p
// Se pueden recibir query params en el futuro, por ejemplo: ?fiat=VES&asset=USDT
exports.binanceRouter.get('/usdt-p2p', async (req, res) => {
    try {
        // Por ahora siempre se devuelve el último valor almacenado en BD
        // ignorando los query params asset/fiat.
        const data = await (0, apisResponseService_1.getBinanceUsdtP2PPriceFromDb)();
        res.json(data);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error en /api/binance/usdt-p2p:', error?.message ?? error);
        res.status(500).json({
            error: 'Error obteniendo precio USDT P2P en Binance',
        });
    }
});
