import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

interface Notificacion {
  id: string;
  mensaje: string;
  leida: boolean;
  vehiculoId: string | null;
  creadaEn: string;
}

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  async function cargar() {
    const [resNotif, resContador] = await Promise.all([
      api.get<Notificacion[]>('/notificaciones'),
      api.get<{ cantidad: number }>('/notificaciones/no-leidas'),
    ]);
    setNotificaciones(resNotif.data);
    setNoLeidas(resContador.data.cantidad);
  }

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 30000); // refresca cada 30s
    return () => clearInterval(intervalo);
  }, []);

  async function handleClickNotificacion(n: Notificacion) {
    if (!n.leida) {
      await api.put(`/notificaciones/${n.id}/leida`);
      cargar();
    }
    if (n.vehiculoId) {
      navigate(`/vehiculos/${n.vehiculoId}`);
      setAbierto(false);
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setAbierto(!abierto)} className="relative p-2">
        <span className="text-xl">🔔</span>
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10 max-h-96 overflow-y-auto">
          {notificaciones.length === 0 && (
            <p className="p-4 text-gray-400 text-sm">Sin notificaciones</p>
          )}
          {notificaciones.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClickNotificacion(n)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${n.leida ? 'opacity-60' : 'bg-blue-50'}`}
            >
              <p className="text-sm text-gray-800">{n.mensaje}</p>
              <p className="text-xs text-gray-400">{new Date(n.creadaEn).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}