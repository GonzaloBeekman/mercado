import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Platform
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
    imagen_url,
    stock
  } = useLocalSearchParams();

  const router = useRouter();

  // Estados del formulario cargados con los datos actuales del producto.
  const [nuevoNombre, setNuevoNombre] =
    useState((nombre as string) || '');

  const [nuevoPrecio, setNuevoPrecio] =
    useState(String(precio || ''));

  const [nuevaDescripcion, setNuevaDescripcion] =
    useState((descripcion as string) || '');

  const [imagen, setImagen] =
    useState((imagen_url as string) || '');

  // Si la imagen no carga, mostramos un placeholder en vez de una card vacia.
  const [imagenConError, setImagenConError] =
    useState(false);

  // Estados del modal reutilizable.
  const [modalVisible, setModalVisible] =
    useState(false);

  const [modalMessage, setModalMessage] =
    useState('');

  const imagenLimpia = imagen.trim();
  const mostrarImagen = Boolean(imagenLimpia) && !imagenConError;

  // Guarda los cambios del producto en el backend.
  const editarProducto = async () => {
    const nombreLimpio = nuevoNombre.trim();
    const precioLimpio = nuevoPrecio.trim();
    const descripcionLimpia = nuevaDescripcion.trim();

    if (!nombreLimpio || !precioLimpio) {
      setModalMessage('Nombre y precio obligatorios');
      setModalVisible(true);
      return;
    }

    if (isNaN(Number(precioLimpio))) {
      setModalMessage('El precio debe ser numerico');
      setModalVisible(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/productos/${id}`,
        {
          nombre: nombreLimpio,
          precio: parseFloat(precioLimpio),
          stock: stock ? Number(stock) : null,
          descripcion: descripcionLimpia,
          imagen_url: imagenLimpia
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setModalMessage('Producto actualizado correctamente');
      setModalVisible(true);

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage(
        err?.response?.data?.message ||
        'No se pudo actualizar'
      );

      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Editar Producto
      </Text>

      {/* Vista previa de la imagen del producto. */}
      {mostrarImagen ? (
        <Image
          source={{
            uri: imagenLimpia
          }}
          style={{
            width: '100%',
            height: 150,
            borderRadius: 10,
            marginBottom: 10,
            maxWidth: Platform.OS === 'web' ? 580 : undefined
          }}
          resizeMode="cover"
          onError={() => setImagenConError(true)}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 150,
            borderRadius: 10,
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            maxWidth: Platform.OS === 'web' ? 580 : undefined
          }}
        >
          <Text style={{ color: '#777', fontWeight: '600' }}>
            Sin imagen
          </Text>
        </View>
      )}

      <TextInput
        placeholder="URL de imagen"
        value={imagen}
        onChangeText={(text) => {
          setImagen(text);
          setImagenConError(false);
        }}
        style={styles.input}
      />

      <TextInput
        placeholder="Nombre"
        value={nuevoNombre}
        onChangeText={setNuevoNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Precio"
        value={nuevoPrecio}
        onChangeText={setNuevoPrecio}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Descripcion"
        value={nuevaDescripcion}
        onChangeText={setNuevaDescripcion}
        style={[
          styles.input,
          { height: 80 }
        ]}
        multiline
      />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Guardar cambios"
          onPress={editarProducto}
        />
      </View>

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
