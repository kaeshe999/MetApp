# CLAUDE.md — App de Difusión Club de Balonmano

Este archivo le da contexto a Claude (y a cualquier asistente IA) sobre el proyecto para que las respuestas sean directas, ejecutables y consistentes con las decisiones técnicas ya tomadas.

---

## 1. Contexto del Proyecto

**Qué es:** Aplicación móvil multiplataforma (iOS + Android) para un club de balonmano. Centraliza la difusión pública (noticias, partidos, resultados, nóminas) y entrega un CMS móvil al cuerpo técnico para publicar contenido sin depender del administrador.

**Para quién:**
- **Hinchada / público general** — entra sin login, consume contenido.
- **Entrenadores** — login con permisos de editor, publican desde el celular.
- **Administrador** — control total: usuarios, temporadas, moderación.

**Stack definido:**
- **Frontend:** React Native (con Expo, ver sección 4).
- **Backend / DB / Auth / Storage:** Firebase (Auth + Firestore + Storage).
- **Distribución MVP:** PWA o build de desarrollo vía Expo Go; tiendas (Play / App Store) en una segunda etapa.

**Restricción importante:** desarrollador único, experiencia limitada con React Native y Firebase. Por eso priorizamos: librerías estándar, configuración mínima, ejemplos completos y copiables, y evitar abstracciones prematuras.

---

## 2. Alcance del MVP

El MVP es **portal público completo + CMS básico**. Cualquier feature fuera de esta lista es Fase 2 y no debe implementarse aún:

**MVP — sí va:**
1. Muro de noticias (lectura pública + creación desde CMS con foto).
2. Calendario / fixture de partidos (lectura pública + alta/edición desde CMS).
3. Resultados y tabla de posiciones (admin/editor actualiza marcador, público lo ve en tiempo real).
4. Plantel y nóminas de convocados por partido.
5. Login para editores y admin (público no requiere login).
6. Dashboard CMS móvil con: crear noticia, actualizar partido, publicar nómina.

**Fase 2 — NO va aún:**
- Portal del jugador, asistencia a entrenamientos, estadísticas individuales, pizarra táctica, finanzas/cuotas, push notifications, chat interno.

Si una propuesta empieza a tocar Fase 2, Claude debe avisarlo y preguntar antes de seguir.

---

## 3. Modelo de Datos (Firestore)

Estructura inicial. Mantener simple, denormalizar cuando ayude a leer rápido sin múltiples queries.

```
clubs/{clubId}
  ├─ name, logoUrl, primaryColor, createdAt

clubs/{clubId}/seasons/{seasonId}
  ├─ name (ej. "2026"), league, isActive

clubs/{clubId}/players/{playerId}
  ├─ firstName, lastName, jerseyNumber, position, photoUrl, active

clubs/{clubId}/matches/{matchId}
  ├─ seasonId, opponent, date (Timestamp), venue, venueMapsUrl
  ├─ category (ej. "Adulto Masculino", "Cadete"), homeAway
  ├─ status: "scheduled" | "live" | "finished" | "cancelled"
  ├─ scoreHome, scoreAway
  ├─ rosterPlayerIds: [playerId, ...]   ← nómina convocada
  ├─ updatedAt, updatedBy

clubs/{clubId}/news/{newsId}
  ├─ title, body, coverImageUrl, gallery: [url, ...]
  ├─ publishedAt, authorId, status: "draft" | "published"

clubs/{clubId}/standings/{seasonId}
  ├─ table: [{ team, played, won, drawn, lost, goalsFor, goalsAgainst, points }]
  ├─ updatedAt

users/{userId}
  ├─ email, displayName, role: "admin" | "editor", clubId, active
```

**Reglas:**
- IDs de Firestore autogenerados salvo `clubId` y `seasonId` que pueden ser slugs legibles.
- Fechas siempre como `Timestamp` de Firestore (no strings).
- URLs de imágenes apuntan a Firebase Storage en rutas: `clubs/{clubId}/news/{newsId}/{filename}` y similar.

---

## 4. Stack Técnico — Decisiones Concretas

**React Native con Expo (managed workflow).**
Razón: setup mínimo, OTA updates, no hay que tocar Xcode/Android Studio en el día a día. Si algo requiere salir de Expo, avisar antes de proponerlo.

**Versiones objetivo:**
- Expo SDK estable más reciente
- React Native acorde al SDK de Expo
- Node 20 LTS

**Librerías base — usar estas, no proponer alternativas sin razón:**
- `expo-router` para navegación (file-based routing).
- `firebase` (SDK web v9+ modular). Funciona con Expo managed sin problemas para Auth, Firestore, Storage.
- `react-native-paper` o `tamagui` para UI. **Por defecto: react-native-paper** (más simple, Material Design, menos curva).
- `react-hook-form` + `zod` para formularios y validación del CMS.
- `expo-image-picker` para subir fotos desde galería/cámara.
- `date-fns` para fechas (configurar locale `es`).
- `@tanstack/react-query` **solo si** la complejidad de cache lo justifica; al inicio basta con hooks de Firestore directos (`onSnapshot`).

