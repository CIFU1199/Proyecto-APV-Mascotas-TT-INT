import apiClient from './apiClient';

interface HistorialMascota {
  id: number;
  fechaHistorial: string;
  tipo: string;
  descripcion: string;
  observaciones: string;
  veterinarioHistorial: string;
  nombreMascota: string;
  especie: string;
  sexo: string;
  edad: string;
  raza: string;
  peso: string;
  color: string;
  foto: string;
  nombreDueno: string;
  telefonoDueno: string;
  citaId?: number;
  duracion?: number;
  tipoCita?: string;
  estadoCita?: string;
  veterinarioCita?: string;
  observacionCita?: string;
}

interface HistorialGeneralItem {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  observaciones: string;
  veterinarioNombre: string;
  mascota: {
    id: number;
    nombre: string;
  };
}

const HistorialService = {
  obtenerHistorialMascota: async (mascotaId: number): Promise<HistorialMascota[]> => {
    const res = await apiClient.get(`/cita/historial/${mascotaId}`);
    return res.data;
  },

  crearRegistroHistorial: async (data: {
    mascotaId: number;
    tipo: string;
    descripcion: string;
    detalles: string;
    observaciones: string;
  }): Promise<any> => {
    const res = await apiClient.post('/cita/historial/crear', data);
    return res.data;
  },

  filtrarHistorialPorTipo: async (mascotaId: number, tipo: string): Promise<HistorialMascota[]> => {
    const res = await apiClient.get(`/cita/historial/${mascotaId}/tipo/${tipo}`);
    return res.data;
  },

  obtenerHistorialGeneral: async (): Promise<HistorialGeneralItem[]> => {
    const res = await apiClient.get('/cita/historial');
    return res.data.data;
  }
};

export default HistorialService;
export type { HistorialMascota, HistorialGeneralItem as HistorialGeneral };

