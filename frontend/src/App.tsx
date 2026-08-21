import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Vehiculos from './pages/Vehiculos';
import VehiculoDetalle from './pages/VehiculoDetalle';
import Mantenimientos from './pages/Mantenimientos';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />
      <Route
        path="/vehiculos"
        element={
          <RutaProtegida>
            <Vehiculos />
          </RutaProtegida>
        }
      />
      <Route path="/" element={<Navigate to="/vehiculos" replace />} />
      <Route
        path="/vehiculos/:id"
        element={
          <RutaProtegida>
            <VehiculoDetalle />
          </RutaProtegida>
        }
      />
      <Route
        path="/mantenimientos"
        element={
          <RutaProtegida>
            <Mantenimientos />
          </RutaProtegida>
        }
      />
      <Route
        path="/usuarios"
        element={
          <RutaProtegida>
            <Usuarios />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}