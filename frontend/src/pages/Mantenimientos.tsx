import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Mantenimiento, Vehiculo } from '../types';

export default function Mantenimientos() {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [filtroVehiculo, setFiltroVehiculo] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarInicial() {
      const { data } = await api.get<Vehiculo[]>('/vehiculos');
      setVehiculos(data);
    }
    cargarInicial();
  }, []);

  useEffect(() => {
    async function cargarMantenimientos() {
      setCargando(true);
      const url = filtroVehiculo ? `/mantenimientos?vehiculoId=${filtroVehiculo}` : '/mantenimientos';
      const { data } = await api.get<Mantenimiento[]>(url);
      setMantenimientos(data);
      setCargando(false);
    }
    cargarMantenimientos();
  }, [filtroVehiculo]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mantenimientos</h1>

      <select
        value={filtroVehiculo}
        onChange={(e) => setFiltroVehiculo(e.target.value)}
        className="border rounded px-3 py-2 mb-6 bg-white"
      >
        <option value="">Todos los vehículos</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>{v.patente} — {v.marca} {v.modelo}</option>
        ))}
      </select>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Vehículo</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Componente</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Costo</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="p-3">{m.vehiculo?.patente}</td>
                  <td className="p-3">{new Date(m.fecha).toLocaleDateString()}</td>
                  <td className="p-3">{m.componente?.nombre}</td>
                  <td className="p-3">{m.tipo}</td>
                  <td className="p-3">${Number(m.costo).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}