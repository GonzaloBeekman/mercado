import {
  View,
  Text,
  TextInput,
  TouchableOpacity
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
  return (
    <View>
      <Text>Email</Text>

      <Text
        style={{
          marginBottom: 10
        }}
      >
        {email}
      </Text>

      <Text>Nombre</Text>

      <TextInput
        value={nombre}
        onChangeText={onNombreChange}
        style={styles.input}
      />

      <Text>Nueva contrasena</Text>

      <TextInput
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        placeholder="Opcional"
        style={styles.input}
      />

      <TouchableOpacity
        onPress={onGuardar}
        style={{
          backgroundColor: '#3483fa',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 10
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
