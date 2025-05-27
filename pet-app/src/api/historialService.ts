import apiClient from './apiClient';

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
    apiClient.get(`/cita/historial/${mascotaId}/tipo/${tipo}`)
};

export default HistorialService;