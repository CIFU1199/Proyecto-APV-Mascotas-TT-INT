import apiClient from "./apiClient";

export interface EstadisticasResponse{
    usuarios:number;
    mascotas: number;
    citas: number;
}

export const obtenerEstadisticas = async (): Promise<EstadisticasResponse> => {
    const response = await apiClient.get('/estadisticas/general');
    return response.data.data;
}