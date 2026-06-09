import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';

import styles from '../../styles/globalStyles';

type Props = {
  email: string;
  nombre: string;
  password: string;
  onNombreChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onGuardar: () => void;
};

// Formulario de datos del perfil.
// El email solo se muestra porque no se edita desde esta pantalla.
export function ProfileForm({
  email,
  nombre,
  password,
  onNombreChange,
  onPasswordChange,
  onGuardar
}: Props) {
  const isWeb = Platform.OS === 'web';
  const inputStyle = [
    styles.input,
    {
      maxWidth: undefined,
      alignSelf: 'stretch' as const
    }
  ];

  return (
    <View
      style={{
        width: '100%',
        gap: 8
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: '#666',
          fontWeight: '700'
        }}
      >
        Email
      </Text>

      <Text
        style={{
          marginBottom: 8,
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#f5f7fb',
          color: '#222',
          borderWidth: 1,
          borderColor: '#e5e8ef'
        }}
      >
        {email}
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: '#666',
          fontWeight: '700'
        }}
      >
        Nombre
      </Text>

      <TextInput
        value={nombre}
        onChangeText={onNombreChange}
        style={inputStyle}
      />

      <Text
        style={{
          fontSize: 13,
          color: '#666',
          fontWeight: '700'
        }}
      >
        Nueva contrasena
      </Text>

      <TextInput
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        placeholder="Opcional"
        style={inputStyle}
      />

      <TouchableOpacity
        onPress={onGuardar}
        style={{
          backgroundColor: '#3483fa',
          paddingVertical: isWeb ? 13 : 12,
          borderRadius: 9,
          alignItems: 'center',
          marginTop: 8
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          Guardar cambios
        </Text>
      </TouchableOpacity>
    </View>
  );
}
