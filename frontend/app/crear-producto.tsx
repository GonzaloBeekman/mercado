import {
  View,
  TextInput,
  Button,
  Text
} from 'react-native';

import { useState } from 'react';
import axios from 'axios';

import {
  useLocalSearchParams,
  useRouter
} from 'expo-router';

import styles from '../styles/globalStyles';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';

export default function CrearProducto() {

  const { token } = useLocalSearchParams();

  const router = useRouter();

  const tokenStr =
    Array.isArray(token)
      ? token[0]
      : token;

  // STATES
  const [nombre, setNombre] =
    useState('');

  const [precio, setPrecio] =
    useState('');

  const [descripcion, setDescripcion] =
    useState('');

  const [imagen, setImagen] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  // 🔥 MODAL
  const [modalVisible, setModalVisible] =
    useState(false);

  const [modalMessage, setModalMessage] =
    useState('');

  // CREAR
  const crearProducto = async () => {

    // VALIDACIÓN
    if (!nombre || !precio) {

      setModalMessage(
        'Completar todos los campos obligatorios'
      );

      setModalVisible(true);

      return;
    }

    // PRECIO
    if (isNaN(Number(precio))) {

      setModalMessage(
        'El precio debe ser numérico'
      );

      setModalVisible(true);

      return;
    }

    setLoading(true);

    try {

      await axios.post(
        `${API_URL}/api/productos`,
        {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          imagen_url: imagen
        },
        {
          headers: {
            Authorization:
              `Bearer ${tokenStr}`
          }
        }
      );

      // ✅ ÉXITO
      setModalMessage(
        'Producto creado correctamente'
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
        'No se pudo crear el producto'
      );

      setModalVisible(true);

    } finally {

      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* TÍTULO */}
      <Text style={styles.title}>
        Crear Producto
      </Text>

      {/* NOMBRE */}
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      {/* PRECIO */}
      <TextInput
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* DESCRIPCIÓN */}
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      {/* IMAGEN */}
      <TextInput
        placeholder="URL de imagen"
        value={imagen}
        onChangeText={setImagen}
        style={styles.input}
      />

      {/* BOTÓN */}
      <Button
        title={
          loading
            ? 'Creando...'
            : 'Crear Producto'
        }
        onPress={crearProducto}
        disabled={loading}
      />

      {/* 🔥 MODAL */}
      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

    </View>
  );
}