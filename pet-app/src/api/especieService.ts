import apiClient from './apiClient';

interface Especie {
  ESP_ID: number;
  ESP_NOMBRE: string;
  ESP_DESCRIPCION?: string;
  ESP_ESTADO: 'activo' | 'inactivo';
  ESP_FECHACAMBIO?: string;
}

interface PaginatedResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  especies: Especie[];
}

export const EspecieService = {
  /**
   * Obtener lista simple de especies (para selects)
   * Ruta: GET /especie/getEspecies
   */
  getEspeciesList: async (): Promise<Especie[]> => {
    try {
      const response = await apiClient.get<Especie[]>('/especie/getEspecies');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching species list:', {
        url: '/especie/getEspecies',
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Error al obtener lista de especies');
    }
  },

  /**
   * Obtener especies paginadas (para tabla)
   * Ruta: GET /especie/getEspecie
   */
  getEspeciesPaginated: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PaginatedResponse> => {
    try {
      const response = await apiClient.get<PaginatedResponse>('/especie/getEspecie', { 
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search || ''
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching paginated species:', {
        url: '/especie/getEspecie',
        params,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Error al obtener especies paginadas');
    }
  },

  /**
   * Obtener especie por ID
   * Ruta: GET /especie/getEspecie/:id
   */
  getEspecieById: async (id: number): Promise<Especie> => {
    try {
      const response = await apiClient.get<Especie>(`/especie/getEspecie/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching species with ID ${id}:`, {
        url: `/especie/getEspecie/${id}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Error al obtener especie por ID');
    }
  },

  /**
   * Crear nueva especie
   * Ruta: POST /especie/crearEspecie
   */
  createEspecie: async (data: {
    ESP_NOMBRE: string;
    ESP_DESCRIPCION?: string;
  }): Promise<Especie> => {
    try {
      const response = await apiClient.post<Especie>('/especie/crearEspecie', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating species:', {
        url: '/especie/crearEspecie',
        data,
        status: error.response?.status,
        response: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Error al crear especie');
    }
  },

  /**
   * Actualizar especie
   * Ruta: PUT /especie/actualizar/:id
   */
  updateEspecie: async (id: number, data: {
    ESP_NOMBRE?: string;
    ESP_DESCRIPCION?: string;
  }): Promise<Especie> => {
    try {
      const response = await apiClient.put<Especie>(`/especie/actualizar/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating species with ID ${id}:`, {
        url: `/especie/actualizar/${id}`,
        data,
        status: error.response?.status,
        response: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Error al actualizar especie');
    }
  },

  /**
   * Cambiar estado de especie
   * Ruta: PATCH /especie/toggle/:id/status
   */
  toggleEspecieStatus: async (id: number): Promise<Especie> => {
    try {
      const response = await apiClient.patch<Especie>(`/especie/toggle/${id}/status`);
      return response.data;
    } catch (error: any) {
      console.error(`Error toggling status for species ID ${id}:`, {
        url: `/especie/toggle/${id}/status`,
        status: error.response?.status,
        response: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Error al cambiar estado de especie');
    }
  },

  /**
   * Eliminar especie
   * Ruta: DELETE /especie/eliminar/:id
   */
  deleteEspecie: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/especie/eliminar/${id}`);
    } catch (error: any) {
      console.error(`Error deleting species with ID ${id}:`, {
        url: `/especie/eliminar/${id}`,
        status: error.response?.status,
        response: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Error al eliminar especie');
    }
  },
};