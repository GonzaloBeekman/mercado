import { View, Text, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter, useFocusEffect } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import styles from '../../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/api';
import CustomModal from '../../components/CustomModal';
import { HomeHeader } from '../../components/home/HomeHeader';
import { ProductCard } from '../../components/home/ProductCard';

type TokenPayload = {
  id: number;
  email: string;
  rol: string;
};

export default function Home() {
  const router = useRouter();

  const [productos, setProductos] = useState<any[]>([]);
  const [rol, setRol] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Estados del modal reutilizable.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const screenWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';

  // En web usamos mas columnas para que las cards no queden enormes.
  // En app se mantiene una columna en celulares y dos en pantallas grandes.
  const numColumns = isWeb
    ? screenWidth >= 1300 ? 4 : screenWidth >= 950 ? 3 : screenWidth >= 650 ? 2 : 1
    : screenWidth > 600 ? 2 : 1;

  // Agrega un producto al carrito del usuario comprador.
  const agregarCarrito = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await axios.post(
        `${API_URL}/api/carrito`,
        {
          id_producto: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setModalMessage('Producto agregado correctamente');
      setModalVisible(true);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al agregar producto');
      setModalVisible(true);
    }
  };

  // Carga el token guardado y obtiene los productos al entrar al home.
  useEffect(() => {
    const cargarToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedToken) {
        router.replace('/login');
        return;
      }

      setToken(storedToken);

      const decoded = jwtDecode<TokenPayload>(storedToken);
      setRol(decoded.rol);

      obtenerProductos(storedToken);
    };

    cargarToken();
  }, [router]);

  // Refresca la lista cuando el usuario vuelve a esta pantalla.
  useFocusEffect(
    useCallback(() => {
      if (token) {
        obtenerProductos(token);
      }
    }, [token])
  );

  // Pide los productos al backend.
  const obtenerProductos = async (tokenActual: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/productos`, {
        headers: {
          Authorization: `Bearer ${tokenActual}`
        }
      });

      setProductos(res.data);
    } catch (err) {
      console.log(err);

      setModalMessage('Error al cargar productos');
      setModalVisible(true);
    }
  };

  // El vendedor elimina un producto y luego refresca la lista.
  const eliminarProducto = async (id: number) => {
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      obtenerProductos(token);

      setModalMessage('Producto eliminado');
      setModalVisible(true);
    } catch (err) {
      console.log(err);

      setModalMessage('Error al eliminar producto');
      setModalVisible(true);
    }
  };

  // Envia los datos del producto a la pantalla de edicion.
  const editar = (item: any) => {
    router.push({
      pathname: '/editar-producto',
      params: {
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        imagen_url: item.imagen_url
      }
    });
  };

  // Cierra la sesion borrando el token local.
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login');
  };

  if (!token) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: '#f5f5f5'
          }
        ]}
      >
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#f5f5f5'
        }
      ]}
    >
      <HomeHeader
        rol={rol}
        onPerfil={() => router.push('/perfil')}
        onCarrito={() => router.push('/carrito')}
        onEntregas={() => router.push('/entregas')}
        onLogout={logout}
      />

      {/* Boton visible solo para vendedores. */}
      {rol === 'vendedor' && (
        <TouchableOpacity
          style={{
            backgroundColor: '#3483fa',
            padding: isWeb ? 11 : 10,
            borderRadius: 8,
            marginBottom: 10,
            alignItems: 'center',
            alignSelf: isWeb ? 'flex-start' : 'stretch',
            paddingHorizontal: isWeb ? 18 : 10
          }}
          onPress={() => router.push('/crear-producto')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            Crear producto
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={productos}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={{
          alignItems: numColumns === 1 ? 'center' : 'stretch',
          paddingBottom: 20
        }}
        renderItem={({ item }: any) => (
          <ProductCard
            item={item}
            rol={rol}
            numColumns={numColumns}
            onAgregarCarrito={agregarCarrito}
            onEditar={editar}
            onEliminar={eliminarProducto}
          />
        )}
      />

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
