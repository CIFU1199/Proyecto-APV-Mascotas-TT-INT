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

interface ApiResponse<T> {
  data: T;
}

const HistorialService = {
  obtenerHistorialMascota: (mascotaId: number): Promise<ApiResponse<HistorialMascota[]>> => 
    apiClient.get(`/cita/historial/${mascotaId}`),

  crearRegistroHistorial: (data: {
    mascotaId: number;
    tipo: string;
    descripcion: string;
    detalles: string;
    observaciones: string;
  }): Promise<ApiResponse<any>> => apiClient.post('/cita/historial/crear', data),

  filtrarHistorialPorTipo: (mascotaId: number, tipo: string): Promise<ApiResponse<HistorialMascota[]>> => 
    apiClient.get(`/cita/historial/${mascotaId}/tipo/${tipo}`),
   
  obtenerHistorialGeneral: (): Promise<ApiResponse<HistorialGeneralItem[]>> => 
    apiClient.get('/cita/historial')
};

export default HistorialService;
export type { HistorialMascota, HistorialGeneralItem as HistorialGeneral };