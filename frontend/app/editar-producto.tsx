import {
  View,
  Text,
  TextInput,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { useEffect, useState } from 'react';
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
      alignSelf: 'stretch' as const,
      backgroundColor: '#fff',
      color: '#111',
      marginBottom: 0,
      minHeight: isWeb ? 44 : 48
    }
  ];
  const labelStyle = {
    color: '#333',
    fontSize: 14,
    fontWeight: '700' as const,
    marginBottom: 6,
    marginTop: 2
  };
  const fieldStyle = {
    gap: 6,
    width: '100%' as const
  };

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

  // Carga el producto actualizado para mostrar el stock real de la base.
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos/${id}`);
        const producto = res.data;

        if (!producto) return;

        setNuevoNombre(producto.nombre || '');
        setNuevoPrecio(String(producto.precio || ''));
        setNuevoStock(
          producto.stock !== null && producto.stock !== undefined
            ? String(producto.stock)
            : ''
        );
        setNuevaDescripcion(producto.descripcion || '');
        setImagen(producto.imagen_url || '');
        setImagenConError(false);
      } catch (err: any) {
        console.log(err?.response?.data || err.message);

        setModalMessage('No se pudo cargar el producto actualizado');
        setModalVisible(true);
      }
    };

    cargarProducto();
  }, [id]);

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
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        padding: isWeb ? 24 : 16,
        paddingBottom: isWeb ? 36 : 32
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: isWeb ? 620 : undefined,
          alignSelf: 'center',
          backgroundColor: '#fff',
          borderRadius: isWeb ? 12 : 16,
          padding: isWeb ? 22 : 18,
          gap: 12,
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
              height: isWeb ? 190 : 150,
              borderRadius: 10,
              marginBottom: 0
            }}
            resizeMode="cover"
            onError={() => setImagenConError(true)}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: isWeb ? 190 : 150,
              borderRadius: 10,
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

        {/* Labels fijos para que en Android se entienda cada campo aunque este vacio. */}
        <View style={fieldStyle}>
          <Text style={labelStyle}>URL de imagen</Text>
          <TextInput
            placeholder="Pega una URL de imagen"
            value={imagen}
            onChangeText={(text) => {
              setImagen(text);
              setImagenConError(false);
            }}
            style={inputCardStyle}
            placeholderTextColor="#777"
            selectionColor="#3483fa"
          />
        </View>

        <View style={fieldStyle}>
          <Text style={labelStyle}>Nombre</Text>
          <TextInput
            placeholder="Nombre del producto"
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
            style={inputCardStyle}
            placeholderTextColor="#777"
            selectionColor="#3483fa"
          />
        </View>

        <View
          style={{
            flexDirection: isWeb ? 'row' : 'column',
            gap: 12
          }}
        >
          <View style={{ ...fieldStyle, flex: 1 }}>
            <Text style={labelStyle}>Precio</Text>
            <TextInput
              placeholder="Precio"
              value={nuevoPrecio}
              onChangeText={setNuevoPrecio}
              keyboardType="numeric"
              style={[...inputCardStyle, { flex: 1 }]}
              placeholderTextColor="#777"
              selectionColor="#3483fa"
            />
          </View>

          <View style={{ ...fieldStyle, flex: 1 }}>
            <Text style={labelStyle}>Stock</Text>
            <TextInput
              placeholder="Cantidad disponible"
              value={nuevoStock}
              onChangeText={setNuevoStock}
              keyboardType="numeric"
              style={[...inputCardStyle, { flex: 1 }]}
              placeholderTextColor="#777"
              selectionColor="#3483fa"
            />
          </View>
        </View>

        <View style={fieldStyle}>
          <Text style={labelStyle}>Descripcion</Text>
          <TextInput
            placeholder="Descripcion del producto"
            value={nuevaDescripcion}
            onChangeText={setNuevaDescripcion}
            style={[
              ...inputCardStyle,
              {
                minHeight: isWeb ? 100 : 118,
                textAlignVertical: 'top'
              }
            ]}
            multiline
            placeholderTextColor="#777"
            selectionColor="#3483fa"
          />
        </View>

        <TouchableOpacity
          onPress={editarProducto}
          style={{
            backgroundColor: '#00a650',
            paddingVertical: 13,
            borderRadius: 9,
            alignItems: 'center',
            marginTop: 2
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
    </ScrollView>
  );
}
