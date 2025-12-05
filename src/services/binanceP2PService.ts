import axios from 'axios';

export interface BinanceP2PPriceResponse {
  asset: string;
  fiat: string;
  price: number;
  source: string;
}

export async function getBinanceUsdtP2PPrice({
  asset = 'USDT',
  fiat = 'VES',
}: {
  asset?: string;
  fiat?: string;
} = {}): Promise<BinanceP2PPriceResponse> {
  // Nueva API más estable: https://api.yadio.io/json
  const url = 'https://api.yadio.io/json';

  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = response.data as any;

  // Tomamos el valor USDT/VES desde la sección USD.other.usdt.rate
  const usdtRate = data?.USD?.other?.usdt?.rate as number | undefined;

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
