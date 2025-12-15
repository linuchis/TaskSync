# TaskSync - Gestor de Tareas Móvil

Una aplicación móvil completa para la gestión y sincronización de tareas, desarrollada con **React Native (Expo)** y un backend en **Node.js/Express**. Este proyecto demuestra la integración Cliente-Servidor utilizando TypeScript en todo el stack.

## 🚀 Cómo correr el proyecto

Este repositorio funciona como un monorepo con dos partes principales: `backend` y `Mobile`.

### Prerrequisitos
* Node.js (v14 o superior)
* npm
* Dispositivo móvil con la app **Expo Go** instalada (o un emulador configurado).

## 1. Iniciar el Backend (Servidor)

```bash
cd backend
npm install
npm run dev
``````

> El servidor correrá en `http://localhost:3000` (o tu IP local).

## 2. Iniciar la App Móvil

### 2.1 Instalar Expo en Android

Se puede utilizar la última versión, la que se encuentra en PlayStore.

```bash
cd backend
npm install
npm run dev
``````

El servidor correrá en http://localhost:3000 (o tu IP local).

### 2.2 Iniciar App

Escanea el código QR generado en la terminal con la aplicación Expo Go en tu celular (Android/iOS).

```bash
cd mobile
npx expo start -c
``````


### 2.3 ⚠️ IMPORTANTE: Configuración de Conexión (Evitar Network Error)

Para que la aplicación móvil pueda comunicarse con el backend local, **es obligatorio** actualizar la dirección IP en el código cliente.

1.  Abra una terminal y consulte su IP local:
    * Windows: `ipconfig` (Busque IPv4 Address)
    * Mac/Linux: `ifconfig`
2.  Vaya al archivo: `mobile/src/api/client.ts`
3.  Modifique la variable `BASE_URL`:
    ```typescript
    // Reemplace '192.168.X.X' con SU dirección IP local actual
    const BASE_URL = '[http://192.168.1.50:3000](http://192.168.1.50:3000)'; 
    ```
4.  Asegúrese de que su dispositivo móvil y su PC estén conectados a la misma red Wi-Fi.

> **Nota:** Si recibe un error de conexión, verifique que el Firewall de su sistema operativo permita conexiones entrantes al puerto 3000.

🛠 Decisiones Técnicas
El desarrollo se guio por principios de agilidad y tipado estricto:

TypeScript: Se utilizó tanto en el backend como en el frontend para garantizar la seguridad de tipos, reducir errores en tiempo de ejecución y mejorar la mantenibilidad del código.

Expo (Managed Workflow): Seleccionado para acelerar el ciclo de desarrollo y facilitar las pruebas en dispositivos físicos sin necesidad de compilar binarios nativos complejos (Android Studio/Xcode) en esta etapa.

Persistencia JSON: Para el almacenamiento de datos en el backend, se implementó un sistema de persistencia basado en archivos JSON.

Justificación: Esto permite simular una base de datos y operaciones CRUD completas sin la sobrecarga de configurar una instancia de base de datos externa (SQL/NoSQL) para este prototipo.

Arquitectura Centrada en Pantallas: Dada la naturaleza directa de los flujos de usuario, se optó por construir la UI dentro de las pantallas (screens).

Justificación: Se evitó la creación prematura de micro-componentes genéricos para mantener el código simple y legible, evitando la sobre-ingeniería en una aplicación de este alcance.

### 📂 Arquitectura de Carpetas
El proyecto sigue una estructura modular para escalar fácilmente:

Backend (/src)
Contiene la lógica del servidor Express, rutas y manejo de datos.

Mobile (/src)
Organizado por capas de responsabilidad:

api/: 
navigation/: 
screens/: 
services/: 
store/: 
types/: 
assets/: 
hooks/:
components/:

### 📱 Funcionalidad Nativa
La aplicación hace uso de capacidades nativas del dispositivo a través de las APIs de Expo:

Notifications: Implementación de sistema de notificaciones para alertar al usuario sobre estados críticos o recordatorios de tareas.

StatusBar Management: Control imperativo de la barra de estado del dispositivo para asegurar que la interfaz gráfica sea coherente con el tema de la aplicación (modo oscuro/claro) y mejorar la inmersión.

### 🔮 Posibles Mejoras Futuras
Para una versión 2.0 en producción, se contemplan los siguientes pasos:

Base de Datos Real: Migrar el sistema de archivos JSON a una base de datos relacional (PostgreSQL) o NoSQL (MongoDB) para mayor robustez y concurrencia.

Autenticación de Usuarios: Implementar JWT y login seguro.

Atomización de Componentes: A medida que la UI crezca, extraer elementos repetitivos (botones, tarjetas) a una carpeta components/ dedicada.

CI/CD: Automatizar el despliegue del backend y la publicación de la app en tiendas.

