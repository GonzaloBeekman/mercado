import { View, Text, TouchableOpacity, Platform } from 'react-native';

type Props = {
  rol: string | null;
  onPerfil: () => void;
  onCarrito: () => void;
  onEntregas: () => void;
  onLogout: () => void;
};

// Header principal del home.
// Muestra accesos distintos segun el rol del usuario logueado.
export function HomeHeader({
  rol,
  onPerfil,
  onCarrito,
  onEntregas,
  onLogout
}: Props) {
  const isWeb = Platform.OS === 'web';

  // Renderiza cada item del menu con el mismo estilo.
  const renderMenuButton = (
    label: string,
    color: string,
    onPress: () => void
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: isWeb ? 4 : 0,
        paddingVertical: isWeb ? 4 : 0
      }}
    >
      <Text
        style={{
          color,
          fontSize: isWeb ? 15 : 14,
          fontWeight: '500'
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: isWeb ? 'center' : 'flex-start',
        backgroundColor: '#fff',
        padding: isWeb ? 16 : 15,
        borderRadius: isWeb ? 12 : 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: isWeb ? 0.06 : 0.08,
        shadowRadius: isWeb ? 4 : 5,
        elevation: 3,
        gap: 12
      }}
    >
      <Text
        style={{
          fontSize: isWeb ? 24 : 24,
          fontWeight: 'bold',
          color: '#111',
          flexShrink: 0
        }}
      >
        Market App
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          gap: isWeb ? 14 : 10,
          flex: 1
        }}
      >
        {renderMenuButton('Perfil', '#1d4ed8', onPerfil)}

        {rol === 'comprador' && (
          renderMenuButton('Carrito', '#1d4ed8', onCarrito)
        )}

        {(rol === 'comprador' || rol === 'vendedor') && (
          renderMenuButton('Pedidos', '#c26700', onEntregas)
        )}

        {rol === 'repartidor' && (
          renderMenuButton('Entregas', '#c26700', onEntregas)
        )}

        {renderMenuButton('Salir', '#dc2626', onLogout)}
      </View>
    </View>
  );
}
