import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import vehiculoRoutes from './routes/vehiculo.routes';
import componenteRoutes from './routes/componente.routes';
import mantenimientoRoutes from './routes/mantenimiento.routes';
import vehiculoComponenteRoutes from './routes/vehiculoComponente.routes';
import prediccionRoutes from './routes/prediccion.routes';
import notificacionRoutes from './routes/notificacion.routes';
import usuarioRoutes from './routes/usuario.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/vehiculos', vehiculoRoutes);
app.use('/componentes', componenteRoutes);
app.use('/mantenimientos', mantenimientoRoutes);
app.use('/vehiculo-componentes', vehiculoComponenteRoutes);
app.use('/predicciones', prediccionRoutes);
app.use('/notificaciones', notificacionRoutes);
app.use('/usuarios', usuarioRoutes);

export default app;