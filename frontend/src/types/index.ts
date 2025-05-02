// Definición de tipos de usuario
export type UserRole = 'dueño' | 'veterinario';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  contraseña: string;
  tipo: UserRole;
}

export interface Usuario {
  id: number;
  nombre: string;
  // otros campos necesarios
}

// Definición de tipos para mascotas
export interface Mascota {
  id: number;
  nombre: string;
  especie?: string; // Opcional
  raza?: string;    // Opcional
  edad?: number;    // Opcional
  usuarioId: number;  // Relación con usuario
}

// Definición de tipos para citas
export interface Cita {
  id: number;
  mascotaId: number;
  veterinarioId: number; // Mejor que usuarioId para claridad
  fecha: string;         // Considera usar Date o ISO string
  hora: string;
  estado: 'pendiente' | 'completada' | 'cancelada'; // Estados específicos
  motivo?: string;       // Opcional
}

// Tipo simplificado para cuando solo necesitas datos básicos
export interface UsuarioInfoBasica {
  id: number;
  nombre: string;
}

// Tipo para props comunes en componentes
export interface WithUserProps {
  user: User;
}

// Tipo para props que requieren userId
export interface WithUserIdProps {
  userId: number;
}