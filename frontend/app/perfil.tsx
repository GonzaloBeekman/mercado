import {
  View,
  Text
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles/globalStyles';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';
import { ProfilePhotoPicker } from '../components/perfil/ProfilePhotoPicker';
import { ProfileForm } from '../components/perfil/ProfileForm';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [foto, setFoto] = useState('');

  // Estados del modal de mensajes.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Carga el perfil al entrar a la pantalla.
  useEffect(() => {
    cargarPerfil();
  }, []);

  // Obtiene los datos del usuario logueado desde el backend.
  const cargarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.get(
        `${API_URL}/api/usuarios/perfil`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNombre(res.data.nombre);
      setEmail(res.data.email);
      setFoto(res.data.foto || '');
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al cargar perfil');
      setModalVisible(true);
    }
  };

  // Envia al backend los cambios de nombre, password opcional y foto.
  const actualizarPerfil = async () => {
    if (!nombre) {
      setModalMessage('El nombre es obligatorio');
      setModalVisible(true);

      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/usuarios/perfil`,
        {
          nombre,
          password:
            password || undefined,
          foto
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setModalMessage('Perfil actualizado correctamente');
      setModalVisible(true);

      setPassword('');
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage(
        err?.response?.data?.detail
          ? `${err.response.data.message}: ${err.response.data.detail}`
          : err?.response?.data?.message ||
        'Error al actualizar perfil'
      );

      setModalVisible(true);
    }
  };

  // Convierte el resultado de Expo ImagePicker a una imagen guardable en la base.
  const obtenerFotoGuardable = (asset: ImagePicker.ImagePickerAsset) => {
    if (asset.base64) {
      const mimeType = asset.mimeType || 'image/jpeg';

      return `data:${mimeType};base64,${asset.base64}`;
    }

    return asset.uri;
  };

  // Abre la camara para sacar una foto de perfil.
  const sacarFoto = async () => {
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync();

      if (!permiso.granted) {
        setModalMessage('Debes permitir acceso a la camara');
        setModalVisible(true);

        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true
      });

      if (!resultado.canceled) {
        setFoto(obtenerFotoGuardable(resultado.assets[0]));
      }
    } catch (err) {
      console.log(err);

      setModalMessage('Error al sacar foto');
      setModalVisible(true);
    }
  };

  // Abre la galeria del dispositivo para elegir una imagen de perfil.
  const seleccionarImagen = async () => {
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permiso.granted) {
        setModalMessage('Debes permitir acceso a fotos');
        setModalVisible(true);

        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true
      });

      if (!resultado.canceled) {
        setFoto(obtenerFotoGuardable(resultado.assets[0]));
      }
    } catch (err) {
      console.log(err);

      setModalMessage('Error al seleccionar imagen');
      setModalVisible(true);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { padding: 20 }
      ]}
    >
      <Text style={styles.title}>
        Mi Perfil
      </Text>

      <ProfilePhotoPicker
        foto={foto}
        onCamera={sacarFoto}
        onGallery={seleccionarImagen}
      />

      <ProfileForm
        email={email}
        nombre={nombre}
        password={password}
        onNombreChange={setNombre}
        onPasswordChange={setPassword}
        onGuardar={actualizarPerfil}
      />

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
