import { View, Text, TouchableOpacity, Platform } from 'react-native';

type Props = {
  total: number;
  onFinalizar: () => void;
};

// Resumen inferior del carrito.
// Se separa para que carrito.tsx tenga menos JSX mezclado con logica.
export function CartSummary({ total, onFinalizar }: Props) {
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: isWeb ? 12 : 0,
        padding: isWeb ? 18 : 0,
        borderWidth: isWeb ? 1 : 0,
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
      {isWeb && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12
          }}
        >
          Resumen
        </Text>
      )}

      <Text
        style={{
          fontSize: isWeb ? 22 : 18,
          fontWeight: 'bold',
          marginTop: isWeb ? 0 : 10
        }}
      >
        Total: ${total}
      </Text>

      <TouchableOpacity
        onPress={onFinalizar}
        style={{
          backgroundColor: '#00a650',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 15
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          Finalizar compra
        </Text>
      </TouchableOpacity>
    </View>
  );
}
