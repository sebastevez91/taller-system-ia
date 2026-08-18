export type Rol = 'ADMIN' | 'MECANICO' | 'DUENIO';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface Vehiculo {
  id: string;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  kmActual: number;
  usuarioId: string;
}

export interface Componente {
  id: string;
  nombre: string;
  vidaUtilKm: number;
  vidaUtilMeses: number;
}

export type TipoMantenimiento = 'PREVENTIVO' | 'CORRECTIVO';

export interface Mantenimiento {
  id: string;
  vehiculoId: string;
  componenteId: string;
  fecha: string;
  kmAlMomento: number;
  tipo: TipoMantenimiento;
  descripcion?: string;
  costo: number;
  componente?: Componente;
  vehiculo?: Vehiculo;
}

export interface Prediccion {
  id: string;
  vehiculoId: string;
  componenteId: string;
  scoreRiesgo: number;
  fechaGenerada: string;
  recomendacion: string;
  componente?: Componente;
}