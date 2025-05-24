import apiClient from "../apiClient";

interface Usuario {
  id: number;
  documento: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: number;
  estado: boolean;
}

interface ListarUsuariosParams {
  rol?: number;
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}

interface ListarUsuariosResponse {
  totalUsuarios: number;
  pagina: number;
  totalPaginas: number;
  porPagina: number;
  usuarios: Usuario[];
}

interface RegistrarUsuarioAdminData {
  USUA_DOCUMENTO: string;
  USUA_NOMBRES: string;
  USUA_CORREO: string;
  USUA_PASSWORD: string;
  USUA_TELEFONO: string;
  ROL_ID: number;
}

interface ActualizarUsuarioData {
  documento: string;
  nombres: string;
  correo: string;
  telefono: string;
  rol: number;
  estado: boolean;
}

export const UserAdminService = {
  listarUsuarios: async (params: ListarUsuariosParams = {}): Promise<ListarUsuariosResponse> => {
    try {
      const response = await apiClient.get<ListarUsuariosResponse>('/auth/admin/listar', { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Error al listar usuarios');
    }
  },

  registrarUsuario: async (userData: RegistrarUsuarioAdminData): Promise<Usuario> => {
    try {
      const response = await apiClient.post<Usuario>('/auth/admin/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Error al registrar usuario');
    }
  },

  actualizarUsuario: async (id: number, userData: ActualizarUsuarioData): Promise<Usuario> => {
    try {
      const response = await apiClient.put<Usuario>(`/auth/admin/actualizar/${id}`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Error al actualizar usuario');
    }
  },
};

// Constantes para los roles
export const ROLES = {
  ADMINISTRADOR: 1,
  VETERINARIO: 2,
  CLIENTE: 3,
};

// Función para obtener el nombre del rol
export const getRolNombre = (rolId: number): string => {
  switch (rolId) {
    case ROLES.ADMINISTRADOR:
      return 'Administrador';
    case ROLES.VETERINARIO:
      return 'Veterinario';
    case ROLES.CLIENTE:
      return 'Cliente';
    default:
      return 'Desconocido';
  }
};