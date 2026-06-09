import { ActivityIndicator, Text, View } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

// Esta pantalla existe para que Google pueda volver a la app sin caer en "Unmatched Route".
// AuthSession toma los parametros del link y completa el login iniciado desde login.tsx.
WebBrowser.maybeCompleteAuthSession();

export default function OAuthRedirect() {
  useEffect(() => {
    // Si por algun motivo AuthSession no redirige solo, volvemos al login.
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: 24,
        backgroundColor: '#f5f5f5'
      }}
    >
      <ActivityIndicator size="large" color="#3483fa" />

      <Text
        style={{
          color: '#111',
          fontSize: 18,
          fontWeight: '700',
          textAlign: 'center'
        }}
      >
        Completando ingreso con Google
      </Text>

      <Text
        style={{
          color: '#666',
          fontSize: 14,
          textAlign: 'center'
        }}
      >
        Espera unos segundos mientras volvemos a la app.
      </Text>
    </View>
  );
}
