import { useEffect, useState } from 'react';
import api from '../api/client';
import type { UsuarioAdmin, Rol } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const { usuario: usuarioActual } = useAuth();

  async function cargar() {
    const { data } = await api.get<UsuarioAdmin[]>('/usuarios');
    setUsuarios(data);
    setCargando(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleCambiarRol(id: string, nuevoRol: Rol) {
    await api.put(`/usuarios/${id}/rol`, { rol: nuevoRol });
    cargar();
  }

  if (cargando) return <p className="p-8">Cargando usuarios...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de usuarios</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Cambiar rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.nombre}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{u.rol}</span>
                </td>
                <td className="p-3">
                  <select
                    value={u.rol}
                    onChange={(e) => handleCambiarRol(u.id, e.target.value as Rol)}
                    disabled={u.id === usuarioActual?.id}
                    className="border rounded px-2 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MECANICO">MECANICO</option>
                    <option value="DUENIO">DUENIO</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}