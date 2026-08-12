import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import type { Vehiculo, Mantenimiento } from '../types';

export default function VehiculoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [resVehiculo, resMantenimientos] = await Promise.all([
        api.get<Vehiculo>(`/vehiculos/${id}`),
        api.get<Mantenimiento[]>(`/mantenimientos?vehiculoId=${id}`),
      ]);
      setVehiculo(resVehiculo.data);
      setMantenimientos(resMantenimientos.data);
      setCargando(false);
    }
    cargar();
  }, [id]);

  if (cargando) return <p className="p-8">Cargando...</p>;
  if (!vehiculo) return <p className="p-8">Vehículo no encontrado</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button onClick={() => navigate('/vehiculos')} className="text-blue-600 mb-4 hover:underline">
        ← Volver a vehículos
      </button>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {vehiculo.marca} {vehiculo.modelo} — {vehiculo.patente}
        </h1>
        <p className="text-gray-500">
          Año {vehiculo.anio} · {vehiculo.kmActual.toLocaleString()} km
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-3">Historial de mantenimientos</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Componente</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Km</th>
              <th className="p-3">Costo</th>
            </tr>
          </thead>
          <tbody>
            {mantenimientos.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="p-3">{new Date(m.fecha).toLocaleDateString()}</td>
                <td className="p-3">{m.componente?.nombre}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${m.tipo === 'PREVENTIVO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {m.tipo}
                  </span>
                </td>
                <td className="p-3">{m.kmAlMomento.toLocaleString()} km</td>
                <td className="p-3">${Number(m.costo).toLocaleString()}</td>
              </tr>
            ))}
            {mantenimientos.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Sin mantenimientos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}