**Estructura de carpetas:**
```
/app                    # Rutas (expo-router)
  /(public)             # Portal público sin login
    index.tsx           # Muro de noticias
    matches.tsx
    standings.tsx
    roster.tsx
  /(admin)              # Requiere login
    _layout.tsx         # Guard de auth
    dashboard.tsx
    news/...
    matches/...
  login.tsx
/src
  /lib
    firebase.ts         # init de Firebase
    auth.ts
  /features
    /news               # componentes + hooks + tipos por feature
    /matches
    /standings
    /roster
  /components           # UI reutilizable (Card, EmptyState, etc.)
  /types                # tipos compartidos
/assets
```

---

## 5. Convenciones de Código

- **TypeScript estricto.** `strict: true` en tsconfig. Nada de `any` sin comentario justificando.
- **Componentes funcionales** con hooks. No clases.
- **Naming:** componentes en `PascalCase`, hooks `useAlgo`, archivos de componentes en `PascalCase.tsx`, utilitarios en `camelCase.ts`.
- **Idioma:** código y commits en inglés; UI y textos visibles al usuario en español de Chile.
- **Imports absolutos** desde `@/` apuntando a `/src` y `/app`. Configurar en `tsconfig.json` y `babel.config.js`.
- **Estado global:** evitar Redux/Zustand al inicio. Auth y club activo en Context simple.
- **Errores:** todo acceso a Firestore va envuelto en try/catch con un fallback visible (toast o EmptyState con mensaje).

---

## 6. Reglas para Claude al Asistir

Estas son instrucciones de cómo quiero las respuestas. Aplicar siempre:

1. **Respuestas directas y ejecutables.** Código completo y copiable, no pseudocódigo. Si un archivo es nuevo, indicar la ruta exacta donde va.
2. **Sin sobre-explicación.** Asumir que entiendo lo básico de JS/React. Explicar solo lo específico de RN/Firebase/Expo o decisiones no obvias.
3. **Una cosa a la vez.** Si pido "agregar pantalla de login", no devolver además el flujo de recuperar contraseña salvo que lo pida.
4. **Avisar antes de salir del stack.** Si la mejor solución requiere salir de Expo managed, agregar una librería pesada, o tocar código nativo, decirlo explícitamente y pedir confirmación.
5. **Coherencia con el modelo de datos de la sección 3.** Si una feature necesita un campo nuevo, proponerlo como cambio explícito al esquema, no inventarlo en silencio.
6. **Coherencia con el alcance del MVP (sección 2).** Si la pregunta empuja a Fase 2, marcarlo y preguntar.
7. **Reglas de Firestore.** Cualquier feature nueva debe venir con su update a `firestore.rules`. No dejar la base abierta.
8. **Sin emojis** en código ni en respuestas, salvo que yo los use primero.
9. **Comandos listos para pegar** en terminal. Asumir macOS/Linux salvo que diga lo contrario.
10. **Cuando edites un archivo existente,** mostrar solo el diff o la sección que cambia, no reimprimir el archivo completo.

---

## 7. Roadmap Sugerido (orden de trabajo)

Para que el desarrollo sea utilizable a la brevedad, este es el orden propuesto. Cada paso debe quedar funcional antes de pasar al siguiente.

1. **Setup base** — proyecto Expo + TS + expo-router + Firebase init + tsconfig paths.
2. **Auth** — login con email/password para admin y editores. Guard del grupo `(admin)`.
3. **Reglas de Firestore mínimas** — público lee `news/matches/standings/players`; solo `admin`/`editor` escriben.
4. **Modelo + seeds** — crear un script o pantalla de admin para insertar un club, una temporada y 2-3 jugadores de prueba.
5. **Muro de noticias (lectura pública)** — listar `news` ordenadas por `publishedAt`.
6. **CMS de noticias** — crear / editar / publicar noticia con imagen (upload a Storage).
7. **Calendario y partidos (lectura)** — lista de partidos próximos y pasados.
8. **CMS de partidos** — alta de partido, cambio de estado, ingreso de marcador.
9. **Plantel y nóminas** — fichas de jugadores + selector de convocados por partido.
10. **Tabla de posiciones** — vista pública + edición manual desde admin.
11. **Pulido UI** — colores del club, logo, estados vacíos, loading, errores.
12. **Distribución** — primero Expo Go para mostrar al club; luego build interno.

---

## 8. Comandos Frecuentes

```bash
# Levantar el proyecto
npx expo start

# Limpiar cache cuando algo se pone raro
npx expo start -c

# Type check
npx tsc --noEmit

# Build de prueba (requiere cuenta Expo)
eas build --profile preview --platform android
```

---

## 9. Variables de Entorno

Usar `app.config.ts` con `extra` para exponer la config de Firebase. Nunca commitear claves privadas. Crear `.env` local y `.env.example` versionado.

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Las variables con prefijo `EXPO_PUBLIC_` son accesibles desde el código del cliente. Las claves de Firebase Web son seguras de exponer porque la seguridad real vive en las **Firestore Rules** y **Storage Rules** (sección 6, punto 7).

---

## 10. Glosario rápido

- **Fixture:** calendario de partidos de una liga/temporada.
- **Nómina / Convocatoria:** lista oficial de jugadores citados a un partido.
- **Plantel / Roster:** lista completa de jugadores del club en la temporada.
- **CMS:** Content Management System, en este caso el dashboard móvil para entrenadores.