import { View, Text } from 'react-native';

type Props = {
  numero: string;
  titular: string;
  fecha: string;
};

// Vista previa de la tarjeta mientras el usuario carga los datos.
export function PaymentCardPreview({
  numero,
  titular,
  fecha
}: Props) {
  return (
    <View
      style={{
        backgroundColor: '#3483fa',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          letterSpacing: 2
        }}
      >
        {numero || '0000 0000 0000 0000'}
      </Text>

      <Text
        style={{
          color: '#fff',
          marginTop: 20
        }}
      >
        {titular || 'TITULAR'}
      </Text>

      <Text
        style={{
          color: '#fff',
          marginTop: 5
        }}
      >
        {fecha || 'MM/AA'}
      </Text>
    </View>
  );
}
