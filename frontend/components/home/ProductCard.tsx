import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen_url?: string;
  stock?: number;
};

type Props = {
  item: Producto;
  rol: string | null;
  numColumns: number;
  onAgregarCarrito: (id: number) => void;
  onEditar: (item: Producto) => void;
  onEliminar: (id: number) => void;
};

// Tarjeta visual de cada producto.
// Recibe acciones desde Home para no cambiar la logica de API ni navegacion.
export function ProductCard({
  item,
  rol,
  numColumns,
  onAgregarCarrito,
  onEditar,
  onEliminar
}: Props) {
  const isWeb = Platform.OS === 'web';
  const [imageError, setImageError] = useState(false);

  // Limpiamos la URL para evitar espacios pegados al copiarla desde el navegador.
  const imageUrl = item.imagen_url?.trim();
  const shouldShowImage = Boolean(imageUrl) && !imageError;

  // Si el vendedor cambia la URL, la card vuelve a intentar cargar la imagen.
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const cardWidth = isWeb
    ? numColumns === 4
      ? '23.5%'
      : numColumns === 3
        ? '31.5%'
        : numColumns === 2
          ? '48%'
          : '100%'
    : numColumns === 1
      ? '92%'
      : '47%';
  const hasStock = item.stock !== undefined && item.stock !== null;

  return (
    <View
      style={{
        width: cardWidth,
        backgroundColor: '#fff',
        margin: isWeb ? 8 : 8,
        borderRadius: isWeb ? 12 : 18,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowOpacity: isWeb ? 0.06 : 0.1,
        shadowRadius: isWeb ? 3 : 5,
        elevation: 4,
        borderWidth: isWeb ? 1 : 0,
        borderColor: '#ededed'
      }}
    >
      {/* Imagen del producto. */}
      <View
        style={{
          width: '100%',
          aspectRatio: isWeb ? 1.25 : 1.1,
          backgroundColor: '#f5f5f5',
          borderRadius: isWeb ? 0 : 8,
          overflow: 'hidden',
          marginBottom: 5
        }}
      >
        {shouldShowImage ? (
          <Image
            source={{
              uri: imageUrl
            }}
            style={{
              width: '100%',
              height: '100%'
            }}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0'
            }}
          >
            <Text style={{ color: '#888', fontWeight: '600' }}>
              Sin imagen
            </Text>
          </View>
        )}
      </View>

      {/* Datos principales del producto. */}
      <Text
        numberOfLines={1}
        style={{
          marginTop: isWeb ? 10 : 5,
          paddingHorizontal: isWeb ? 14 : 10,
          fontSize: isWeb ? 16 : 24,
          fontWeight: '600'
        }}
      >
        {item.nombre}
      </Text>

      <Text
        style={{
          color: '#00a650',
          fontWeight: 'bold',
          fontSize: isWeb ? 18 : 24,
          marginTop: isWeb ? 4 : 5,
          paddingHorizontal: isWeb ? 14 : 10
        }}
      >
        ${item.precio}
      </Text>

      {item.descripcion && (
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            color: '#777',
            paddingHorizontal: isWeb ? 14 : 10,
            marginTop: 4
          }}
        >
          {item.descripcion}
        </Text>
      )}

      {hasStock && (
        <Text
          style={{
            backgroundColor: Number(item.stock) > 0 ? '#e8f7ef' : '#fff0f0',
            paddingVertical: isWeb ? 7 : 10,
            borderRadius: 10,
            marginHorizontal: isWeb ? 14 : 10,
            marginTop: 10,
            textAlign: 'center',
            color: Number(item.stock) > 0 ? '#007f3b' : '#c62828',
            fontWeight: 'bold',
            borderWidth: 1,
            borderColor: Number(item.stock) > 0 ? '#bfe9d1' : '#ffd6d6'
          }}
        >
          Stock: {item.stock}
        </Text>
      )}

      {/* El comprador solo puede agregar productos con stock. */}
      {rol === 'comprador' && (
        Number(item.stock) > 0 ? (
          <TouchableOpacity
            onPress={() => onAgregarCarrito(item.id)}
            style={{
              backgroundColor: '#00a650',
              padding: isWeb ? 10 : 6,
              borderRadius: 8,
              marginTop: 6,
              margin: isWeb ? 14 : 10,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff' }}>Agregar</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: '#eee',
              padding: isWeb ? 10 : 6,
              borderRadius: 8,
              marginTop: 6,
              margin: isWeb ? 14 : 10,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: '#666',
                fontWeight: 'bold'
              }}
            >
              Sin stock
            </Text>
          </View>
        )
      )}

      {/* El vendedor administra sus productos desde la tarjeta. */}
      {rol === 'vendedor' && (
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            paddingTop: 6,
            margin: isWeb ? 14 : 10,
            marginTop: 12
          }}
        >
          <TouchableOpacity
            onPress={() => onEditar(item)}
            style={{
              flex: 1,
              backgroundColor: '#eef5ff',
              borderColor: '#3483fa',
              borderWidth: 1,
              paddingVertical: isWeb ? 9 : 10,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#1259c3', fontWeight: '700' }}>
              Editar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onEliminar(item.id)}
            style={{
              flex: 1,
              backgroundColor: '#fff0f0',
              borderColor: '#e53935',
              borderWidth: 1,
              paddingVertical: isWeb ? 9 : 10,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#c62828', fontWeight: '700' }}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
