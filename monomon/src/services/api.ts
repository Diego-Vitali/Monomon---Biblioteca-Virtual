import axios from 'axios';

// Configuração base da API
// Em emuladores Android, geralmente usa-se 10.0.2.2.
// Para dispositivos físicos ou iOS, use o IP da máquina na rede local.
export const api = axios.create({
    baseURL: 'http://10.0.2.2:8080/api', 
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para adicionar o token JWT no futuro
api.interceptors.request.use(async (config) => {
    // const token = await AsyncStorage.getItem('@Monomon:token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

export default api;
