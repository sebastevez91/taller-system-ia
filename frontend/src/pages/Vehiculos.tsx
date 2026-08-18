import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import type { Vehiculo } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    patente: '', marca: '', modelo: '', anio: '', kmActual: '',
  });

  async function cargarVehiculos() {
    setCargando(true);
    const { data } = await api.get<Vehiculo[]>('/vehiculos');
    setVehiculos(data);
    setCargando(false);
  }

  useEffect(() => {
    cargarVehiculos();
  }, []);

  async function handleCrear(e: FormEvent) {
    e.preventDefault();
    await api.post('/vehiculos', {
      ...nuevoVehiculo,
      anio: Number(nuevoVehiculo.anio),
      kmActual: Number(nuevoVehiculo.kmActual),
    });
    setNuevoVehiculo({ patente: '', marca: '', modelo: '', anio: '', kmActual: '' });
    setMostrarForm(false);
    cargarVehiculos();
  }

  if (cargando) return <p className="p-8">Cargando vehículos...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehículos</h1>
          <p className="text-sm text-gray-500">{usuario?.nombre} ({usuario?.rol})</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Dashboard
          </button>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {mostrarForm ? 'Cancelar' : '+ Nuevo vehículo'}
          </button>
          <button
            onClick={logout}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Salir
          </button>
        </div>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCrear} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-2 gap-4">
          <input
            placeholder="Patente" required
            value={nuevoVehiculo.patente}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, patente: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Marca" required
            value={nuevoVehiculo.marca}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Modelo" required
            value={nuevoVehiculo.modelo}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Año" type="number" required
            value={nuevoVehiculo.anio}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, anio: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Km actual" type="number" required
            value={nuevoVehiculo.kmActual}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, kmActual: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700">
            Guardar
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Patente</th>
              <th className="p-3">Marca</th>
              <th className="p-3">Modelo</th>
              <th className="p-3">Año</th>
              <th className="p-3">Km actual</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
            <tr
                key={v.id}
                onClick={() => navigate(`/vehiculos/${v.id}`)}
                className="border-b hover:bg-gray-50 cursor-pointer"
            >
                <td className="p-3 font-medium">{v.patente}</td>
                <td className="p-3">{v.marca}</td>
                <td className="p-3">{v.modelo}</td>
                <td className="p-3">{v.anio}</td>
                <td className="p-3">{v.kmActual.toLocaleString()} km</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}