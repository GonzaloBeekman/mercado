import {
  View,
  Text,
  FlatList,
  Platform
} from 'react-native';

import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';
import { CartItem } from '../components/carrito/CartItem';
import { CartSummary } from '../components/carrito/CartSummary';
import styles from '../styles/globalStyles';

export default function Carrito() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';

  const [items, setItems] = useState<any[]>([]);

  // Estados del modal de mensajes.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Carga el carrito una sola vez al entrar a la pantalla.
  useEffect(() => {
    cargarCarrito();
  }, []);

  // Pide al backend todos los productos del carrito del usuario.
  const cargarCarrito = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.get(
        `${API_URL}/api/carrito`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(res.data);

      setItems(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al cargar carrito');
      setModalVisible(true);
    }
  };

  // Elimina un item completo del carrito.
  const eliminar = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await axios.delete(
        `${API_URL}/api/carrito/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cargarCarrito();

      setModalMessage('Producto eliminado del carrito');
      setModalVisible(true);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al eliminar producto');
      setModalVisible(true);
    }
  };

  // Suma una unidad del producto seleccionado.
  const sumarCantidad = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/carrito/sumar/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cargarCarrito();
    } catch (err) {
      console.log(err);
    }
  };

  // Resta una unidad; el backend elimina el item si llega a cero.
  const restarCantidad = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/carrito/restar/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cargarCarrito();
    } catch (err) {
      console.log(err);
    }
  };

  // Calcula el total actual usando precio por cantidad.
  const total = Array.isArray(items)
    ? items.reduce(
        (acc, item) =>
          acc + item.precio * item.cantidad,
        0
      )
    : 0;

  return (
    <View
      style={styles.container}
    >
      <Text
        style={{
          fontSize: isWeb ? 26 : 20,
          fontWeight: 'bold',
          marginBottom: isWeb ? 16 : 10
        }}
      >
        Carrito
      </Text>

      <View
        style={{
          flex: 1,
          flexDirection: isWeb ? 'row' : 'column',
          gap: isWeb ? 18 : 0
        }}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            data={items}
            keyExtractor={(item) =>
              item.id_item.toString()
            }
            contentContainerStyle={{
              paddingBottom: isWeb ? 20 : 10
            }}
            ListEmptyComponent={
              <Text
                style={{
                  color: '#777',
                  marginTop: 10
                }}
              >
                Tu carrito esta vacio
              </Text>
            }
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onRestar={restarCantidad}
                onSumar={sumarCantidad}
                onEliminar={eliminar}
              />
            )}
          />
        </View>

        <View
          style={{
            width: isWeb ? 320 : '100%',
            marginTop: isWeb ? 8 : 0
          }}
        >
          <CartSummary
            total={total}
            onFinalizar={() =>
              router.push({
                pathname: '/pago',
                params: {
                  total
                }
              })
            }
          />
        </View>
      </View>

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
