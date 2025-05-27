import apiClient from './apiClient';

interface RegistroHistorial {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  detalles: string;
  observaciones: string;
  veterinario: string;
  mascota?: string;      // opcional, si viene del backend
  citaId?: number | null; // opcional, si es manual
}


const HistorialService = {
  obtenerHistorialMascota: (mascotaId: number) => 
    apiClient.get(`/cita/historial/${mascotaId}`),

  crearRegistroHistorial: (data: {
    mascotaId: number;
    tipo: string;
    descripcion: string;
    detalles: string;
    observaciones: string;
  }) => apiClient.post('/cita/historial/crear', data),

  filtrarHistorialPorTipo: (mascotaId: number, tipo: string) => 
    apiClient.get(`/cita/historial/${mascotaId}/tipo/${tipo}`),
   
  obtenerHistorialGeneral: () => apiClient.get('/cita/historial/general')
  
};

export default HistorialService;

export type {RegistroHistorial}