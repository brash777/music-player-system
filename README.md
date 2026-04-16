# 🎵 Music Player System

Aplicación full-stack de reproductor de música compuesta por un backend en **Node.js + TypeScript** y un frontend en **React + TypeScript**.

---

## 📋 Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

---

## 🚀 Cómo ejecutar el proyecto

### Backend (puerto 3001)

```bash
# Desde la carpeta raíz del backend
npm install
npm run dev
```

El servidor arrancará en `http://localhost:3001`.  
Nodemon vigilará los cambios y reiniciará automáticamente.

Scripts disponibles:

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con nodemon + ts-node |
| `npm run build` | Compila TypeScript a JavaScript en `/dist` |
| `npm start` | Ejecuta el build compilado con Node |

---

### Frontend (puerto 5173)

```bash
# Desde la carpeta raíz del proyecto
cd music-player-frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5174` (o `5173` si el puerto está libre).

---

## 🔌 Endpoints de la API

Base URL: `http://localhost:3001/api/music`

### Gestión de canciones

| Método | Ruta | Descripción | Body |
|--------|------|-------------|------|
| `POST` | `/song` | Agrega una canción a la playlist | `{ title, artist, duration, position? }` |
| `DELETE` | `/song/:id` | Elimina una canción por ID | — |

### Playlist y estado

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/playlist` | Devuelve todas las canciones en orden de playlist |
| `GET` | `/current` | Devuelve la canción actualmente activa |
| `GET` | `/history` | Devuelve el historial de reproducción (últimas 50) |

### Controles de reproducción

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/play` | Reproduce la canción actual (o la primera si no hay ninguna) |
| `POST` | `/pause` | Pausa la reproducción |
| `POST` | `/stop` | Detiene la reproducción |
| `POST` | `/next` | Avanza a la siguiente canción |
| `POST` | `/previous` | Retrocede a la canción anterior |

### Formato de respuesta

Todas las respuestas siguen el mismo formato:

```json
{ "success": true, "data": { ... } }
```

Los errores devuelven:

```json
{ "success": false, "error": "mensaje", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

## 🔗 Estructura de datos: Lista Doblemente Enlazada

La playlist está implementada internamente como una **lista doblemente enlazada** (`DoublyLinkedList<T>`) ubicada en `src/structures/DoublyLinkedList.ts`.

### ¿Qué es?

Una lista doblemente enlazada es una estructura de datos lineal donde cada nodo contiene:

- `data` — el dato almacenado (en este caso, una `Song`)
- `prev` — puntero al nodo anterior
- `next` — puntero al nodo siguiente

```
null ← [Levitating] ⇄ [Blinding Lights] ⇄ [Bohemian Rhapsody] → null
         ↑ head                                      ↑ tail
```

### ¿Por qué se usa aquí?

| Operación | Complejidad |
|-----------|-------------|
| Insertar al inicio (`addFirst`) | O(1) |
| Insertar al final (`addLast`) | O(1) |
| Navegar al siguiente (`next`) | O(1) |
| Navegar al anterior (`prev`) | O(1) |
| Eliminar por ID (`deleteById`) | O(n) |

La navegación bidireccional en O(1) la hace ideal para un reproductor de música donde el usuario salta entre canciones hacia adelante y hacia atrás constantemente.

### Métodos principales

| Método | Descripción |
|--------|-------------|
| `addFirst(data)` | Inserta al inicio de la lista |
| `addLast(data)` | Inserta al final de la lista |
| `insertAt(data, pos)` | Inserta en una posición específica (0-based) |
| `deleteById(id)` | Elimina el nodo cuyo `data.id` coincide |
| `next()` | Mueve el puntero `current` hacia adelante |
| `prev()` | Mueve el puntero `current` hacia atrás |
| `getCurrent()` | Devuelve el dato del nodo actual sin moverlo |
| `setCurrent(id)` | Posiciona `current` en el nodo con el ID dado |
| `toArray()` | Convierte la lista en un array de head a tail |

---

## 🏛️ Patrón de diseño: Facade

El archivo `src/facade/MusicPlayerFacade.ts` implementa el **patrón Facade**.

### ¿Qué es el patrón Facade?

El patrón Facade proporciona una **interfaz simplificada** a un conjunto de interfaces más complejas de un subsistema. En lugar de que el controlador HTTP interactúe directamente con cuatro servicios distintos, lo hace a través de una única clase que coordina todo internamente.

### Estructura en este proyecto

```
MusicController
      │
      ▼
MusicPlayerFacade          ← punto de entrada único
  ├── SongService          ← gestiona el Map<id, Song>
  ├── PlaylistService      ← gestiona la DoublyLinkedList
  ├── PlayerService        ← gestiona el estado PLAYING/PAUSED/STOPPED
  └── HistoryService       ← gestiona el historial (array, máx. 50)
```

### ¿Por qué se usa aquí?

Sin el Facade, el controlador tendría que:
1. Llamar a `SongService.addSong()`
2. Llamar a `PlaylistService.addSong()`
3. Manejar errores de ambos
4. Coordinar el estado entre los dos

Con el Facade, el controlador solo llama a `musicPlayerFacade.addSong(dto)` y la fachada se encarga de toda la coordinación interna. Esto reduce el acoplamiento y centraliza la lógica de negocio.

### Instancia singleton

```typescript
export const musicPlayerFacade = new MusicPlayerFacade();
```

Se exporta una única instancia compartida para que todos los controladores usen el mismo estado en memoria durante la vida del servidor.

---

## 📁 Estructura del proyecto

```
music-player-backend-app/
├── src/
│   ├── app.ts                        # Entry point, Express setup
│   ├── models/
│   │   └── Song.ts                   # Interfaz Song
│   ├── dtos/
│   │   └── SongDTO.ts                # CreateSongDTO, SongResponseDTO, toSongResponseDTO()
│   ├── structures/
│   │   └── DoublyLinkedList.ts       # Lista doblemente enlazada genérica
│   ├── services/
│   │   ├── SongService.ts            # CRUD de canciones (Map)
│   │   ├── PlaylistService.ts        # Gestión de playlist (DoublyLinkedList)
│   │   ├── PlayerService.ts          # Estado del reproductor
│   │   └── HistoryService.ts         # Historial de reproducción
│   ├── facade/
│   │   └── MusicPlayerFacade.ts      # Facade que coordina los 4 servicios
│   ├── controllers/
│   │   └── MusicController.ts        # Handlers HTTP (static async methods)
│   ├── routes/
│   │   └── musicRoutes.ts            # Express Router
│   └── middlewares/
│       └── errorHandler.ts           # Middleware de errores centralizado
├── package.json
└── tsconfig.json
```
