import {
  View,
  Text,
  FlatList
} from 'react-native';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import styles from '../styles/globalStyles';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';
import { EntregaCard } from '../components/entregas/EntregaCard';

type TokenPayload = {
  id: number;
  email: string;
  rol: string;
};

export default function Entregas() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [rol, setRol] = useState<string | null>(null);

  // Estados del modal de mensajes.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Al entrar a la pantalla cargamos rol y pedidos.
  // Pide las entregas al backend.
  // El backend filtra automaticamente si el usuario es comprador.
  const cargarEntregas = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.get(
        `${API_URL}/api/entregas`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEntregas(res.data);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al cargar entregas');
      setModalVisible(true);
    }
  }, []);

  // Lee el token, detecta el rol y trae las entregas permitidas por backend.
  const cargarDatos = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const decoded = jwtDecode<TokenPayload>(token);
        setRol(decoded.rol);
      }

      await cargarEntregas();
    } catch (err) {
      console.log(err);

      setModalMessage('Error al cargar datos');
      setModalVisible(true);
    }
  }, [cargarEntregas]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // El repartidor marca el pedido como recibido/completado.
  const completarEntrega = async (id: number, codigoEntrega: string) => {
    if (codigoEntrega.length !== 3) {
      setModalMessage('Ingresa el codigo de 3 digitos');
      setModalVisible(true);

      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/entregas/${id}`,
        {
          codigo_entrega: codigoEntrega
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cargarEntregas();

      setModalMessage('Pedido marcado como recibido');
      setModalVisible(true);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al completar entrega');
      setModalVisible(true);
    }
  };

  // Cambia el titulo segun desde que rol se entra a la pantalla.
  const titulo =
    rol === 'comprador'
      ? 'Mis pedidos'
      : rol === 'vendedor'
        ? 'Pedidos de ventas'
        : 'Entregas';

  const puedeCompletar = rol === 'repartidor';
  const mostrarComprador = rol !== 'comprador';
  const mostrarCodigoEntrega = rol === 'comprador';

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 10
        }}
      >
        {titulo}
      </Text>

      <FlatList
        data={entregas}
        keyExtractor={(item) =>
          item.id.toString()
        }
        ListEmptyComponent={
          <Text
            style={{
              color: '#777',
              marginTop: 10
            }}
          >
            No hay pedidos para mostrar
          </Text>
        }
        renderItem={({ item }) => (
          <EntregaCard
            item={item}
            mostrarComprador={mostrarComprador}
            mostrarCodigoEntrega={mostrarCodigoEntrega}
            puedeCompletar={puedeCompletar}
            onCompletar={completarEntrega}
          />
        )}
      />

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
