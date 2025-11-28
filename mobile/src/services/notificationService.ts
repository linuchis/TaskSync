import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Configuración del Handler (Corregido: Se añadieron propiedades faltantes)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Nuevo requisito de TS
    shouldShowList: true,   // Nuevo requisito de TS
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    // Es mejor usar un console.log en desarrollo o manejarlo en UI
    console.log('¡Se necesitan permisos para las notificaciones!');
    return;
  }
}

// 2. Función de agendamiento (Corregido: Trigger explícito)
export async function scheduleTaskNotification(title: string, seconds: number = 5) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Recordatorio de Tarea ⏰",
      body: `No olvides completar: ${title}`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // Importante para TS
      seconds: seconds,
      repeats: false,
    },
  });
}