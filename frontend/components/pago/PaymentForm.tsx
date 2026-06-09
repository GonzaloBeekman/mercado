import { TextInput } from 'react-native';

type Props = {
  numero: string;
  titular: string;
  fecha: string;
  cvv: string;
  onNumeroChange: (value: string) => void;
  onTitularChange: (value: string) => void;
  onFechaChange: (value: string) => void;
  onCvvChange: (value: string) => void;
};

const inputStyle = {
  backgroundColor: '#fff',
  color: '#111',
  padding: 12,
  borderRadius: 8,
  marginBottom: 10
};

// Inputs del pago.
// La pantalla padre decide como formatear y validar cada valor.
export function PaymentForm({
  numero,
  titular,
  fecha,
  cvv,
  onNumeroChange,
  onTitularChange,
  onFechaChange,
  onCvvChange
}: Props) {
  return (
    <>
      <TextInput
        placeholder="Numero tarjeta"
        keyboardType="numeric"
        maxLength={16}
        value={numero}
        onChangeText={onNumeroChange}
        style={inputStyle}
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Titular"
        value={titular}
        onChangeText={onTitularChange}
        style={inputStyle}
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="MM/AA"
        maxLength={5}
        value={fecha}
        onChangeText={onFechaChange}
        style={inputStyle}
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="CVV"
        keyboardType="numeric"
        secureTextEntry
        maxLength={3}
        value={cvv}
        onChangeText={onCvvChange}
        style={{
          ...inputStyle,
          marginBottom: 20
        }}
        placeholderTextColor="#777"
      />
    </>
  );
}
