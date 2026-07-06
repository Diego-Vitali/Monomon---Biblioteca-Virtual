import axios from 'axios';
import { Platform } from 'react-native';

// Para web usa localhost, para emulador Android usa 10.0.2.2.
// (Para celular físico, seria necessário o IP da rede local)
const BASE_URL = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

export const api = axios.create({
    baseURL: BASE_URL, 
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
