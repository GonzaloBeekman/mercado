# Deploy del frontend

## Backend usado

El frontend apunta al backend publico:

```txt
https://gestionproducto.alwaysdata.net
```

En local se carga desde `.env.local` con:

```env
EXPO_PUBLIC_API_URL=https://gestionproducto.alwaysdata.net
```

## Web en Vercel

1. Crear un proyecto en Vercel usando la carpeta `frontend`.
2. Build command:

```txt
npm run build:web
```

3. Output directory:

```txt
dist
```

4. Variables de entorno en Vercel:

```env
EXPO_PUBLIC_API_URL=https://gestionproducto.alwaysdata.net
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=9657592674-oa8e00oe999o2754t9jtuo2tpqp1t9sc.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=9657592674-ag5s5gch599jakh64l7omsueqd6b6bsh.apps.googleusercontent.com
```

5. Cuando Vercel entregue una URL, agregarla en Google Cloud como origen autorizado del OAuth Web.

## APK Android con EAS

1. Iniciar sesion en Expo:

```txt
npx eas login
```

2. Crear APK de prueba:

```txt
npx eas build -p android --profile preview
```

3. Instalar la APK en el celular desde el link que entrega Expo.

4. Para que Google funcione en Android, el Client ID Android debe tener:

```txt
Package name: com.srgjb.frontend
SHA-1: el SHA-1 de la firma usada por EAS
```

5. Si Google sigue bloqueando el acceso, revisar que el `androidClientId` coincida con el Client ID creado para ese package y ese SHA-1.
