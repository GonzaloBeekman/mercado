import { View } from 'react-native';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import styles from '../styles/globalStyles';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';
import { LoginForm } from '../components/login/LoginForm';
import { AuthCard } from '../components/auth/AuthCard';
import { GOOGLE_AUTH, googleAuthConfigured } from '../config/googleAuth';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Estados del modal que muestra mensajes al usuario.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [googleRequest, googleResponse, promptGoogleAsync] =
    Google.useAuthRequest({
      webClientId: GOOGLE_AUTH.webClientId || undefined,
      androidClientId: GOOGLE_AUTH.androidClientId || undefined,
      iosClientId: GOOGLE_AUTH.iosClientId || undefined,
      selectAccount: true
    });

  // Login con email y password contra el backend.
  const login = async () => {
    if (!email || !password) {
      setModalMessage('Completa todos los campos');
      setModalVisible(true);

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/usuarios/login`,
        {
          email,
          password
        }
      );

      await AsyncStorage.setItem(
        'token',
        res.data.token
      );

      setModalMessage('Inicio de sesion correcto');
      setModalVisible(true);

      setTimeout(() => {
        router.replace('/');
      }, 1000);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage(
        err?.response?.data?.message ||
        'Error al iniciar sesion'
      );

      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Login con Google: abre el navegador de Google y luego usa nuestro backend.
  const loginGoogle = async () => {
    if (!googleAuthConfigured()) {
      setModalMessage('Falta configurar el Client ID de Google');
      setModalVisible(true);

      return;
    }

    if (!googleRequest) {
      setModalMessage('Google Auth todavia se esta preparando');
      setModalVisible(true);

      return;
    }

    try {
      setGoogleLoading(true);

      const resultado = await promptGoogleAsync();

      if (resultado.type !== 'success') {
        setGoogleLoading(false);
      }
    } catch (err) {
      console.log(err);

      setGoogleLoading(false);
      setModalMessage('Error al iniciar con Google');
      setModalVisible(true);
    }
  };

  // Con el access token de Google pedimos nombre/email y creamos sesion local.
  const loginGoogleConRespuesta = useCallback(async () => {
    try {
      const accessToken = googleResponse.authentication?.accessToken;

      if (!accessToken) {
        setModalMessage('Google no devolvio access token');
        setModalVisible(true);

        return;
      }

      const googleUserRes = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const googleUser = await googleUserRes.json();

      const res = await axios.post(
        `${API_URL}/api/usuarios/google`,
        {
          nombre: googleUser.name,
          email: googleUser.email
        }
      );

      await AsyncStorage.setItem(
        'token',
        res.data.token
      );

      setModalMessage('Inicio con Google correcto');
      setModalVisible(true);

      setTimeout(() => {
        router.replace('/');
      }, 1000);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al conectar Google con la app');
      setModalVisible(true);
    } finally {
      setGoogleLoading(false);
    }
  }, [googleResponse, router]);

  // Cuando Google responde correctamente, pedimos los datos del usuario.
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      loginGoogleConRespuesta();
    }
  }, [googleResponse, loginGoogleConRespuesta]);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: 'center',
          backgroundColor: '#f3f5f7'
        }
      ]}
    >
      <AuthCard
        title="Tienda App"
        subtitle="Ingresa con tu cuenta para continuar"
      >
        <LoginForm
          email={email}
          password={password}
          loading={loading}
          googleLoading={googleLoading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onLogin={login}
          onLoginGoogle={loginGoogle}
          onRegister={() => router.push('/register')}
        />
      </AuthCard>

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() =>
          setModalVisible(false)
        }
      />
    </View>
  );
}
