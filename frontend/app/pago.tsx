import {
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

import { useState } from 'react';

import {
  useLocalSearchParams,
  useRouter
} from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

import { contieneMalasPalabras } from '../utils/filtroPalabras';
import { API_URL } from '../config/api';
import CustomModal from '../components/CustomModal';
import { PaymentCardPreview } from '../components/pago/PaymentCardPreview';
import { PaymentForm } from '../components/pago/PaymentForm';

export default function Pago() {
  const router = useRouter();
  const { total } = useLocalSearchParams();

  const [numero, setNumero] = useState('');
  const [titular, setTitular] = useState('');
  const [fecha, setFecha] = useState('');
  const [cvv, setCvv] = useState('');

  // Estados del modal de errores y confirmaciones.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Formatea el numero de tarjeta dejando solo numeros y espacios cada 4 digitos.
  const cambiarNumero = (text: string) => {
    let limpio = text.replace(/\D/g, '');

    limpio = limpio.slice(0, 16);

    const formateado = limpio.replace(
      /(.{4})/g,
      '$1 '
    ).trim();

    setNumero(formateado);
  };

  // Formatea la fecha con el formato MM/AA.
  const cambiarFecha = (text: string) => {
    let limpio = text.replace(/\D/g, '');

    if (limpio.length >= 3) {
      limpio =
        limpio.slice(0, 2) +
        '/' +
        limpio.slice(2, 4);
    }

    setFecha(limpio);
  };

  // El CVV solo acepta numeros.
  const cambiarCvv = (text: string) => {
    const limpio = text.replace(/\D/g, '');

    setCvv(limpio);
  };

  // Valida los datos de pago antes de confirmar la compra.
  const validarTarjeta = () => {
    if (numero.replace(/\s/g, '').length < 13) {
      setModalMessage('La tarjeta debe tener 13 numeros');
      setModalVisible(true);

      return false;
    }

    if (!titular) {
      setModalMessage('Ingresa el titular');
      setModalVisible(true);

      return false;
    }

    if (fecha.length < 5) {
      setModalMessage('Fecha invalida');
      setModalVisible(true);

      return false;
    }

    if (cvv.length < 3) {
      setModalMessage('CVV invalido');
      setModalVisible(true);

      return false;
    }

    if (contieneMalasPalabras(titular)) {
      setModalMessage('No se permiten palabras ofensivas');
      setModalVisible(true);

      return false;
    }

    return true;
  };

  // Finaliza la compra. En web no pide biometria; en celular pide huella.
  const confirmarCompra = async () => {
    if (!validarTarjeta()) {
      return;
    }

    try {
      if (Platform.OS === 'web') {
        const token = await AsyncStorage.getItem('token');

        await axios.post(
          `${API_URL}/api/entregas/finalizar`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setModalMessage('Compra realizada correctamente');
        setModalVisible(true);

        setTimeout(() => {
          router.replace('/');
        }, 1500);

        return;
      }

      const compatible = await LocalAuthentication.hasHardwareAsync();

      if (!compatible) {
        setModalMessage('Tu dispositivo no tiene biometria');
        setModalVisible(true);

        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!enrolled) {
        setModalMessage('No hay huellas registradas');
        setModalVisible(true);

        return;
      }

      const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirmar pago',
        fallbackLabel: 'Usar contrasena'
      });

      if (!resultado.success) {
        setModalMessage('Pago cancelado');
        setModalVisible(true);

        return;
      }

      const token = await AsyncStorage.getItem('token');

      await axios.post(
        `${API_URL}/api/entregas/finalizar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setModalMessage('Compra realizada correctamente');
      setModalVisible(true);

      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      setModalMessage('Error al procesar pago');
      setModalVisible(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        Pago
      </Text>

      <PaymentCardPreview
        numero={numero}
        titular={titular}
        fecha={fecha}
      />

      <PaymentForm
        numero={numero}
        titular={titular}
        fecha={fecha}
        cvv={cvv}
        onNumeroChange={cambiarNumero}
        onTitularChange={setTitular}
        onFechaChange={cambiarFecha}
        onCvvChange={cambiarCvv}
      />

      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        Total: ${total}
      </Text>

      <TouchableOpacity
        onPress={confirmarCompra}
        style={{
          backgroundColor: '#00a650',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16
          }}
        >
          Confirmar pago
        </Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() =>
          setModalVisible(false)
        }
      />
    </View>
  );
}
