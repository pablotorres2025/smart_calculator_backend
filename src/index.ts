import express, { Request, Response } from 'express';
import { bcvRouter } from './routes/bcvRoutes';
import { binanceRouter } from './routes/binanceRoutes';
import { connectMongo } from './config/mongo';
import { startApisResponseScheduler } from './services/apisResponseScheduler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/api/bcv', bcvRouter);
app.use('/api/binance', binanceRouter);

// Healthcheck simple
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Smart Calculator Backend funcionando',
  });
});

async function bootstrap() {
  try {
    await connectMongo();
    // eslint-disable-next-line no-console
    console.log('Conectado a MongoDB');

    startApisResponseScheduler();

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error inicializando la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
