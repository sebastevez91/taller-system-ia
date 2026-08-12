import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import vehiculoRoutes from './routes/vehiculo.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/vehiculos', vehiculoRoutes);

export default app;