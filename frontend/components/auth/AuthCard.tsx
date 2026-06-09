import { View, Text, Platform } from 'react-native';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

// Tarjeta reutilizable para login y registro.
// En web limita el ancho para que los botones no ocupen toda la pantalla.
export function AuthCard({
  title,
  subtitle,
  children
}: Props) {
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{
        width: '100%',
        maxWidth: isWeb ? 430 : undefined,
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: isWeb ? 26 : 20,
        borderRadius: 14,
        borderWidth: isWeb ? 1 : 0,
        borderColor: '#e8e8e8',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4
        },
        shadowOpacity: isWeb ? 0.08 : 0.06,
        shadowRadius: 10,
        elevation: 3
      }}
    >
      <Text
        style={{
          fontSize: isWeb ? 28 : 24,
          fontWeight: 'bold',
          color: '#111',
          textAlign: 'center',
          marginBottom: subtitle ? 6 : 20
        }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={{
            color: '#777',
            textAlign: 'center',
            marginBottom: 20
          }}
        >
          {subtitle}
        </Text>
      )}

      {children}
    </View>
  );
}
