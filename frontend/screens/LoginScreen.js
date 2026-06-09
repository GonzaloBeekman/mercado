import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/usuarios/login`, {
        email,
        password
      });

      const token = res.data.token;

      // 💾 guardar token
      await AsyncStorage.setItem('token', token);

      // navegar
      navigation.navigate('Home');

    } catch (err) {
      console.log(err);

      Alert.alert(
        'Error',
        'Credenciales incorrectas'
      );
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        placeholderTextColor="#777"
        style={{ color: '#111' }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholderTextColor="#777"
        style={{ color: '#111' }}
      />

      <Button title="Login" onPress={login} />

    </View>
  );
}
