import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  foto: string;
  onCamera: () => void;
  onGallery: () => void;
};

// Foto de perfil con dos opciones.
// La camara sirve en celular y tambien puede abrir selector compatible en web.
export function ProfilePhotoPicker({
  foto,
  onCamera,
  onGallery
}: Props) {
  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%'
      }}
    >
      <Image
        source={{
          uri:
            foto ||
            'https://picsum.photos/200'
        }}
        style={{
          width: 124,
          height: 124,
          borderRadius: 62,
          backgroundColor: '#ddd',
          borderWidth: 3,
          borderColor: '#eef2f7'
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          marginTop: 12
        }}
      >
        <TouchableOpacity
          onPress={onCamera}
          style={{
            backgroundColor: '#111827',
            paddingVertical: 9,
            paddingHorizontal: 14,
            borderRadius: 8
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            Sacar foto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onGallery}
          style={{
            backgroundColor: '#3483fa',
            paddingVertical: 9,
            paddingHorizontal: 14,
            borderRadius: 8
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            Galeria
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          textAlign: 'center',
          marginTop: 8,
          color: '#777',
          fontSize: 12
        }}
      >
        Luego toca Guardar cambios
      </Text>
    </View>
  );
}
