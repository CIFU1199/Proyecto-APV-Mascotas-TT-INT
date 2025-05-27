import apiClient from './apiClient';

//tipos

interface FiltroCitas{
  fecha?: string;
  estado?: string;
  tipo?: string ;
  veterinarioId: number;
  mascotaId: number;

}

interface ReprogramarCitaData {
  nuevaFecha: string;
  nuevaHora: string;
  motivo?: string;
}

interface MascotaDetalles {
  nombre: string;
  especie: string;
  sexo?: string;
  edad?: string;
  raza?: string;
  color?: string;
  peso?: number | null;
  foto?: string | null;
}

interface VeterinarioDetalles {
  nombre: string;
}

interface CitaDetalles {
  id: number;
  mascota: MascotaDetalles;
  fecha: string;
  hora: string;
  tipo: string;
  estado: string;
  motivo?: string;
  observacionMedica?: string | null;
  veterinario?: VeterinarioDetalles;
}



const GestionCitaService = {
  
  //Obtiene las citas completas
  obtenerCitasCompletas: (): Promise<{data: CitaDetalles[]}>  => apiClient.get('/cita/citas-completas'),
  
  //filtrar segun parametros
  filtrarCitas: (params: FiltroCitas): Promise<{data: CitaDetalles[]}> => apiClient.get('/cita/filtrar', { params }),

  //Obtener Cita por mascotas 
  obtenerCitasPorMascota: (mascotaId: number): Promise<{data: CitaDetalles[]}> => apiClient.get(`/cita/mascota/${mascotaId}`),

  // Obtine los detalles de una cita en especifico 
  obtenerDetallesCita:(id:number): Promise<{data: CitaDetalles}> => apiClient.get(`/cita/${id}/detalles`),


  //Reprogramar una cita existente 
  reprogramarCita: (id: number, data:ReprogramarCitaData): Promise<{data: {mensaje: string}}> => apiClient.put(`/cita/${id}/reprogramar`, data),

  //Cancelar una cita existente 
  cancelarCita: (id: number, observacion: string): Promise<{data: {mensaje: string }}> => apiClient.put(`/cita/${id}/cancelar`, { observacion }),

  //Atender la cita 
  atenderCita: (id: number, observacion: string): Promise<{data:{mensaje: string }}> => apiClient.put(`/cita/${id}/atender`, { observacion })
};


export default GestionCitaService;
export type {CitaDetalles,MascotaDetalles, VeterinarioDetalles};