import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles/globalStyles';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';

export default function CrearProducto() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const inputCardStyle = [
    styles.input,
    {
      maxWidth: undefined,
      alignSelf: 'stretch' as const
    }
  ];

  // Estados del formulario para crear un producto nuevo.
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados del modal reutilizable.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Crea el producto y guarda stock, precio, descripcion e imagen.
  const crearProducto = async () => {
    const nombreLimpio = nombre.trim();
    const precioLimpio = precio.trim();
    const stockLimpio = stock.trim();
    const descripcionLimpia = descripcion.trim();
    const imagenLimpia = imagen.trim();

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

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.post(
        `${API_URL}/api/productos`,
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

      setModalMessage('Producto creado correctamente');
      setModalVisible(true);

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

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
      <View
        style={{
          width: '100%',
          maxWidth: isWeb ? 560 : undefined,
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
          Crear Producto
        </Text>

        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
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
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
            style={[...inputCardStyle, { flex: 1 }]}
          />

          <TextInput
            placeholder="Stock"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={[...inputCardStyle, { flex: 1 }]}
          />
        </View>

        <TextInput
          placeholder="Descripcion"
          value={descripcion}
          onChangeText={setDescripcion}
          style={[
            ...inputCardStyle,
            { height: 90, textAlignVertical: 'top' }
          ]}
          multiline
        />

        <TextInput
          placeholder="URL de imagen"
          value={imagen}
          onChangeText={setImagen}
          style={inputCardStyle}
        />

        <TouchableOpacity
          onPress={crearProducto}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9bbcf5' : '#3483fa',
            paddingVertical: 13,
            borderRadius: 9,
            alignItems: 'center',
            marginTop: 4
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            {loading ? 'Creando...' : 'Crear producto'}
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
