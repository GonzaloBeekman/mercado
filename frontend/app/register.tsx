import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

import styles from '../styles/globalStyles';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/auth/PasswordInput';

export default function Register() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados del modal de mensajes.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Crea un usuario nuevo en el backend.
  const register = async () => {
    if (!nombre || !email || !password) {
      setModalMessage('Completa todos los campos');
      setModalVisible(true);

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/api/usuarios/register`,
        {
          nombre,
          email,
          password
        }
      );

      setModalMessage('Usuario creado correctamente');
      setModalVisible(true);

      setTimeout(() => {
        router.replace('/login');
      }, 1000);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage(
        err?.response?.data?.message ||
        'Error al registrar'
      );

      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

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
        title="Crear cuenta"
        subtitle="Completa tus datos para registrarte"
      >
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={register}
          disabled={loading}
          style={{
            backgroundColor:
              loading ? '#999' : '#00a650',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10,
            width: '100%'
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              Registrarse
            </Text>
          )}
        </TouchableOpacity>
      </AuthCard>

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
