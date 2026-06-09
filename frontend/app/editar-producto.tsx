import {
  View,
  Text,
  TextInput,
  Image,
  Platform,
  TouchableOpacity
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
  const isWeb = Platform.OS === 'web';
  const inputCardStyle = [
    styles.input,
    {
      maxWidth: undefined,
      alignSelf: 'stretch' as const
    }
  ];

  // Estados del formulario cargados con los datos actuales del producto.
  const [nuevoNombre, setNuevoNombre] =
    useState((nombre as string) || '');

  const [nuevoPrecio, setNuevoPrecio] =
    useState(String(precio || ''));

  const [nuevoStock, setNuevoStock] =
    useState(String(stock ?? '0'));

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
    const stockLimpio = nuevoStock.trim();
    const descripcionLimpia = nuevaDescripcion.trim();

    if (!nombreLimpio || !precioLimpio || !stockLimpio) {
      setModalMessage('Nombre, precio y stock son obligatorios');
      setModalVisible(true);
      return;
    }

    if (isNaN(Number(precioLimpio))) {
      setModalMessage('El precio debe ser numerico');
      setModalVisible(true);
      return;
    }

    if (isNaN(Number(stockLimpio)) || Number(stockLimpio) < 0) {
      setModalMessage('El stock debe ser un numero mayor o igual a 0');
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
          stock: Number(stockLimpio),
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
      <View
        style={{
          width: '100%',
          maxWidth: isWeb ? 620 : undefined,
          alignSelf: 'center',
          backgroundColor: '#fff',
          borderRadius: isWeb ? 12 : 16,
          padding: isWeb ? 22 : 18,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3
        }}
      >
        <Text style={[styles.title, { alignSelf: 'flex-start' }]}>
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
              height: isWeb ? 210 : 170,
              borderRadius: 10,
              marginBottom: 12
            }}
            resizeMode="cover"
            onError={() => setImagenConError(true)}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: isWeb ? 210 : 170,
              borderRadius: 10,
              marginBottom: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0'
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
          style={inputCardStyle}
        />

        <TextInput
          placeholder="Nombre"
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
          style={inputCardStyle}
        />

        <View
          style={{
            flexDirection: isWeb ? 'row' : 'column',
            gap: isWeb ? 10 : 0
          }}
        >
          <TextInput
            placeholder="Precio"
            value={nuevoPrecio}
            onChangeText={setNuevoPrecio}
            keyboardType="numeric"
            style={[...inputCardStyle, { flex: 1 }]}
          />

          <TextInput
            placeholder="Stock"
            value={nuevoStock}
            onChangeText={setNuevoStock}
            keyboardType="numeric"
            style={[...inputCardStyle, { flex: 1 }]}
          />
        </View>

        <TextInput
          placeholder="Descripcion"
          value={nuevaDescripcion}
          onChangeText={setNuevaDescripcion}
          style={[
            ...inputCardStyle,
            { height: 90, textAlignVertical: 'top' }
          ]}
          multiline
        />

        <TouchableOpacity
          onPress={editarProducto}
          style={{
            backgroundColor: '#00a650',
            paddingVertical: 13,
            borderRadius: 9,
            alignItems: 'center',
            marginTop: 4
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            Guardar cambios
          </Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
