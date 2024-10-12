import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api.cordillera.gov.py/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});


// Función para obtener las categorias
export const getCategories = async () => {
    try {
        const response = await api.get('getCategories');
        return response.data;
    } catch (error) {
        console.error('Error al autenticar:', error);
    }
};

// Función para obtener los eventos
export const getEvents = async () => {
    try {
        const response = await api.get('getEvents');
        return response.data;
    } catch (error) {
        console.error('Error al autenticar:', error);
    }
};

export const getTourist = async () => {
    try {
        const response = await api.get('getTourist');
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
};

export default api;