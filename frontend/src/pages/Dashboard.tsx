import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import type { Vehiculo, Prediccion } from '../types';

interface VehiculoConRiesgo extends Vehiculo {
  riesgoMaximo: number;
  componenteEnRiesgo: string;
}

export default function Dashboard() {
  const [vehiculosConRiesgo, setVehiculosConRiesgo] = useState<VehiculoConRiesgo[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargar() {
      const { data: vehiculos } = await api.get<Vehiculo[]>('/vehiculos');

      const conRiesgo = await Promise.all(
        vehiculos.map(async (v) => {
          const { data: predicciones } = await api.get<Prediccion[]>(`/predicciones/vehiculo/${v.id}`);

          if (predicciones.length === 0) {
            return { ...v, riesgoMaximo: 0, componenteEnRiesgo: 'Sin datos' };
          }

          const masRiesgoso = predicciones.reduce((max, p) =>
            Number(p.scoreRiesgo) > Number(max.scoreRiesgo) ? p : max
          );

          return {
            ...v,
            riesgoMaximo: Number(masRiesgoso.scoreRiesgo),
            componenteEnRiesgo: masRiesgoso.componente?.nombre || 'Desconocido',
          };
        })
      );

      conRiesgo.sort((a, b) => b.riesgoMaximo - a.riesgoMaximo);
      setVehiculosConRiesgo(conRiesgo);
      setCargando(false);
    }
    cargar();
  }, []);

  if (cargando) return <p className="p-8">Cargando dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de riesgo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehiculosConRiesgo.map((v) => {
          const color =
            v.riesgoMaximo >= 0.7 ? 'border-l-red-500' :
            v.riesgoMaximo >= 0.4 ? 'border-l-yellow-500' :
            'border-l-green-500';

          return (
            <div
              key={v.id}
              onClick={() => navigate(`/vehiculos/${v.id}`)}
              className={`bg-white rounded-lg shadow p-5 border-l-4 ${color} cursor-pointer hover:shadow-md transition`}
            >
              <p className="font-bold text-gray-800">{v.marca} {v.modelo}</p>
              <p className="text-sm text-gray-500 mb-3">{v.patente}</p>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">{v.componenteEnRiesgo}</span>
                <span className="text-xl font-bold text-gray-800">
                  {(v.riesgoMaximo * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}