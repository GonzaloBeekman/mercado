import {
  View,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useState } from 'react';

type Entrega = {
  id: number;
  estado: string;
  fecha?: string;
  producto: string;
  comprador: string;
  codigo_entrega?: string | null;
};

type Props = {
  item: Entrega;
  mostrarComprador: boolean;
  mostrarCodigoEntrega: boolean;
  puedeCompletar: boolean;
  onCompletar: (id: number, codigoEntrega: string) => void;
};

// Tarjeta de pedido.
// Sirve para comprador, vendedor y repartidor cambiando solo los permisos por props.
export function EntregaCard({
  item,
  mostrarComprador,
  mostrarCodigoEntrega,
  puedeCompletar,
  onCompletar
}: Props) {
  const [codigoIngresado, setCodigoIngresado] = useState('');

  const estaCompletado = item.estado === 'completado';
  const estadoTexto = estaCompletado ? 'Recibido' : 'Pendiente';
  const estadoColor = estaCompletado ? '#16803c' : '#b26a00';
  const estadoFondo = estaCompletado ? '#e8f7ee' : '#fff4df';

  // Convierte la fecha del backend a un formato facil de leer.
  const fechaFormateada = item.fecha
    ? new Date(item.fecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e5e5e5'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#777',
              fontSize: 12,
              marginBottom: 2
            }}
          >
            Producto
          </Text>

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: '#111'
            }}
          >
            {item.producto}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: estadoFondo,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999
          }}
        >
          <Text
            style={{
              color: estadoColor,
              fontWeight: 'bold',
              fontSize: 12
            }}
          >
            {estadoTexto}
          </Text>
        </View>
      </View>

      {mostrarComprador && (
        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              color: '#777',
              fontSize: 12,
              marginBottom: 2
            }}
          >
            Comprador
          </Text>

          <Text style={{ color: '#222' }}>
            {item.comprador}
          </Text>
        </View>
      )}

      {fechaFormateada && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0'
          }}
        >
          <Text
            style={{
              color: '#777',
              fontSize: 12,
              marginBottom: 2
            }}
          >
            Fecha del pedido
          </Text>

          <Text
            style={{
              color: '#222',
              fontWeight: '500'
            }}
          >
            {fechaFormateada}
          </Text>
        </View>
      )}

      {mostrarCodigoEntrega && !estaCompletado && item.codigo_entrega && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#f6f8fb',
            padding: 10,
            borderRadius: 8
          }}
        >
          <Text
            style={{
              color: '#777',
              fontSize: 12,
              marginBottom: 2
            }}
          >
            Codigo para recibir
          </Text>

          <Text
            style={{
              color: '#111',
              fontWeight: 'bold',
              fontSize: 22,
              letterSpacing: 4
            }}
          >
            {item.codigo_entrega}
          </Text>
        </View>
      )}

      {puedeCompletar && !estaCompletado && (
        <View>
          <Text
            style={{
              color: '#777',
              fontSize: 12,
              marginTop: 12,
              marginBottom: 4
            }}
          >
            Codigo del comprador
          </Text>

          <TextInput
            placeholder="3 digitos"
            keyboardType="numeric"
            maxLength={3}
            value={codigoIngresado}
            onChangeText={(text) => {
              // Solo se permiten numeros para evitar errores al validar.
              setCodigoIngresado(text.replace(/\D/g, ''));
            }}
            style={{
              backgroundColor: '#f6f8fb',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 10,
              marginBottom: 10
            }}
          />

          <TouchableOpacity
            onPress={() => onCompletar(item.id, codigoIngresado)}
            style={{
              backgroundColor: '#3483fa',
              padding: 10,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              Marcar como recibido
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
