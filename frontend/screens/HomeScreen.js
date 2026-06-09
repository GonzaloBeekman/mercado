import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

export default function HomeScreen() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.get(`${API_URL}/api/productos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProductos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.nombre} - ${item.precio}
          </Text>
        )}
      />
    </View>
  );
}