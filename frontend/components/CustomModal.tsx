import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export default function CustomModal({
  visible,
  message,
  onClose
}: Props) {
  const isWeb = Platform.OS === 'web';

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            width: '80%',
            maxWidth: isWeb ? 380 : undefined,
            padding: isWeb ? 22 : 20,
            borderRadius: isWeb ? 12 : 10
          }}
        >
          <Text
            style={{
              fontSize: isWeb ? 15 : 16,
              marginBottom: 15,
              textAlign: 'center'
            }}
          >
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: '#3483fa',
              padding: isWeb ? 11 : 10,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff' }}>
              Aceptar
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
