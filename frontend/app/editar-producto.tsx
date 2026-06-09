import {
  View,
  Text,
  TextInput,
  Button,
  Image
} from 'react-native';

import { useState } from 'react';
import axios from 'axios';
import {
  useLocalSearchParams,
  useRouter
} from 'expo-router';

import styles from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';

export default function EditarProducto() {

  const {
    id,
    nombre,
    precio,
    descripcion,
    imagen_url
  } = useLocalSearchParams();

  const router = useRouter();

  // STATES
  const [nuevoNombre, setNuevoNombre] =
    useState(nombre as string);

  const [nuevoPrecio, setNuevoPrecio] =
    useState(String(precio));

  const [nuevaDescripcion, setNuevaDescripcion] =
    useState(descripcion as string);

  const [imagen, setImagen] =
    useState((imagen_url as string) || '');

  // 🔥 MODAL
  const [modalVisible, setModalVisible] =
    useState(false);

  const [modalMessage, setModalMessage] =
    useState('');

  // EDITAR
  const editarProducto = async () => {

    // VALIDACIÓN
    if (!nuevoNombre || !nuevoPrecio) {

      setModalMessage(
        'Nombre y precio obligatorios'
      );

      setModalVisible(true);

      return;
    }

    // PRECIO
    if (isNaN(Number(nuevoPrecio))) {

      setModalMessage(
        'El precio debe ser numérico'
      );

      setModalVisible(true);

      return;
    }

    try {

      const token =
        await AsyncStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/productos/${id}`,
        {
          nombre: nuevoNombre,
          precio: parseFloat(nuevoPrecio),
          descripcion: nuevaDescripcion,
          imagen_url: imagen
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ ÉXITO
      setModalMessage(
        'Producto actualizado correctamente'
      );

      setModalVisible(true);

      // ⏳ pausa para mostrar modal
      setTimeout(() => {
        router.back();
      }, 1000);

    } catch (err: any) {

      console.log(
        err?.response?.data || err.message
      );

      // ❌ ERROR
      setModalMessage(
        err?.response?.data?.message ||
        'No se pudo actualizar'
      );

      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>

      {/* TÍTULO */}
      <Text style={styles.title}>
        ✏️ Editar Producto
      </Text>

      {/* IMAGEN */}
      <Image
        source={{
          uri:
            imagen ||
            'https://picsum.photos/300'
        }}
        style={{
          width: '100%',
          height: 150,
          borderRadius: 10,
          marginBottom: 10
        }}
        resizeMode="cover"
      />

      {/* URL */}
      <TextInput
        placeholder="URL de imagen"
        value={imagen}
        onChangeText={setImagen}
        style={styles.input}
      />

      {/* NOMBRE */}
      <TextInput
        placeholder="Nombre"
        value={nuevoNombre}
        onChangeText={setNuevoNombre}
        style={styles.input}
      />

      {/* PRECIO */}
      <TextInput
        placeholder="Precio"
        value={nuevoPrecio}
        onChangeText={setNuevoPrecio}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* DESCRIPCIÓN */}
      <TextInput
        placeholder="Descripción"
        value={nuevaDescripcion}
        onChangeText={setNuevaDescripcion}
        style={[
          styles.input,
          { height: 80 }
        ]}
        multiline
      />

      {/* BOTÓN */}
      <View style={{ marginTop: 10 }}>
        <Button
          title="💾 Guardar cambios"
          onPress={editarProducto}
        />
      </View>

      {/* 🔥 MODAL */}
      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

    </View>
  );
}