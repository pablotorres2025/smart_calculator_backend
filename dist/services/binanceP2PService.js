"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinanceUsdtP2PPrice = getBinanceUsdtP2PPrice;
const axios_1 = __importDefault(require("axios"));
async function getBinanceUsdtP2PPrice({ asset = 'USDT', fiat = 'VES', } = {}) {
    // Nueva API más estable: https://api.yadio.io/json
    const url = 'https://api.yadio.io/json';
    const response = await axios_1.default.get(url, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = response.data;
    // Tomamos el valor USDT/VES desde la sección USD.other.usdt.rate
    const usdtRate = data?.USD?.other?.usdt?.rate;
    if (!usdtRate || typeof usdtRate !== 'number') {
        throw new Error('La respuesta de api.yadio.io no contiene USD.other.usdt.rate válido');
    }
    const price = usdtRate;
    return {
        asset,
        fiat,
        price,
        source: 'Yadio USDT',
    };
}
