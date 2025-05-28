import apiClient from './apiClient';

interface PetData{
    MACT_NOMBRE: string;
    ESP_ID:number;
    MACT_SEXO:string;
    MACT_FECHA_NACIMIENTO:string;
    MACT_RAZA: string;
    MACT_PESO: number;
    MACT_COLOR: string;
    MACT_FOTO?: string;
}

interface Species {
    ESP_ID: number;
    ESP_NOMBRE: string;
    ESP_DESCRIPCION: string;
}

interface Pet{
    MACT_ID: number;
    MACT_NOMBRE: string;
    MACT_SEXO: string;
    MACT_FECHA_NACIMIENTO: string;
    MACT_RAZA: string;
    MACT_PESO: string;
    MACT_COLOR: string;
    MACT_FOTO: string;
    Especie:{
        ESP_NOMBRE: string;
    };
    edad:string;
}

export const PetService = {
    registerPet: async (petData: PetData) => {
        const response = await apiClient.post('/mascotas/registrar', petData);
        return response.data;
    },
    getSpecies: async (): Promise<Species[]> => {
        const response = await apiClient.get('/especie/getEspecies');
        return response.data;
    },
    getUserPets: async (): Promise<Pet[]> => {
        const response = await apiClient.get('mascotas/mis-mascotas');
        return response.data;
    }
}

export type {PetData,Species, Pet}