import { View, Text, TouchableOpacity, Platform } from 'react-native';

type ItemCarrito = {
  id_item: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

type Props = {
  item: ItemCarrito;
  onRestar: (id: number) => void;
  onSumar: (id: number) => void;
  onEliminar: (id: number) => void;
};

// Muestra un producto dentro del carrito.
// Las acciones llegan por props para mantener la logica en la pantalla carrito.
export function CartItem({
  item,
  onRestar,
  onSumar,
  onEliminar
}: Props) {
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: isWeb ? 16 : 10,
        marginVertical: isWeb ? 8 : 5,
        borderRadius: isWeb ? 12 : 8,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: isWeb ? 0.04 : 0,
        shadowRadius: 4,
        elevation: isWeb ? 2 : 0
      }}
    >
      <View
        style={{
          flexDirection: isWeb ? 'row' : 'column',
          justifyContent: 'space-between',
          gap: 10
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: isWeb ? 18 : 16,
              color: '#111'
            }}
          >
            {item.nombre}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: '#777'
            }}
          >
            Precio unitario: ${item.precio}
          </Text>
        </View>

        <Text
          style={{
            fontWeight: 'bold',
            color: '#00a650',
            fontSize: isWeb ? 18 : 16
          }}
        >
          ${item.precio * item.cantidad}
        </Text>
      </View>

      {/* Controles para cambiar la cantidad del producto. */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: isWeb ? 14 : 8
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => onRestar(item.id_item)}
            style={{
              backgroundColor: '#eee',
              minWidth: 36,
              paddingVertical: 7,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontWeight: 'bold'
              }}
            >
              -
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              marginHorizontal: 15,
              fontSize: 16,
              fontWeight: 'bold'
            }}
          >
            {item.cantidad}
          </Text>

          <TouchableOpacity
            onPress={() => onSumar(item.id_item)}
            style={{
              backgroundColor: '#eee',
              minWidth: 36,
              paddingVertical: 7,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontWeight: 'bold'
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onEliminar(item.id_item)}>
          <Text
            style={{
              color: '#dc2626',
              fontWeight: isWeb ? '600' : '400'
            }}
          >
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          marginTop: 10,
          color: '#777',
          fontSize: 12
        }}
      >
        Subtotal calculado por cantidad seleccionada
      </Text>
    </View>
  );
}
