import { Platform } from 'react-native';

export const GOOGLE_AUTH = {
  // Client ID de tipo Web para localhost y luego Vercel.
  // En deploy se puede cambiar desde EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    '9657592674-oa8e00oe999o2754t9jtuo2tpqp1t9sc.apps.googleusercontent.com',

  // Client ID de tipo Android para la app instalada.
  // En deploy/APK se puede cambiar desde EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID.
  androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    '9657592674-ag5s5gch599jakh64l7omsueqd6b6bsh.apps.googleusercontent.com',

  // Client ID de tipo iOS si despues se compila para iPhone.
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || ''
};

// Verifica si la plataforma actual tiene su Client ID cargado.
export const googleAuthConfigured = () => {
  if (Platform.OS === 'web') {
    return Boolean(GOOGLE_AUTH.webClientId);
  }

  if (Platform.OS === 'android') {
    return Boolean(GOOGLE_AUTH.androidClientId);
  }

  if (Platform.OS === 'ios') {
    return Boolean(GOOGLE_AUTH.iosClientId);
  }

  return false;
};
