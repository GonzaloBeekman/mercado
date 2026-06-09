import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';

import styles from '../../styles/globalStyles';
import { PasswordInput } from '../auth/PasswordInput';

type Props = {
  email: string;
  password: string;
  loading: boolean;
  googleLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  onLoginGoogle: () => void;
  onRegister: () => void;
};

// Formulario de login normal y login por huella.
// La logica queda en login.tsx y este componente solo dibuja la interfaz.
export function LoginForm({
  email,
  password,
  loading,
  googleLoading,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onLoginGoogle,
  onRegister
}: Props) {
  const isWeb = Platform.OS === 'web';

  return (
    <View style={{ width: '100%' }}>
      <TextInput
        placeholder="Email"
        onChangeText={onEmailChange}
        value={email}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <PasswordInput
        value={password}
        onChangeText={onPasswordChange}
      />

      <TouchableOpacity
        onPress={onLogin}
        disabled={loading}
        style={{
          backgroundColor:
            loading
              ? '#999'
              : '#3483fa',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 10,
          width: '100%'
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            Ingresar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLoginGoogle}
        disabled={googleLoading}
        style={{
          backgroundColor: googleLoading ? '#999' : '#fff',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 10,
          width: '100%',
          borderWidth: 1,
          borderColor: '#ddd'
        }}
      >
        <Text
          style={{
            color: '#111',
            fontWeight: 'bold'
          }}
        >
          {googleLoading ? 'Conectando...' : 'Ingresar con Google'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRegister}>
        <Text
          style={{
            marginTop: isWeb ? 16 : 12,
            textAlign: 'center',
            color: '#3483fa',
            fontWeight: '600'
          }}
        >
          Crear cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}
