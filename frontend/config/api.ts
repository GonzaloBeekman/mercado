import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = '3000';

// URL publica del backend para usar cuando la app este subida.
// En desarrollo puede quedar vacia y Expo detecta la IP local automaticamente.
const API_PUBLICA = process.env.EXPO_PUBLIC_API_URL;

const HOSTS = {
  casa: 'http://192.168.0.207:3000', // Red de casa.
  casama: 'http://192.168.100.18:3000', // Otra red.
  colegio: 'http://10.0.9.239:3000', // Red del colegio.
  oficina: 'http://192.168.1.8:3000', // Red de oficina.
  ofi: 'http://192.168.1.12:3000', // Red de oficina 2.
  web: 'http://localhost:3000', // Navegador web en la misma PC.
  clo: 'http://192.168.100.105:3000' // Red clo.
};

// Si queres forzar una red especifica, cambia null por una clave de HOSTS.
// Ejemplo: const HOST_MANUAL: keyof typeof HOSTS | null = 'ofi';
const HOST_MANUAL: keyof typeof HOSTS | null = null;

// Expo guarda la IP de la PC que levanta el proyecto.
// Esa IP sirve para que el celular encuentre el backend en la misma red WiFi.
const obtenerHostExpo = () => {
  const constants = Constants as any;
  const hostUri =
    constants.expoConfig?.hostUri ||
    constants.manifest?.debuggerHost ||
    constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) {
    return null;
  }

  const ip = String(hostUri)
    .replace('http://', '')
    .replace('https://', '')
    .replace('exp://', '')
    .split(':')[0];

  return ip ? `http://${ip}:${API_PORT}` : null;
};

// Limpia la URL para evitar errores si queda una barra al final.
const limpiarUrl = (url: string) => url.replace(/\/$/, '');

// Si existe EXPO_PUBLIC_API_URL, tiene prioridad para web deploy y APK real.
// Ejemplo de produccion: EXPO_PUBLIC_API_URL=https://tu-backend.alwaysdata.net
const obtenerApiUrl = () => {
  if (API_PUBLICA) {
    return limpiarUrl(API_PUBLICA);
  }

  if (HOST_MANUAL !== null) {
    return HOSTS[HOST_MANUAL];
  }

  if (Platform.OS === 'web') {
    return HOSTS.web;
  }

  return obtenerHostExpo() || HOSTS.ofi;
};

// Web usa localhost porque el navegador corre en la misma PC que el backend.
// Celular usa la IP detectada por Expo; si falla, usa la red manual de respaldo.
export const API_URL = obtenerApiUrl();
