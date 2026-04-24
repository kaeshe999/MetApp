# MetApp — Met Handball Club

Aplicación móvil multiplataforma (iOS + Android) para Met Handball Club, Santiago, Chile. Centraliza la difusión pública del club y entrega un CMS móvil al cuerpo técnico.

## Stack

- **React Native** con Expo SDK 54 (managed workflow)
- **expo-router** — navegación file-based
- **Firebase** — Auth + Firestore + Storage
- **react-native-paper** — UI (Material Design 3)
- **react-hook-form + zod** — formularios y validación
- **date-fns** — fechas en español

## Estructura

```
/app
  /(public)         # Portal público (sin login)
    index.tsx       # Muro de noticias
    matches.tsx     # Calendario y resultados
    roster.tsx      # Plantel
    news/[id].tsx   # Detalle de noticia
  /(admin)          # CMS (requiere login)
    dashboard.tsx
    news/           # Listar, crear, editar noticias
    matches/        # Listar, crear, actualizar partidos
  login.tsx
/src
  /lib
    firebase.ts     # Init Firebase
    auth.ts         # AuthProvider + useAuth + signIn/signOut
    theme.ts        # Colores y tema del club
  /features
    /news           # Hook, card, formulario, acciones
    /matches        # Hook, card, acciones
  /types            # Tipos compartidos (Match, News, Player, etc.)
/scripts
  seed.mjs          # Poblar Firestore con datos de prueba
```

## Variables de entorno

Copia `.env.example` a `.env` y completa con los valores de tu proyecto Firebase:

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

## Instalación

```bash
npm install
npx expo start
```

## Datos de prueba

Para poblar Firestore con club, temporada, partidos y jugadores de prueba:

```bash
# Agrega SEED_EMAIL y SEED_PASSWORD al .env primero
node scripts/seed.mjs
```

## Reglas de seguridad

Los archivos `firestore.rules` y `storage.rules` contienen las reglas de seguridad. Deben publicarse manualmente en Firebase Console.

- **Firestore:** Console → Firestore → Rules
- **Storage:** Console → Storage → Rules

## Roles

| Rol | Permisos |
|-----|----------|
| Público | Lee noticias, partidos, plantel |
| Editor | + Crea/edita noticias y partidos |
| Admin | + Gestiona usuarios y temporadas |

## Distribución

Durante el desarrollo se usa Expo Go. Para distribución interna:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile preview --platform android
```
