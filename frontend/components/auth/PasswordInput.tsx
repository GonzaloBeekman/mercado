import { TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import styles from '../../styles/globalStyles';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

// Input de password con boton de ojo.
// Permite ver u ocultar la contrasena sin cambiar el valor escrito.
export function PasswordInput({
  value,
  onChangeText,
  placeholder = 'Password'
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View
      style={[
        styles.input,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 0,
          paddingRight: 8
        }
      ]}
    >
      <TextInput
        placeholder={placeholder}
        secureTextEntry={!visible}
        value={value}
        onChangeText={onChangeText}
        style={{
          flex: 1,
          paddingVertical: 12,
          color: '#111',
          outlineStyle: 'none' as any
        }}
        placeholderTextColor="#777"
      />

      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={{
          padding: 6
        }}
      >
        <Ionicons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color="#666"
        />
      </TouchableOpacity>
    </View>
  );
}
