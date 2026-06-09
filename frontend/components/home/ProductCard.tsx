import { useState } from 'react';
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

      {item.stock !== undefined && item.stock !== null && (
        <Text
          style={{
            backgroundColor: '#00a650',
            paddingVertical: isWeb ? 8 : 12,
            borderRadius: 10,
            margin: isWeb ? 14 : 10,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            shadowColor: '#00a650',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2
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
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: isWeb ? 12 : 15,
            borderRadius: 10,
            margin: isWeb ? 14 : 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.08,
            shadowRadius: 5,
            elevation: 3
          }}
        >
          <Text onPress={() => onEditar(item)}>Editar</Text>

          <Text onPress={() => onEliminar(item.id)}>
            Eliminar
          </Text>
        </View>
      )}
    </View>
  );
}
