import apiClient from './apiClient';

interface LoginResponse {
  token: string;
  userId: number;
  nombre: string;
  rol: number;
}
/*
interface ErrorResponse {
  error: string;
}*/

interface RegisterData{
  USUA_DOCUMENTO: string;
  USUA_NOMBRE: string;
  USUA_CORREO: string;
  USUA_PASSWORD: string;
  USUA_TELEFONO: string;
}

interface RegisterResponse{
  USUA_ESTADO: string;
  USUA_ID: number;
  USUA_DOCUMENTO: string;
  USUA_NOMBRE: string;
  USUA_CORREO: string;
  USUA_TELEFONO: string;
  ROL_ID: number;
}



export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        USUA_CORREO: email,
        USUA_PASSWORD: password,

      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    try{
      const response = await apiClient.post<RegisterResponse>('/auth/register',userData);
      return response.data;
    }catch(error: any ){
      if(error.response?.data?.error){
        throw new Error(error.response.data.error);
      }
      throw new Error('Error al registrar el usuario');
    }

  }
};