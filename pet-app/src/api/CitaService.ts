import apiClient from './apiClient';

export interface Mascota {
  MACT_ID: number;
  MACT_NOMBRE: string;
}

export interface Cita {
  id: number;
  mascota: {
    nombre: string;
    foto: string | null;
    especie: string;
  };
  fecha: string;
  hora: string;
  tipo: string;
  estado: string;
  motivo: string;
  observaciones: string;
  veterinario: {
    nombre: string;
  };
}

export interface NuevaCita {
  MACT_ID: number;
  CIT_FECHACITA: string;
  CIT_HORA: string;
  CIT_DURACION?: number;
  CIT_TIPO?: string;
  CIT_MOTIVOCITA?: string;
}

export const obtenerMascotasUsuario = async (): Promise<Mascota[]> => {
  try {
    const response = await apiClient.get('/mascotas/mis-mascotas');
    return response.data.map((mascota: any) => ({
      MACT_ID: mascota.MACT_ID,
      MACT_NOMBRE: mascota.MACT_NOMBRE,
    }));
  } catch (error) {
    console.error('Error al obtener mascotas del usuario:', error);
    throw error;
  }
};

export const registrarCita = async (citaData: NuevaCita): Promise<any> => {
  try {
    const response = await apiClient.post('/cita/registrar', citaData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar cita:', error);
    throw error;
  }
};

export const obtenerCitasUsuario = async (): Promise<Cita[]> => {
  try {
    const response = await apiClient.get('/cita/mis-citas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas del usuario:', error);
    throw error;
  }
};

export const cancelarCita = async (citaId: number): Promise<void> => {
  try {
    await apiClient.patch(`/cita/${citaId}/cancelar`);
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    throw error;
  }
};