import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(
    JSON.parse(localStorage.getItem('usuario') || 'null')
  );
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  function login(usuario: Usuario, token: string) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
    setUsuario(usuario);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}