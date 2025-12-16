import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTaskStore } from '../store/useTaskStore';
import { RootStackParamList } from '../navigation/types';
//  ESTE ES EL HOOK 
import { useDelayedAction } from '../hooks/useDelayedAction';
import { TaskItem } from '../components/TaskItem';
import { LinearGradient } from 'expo-linear-gradient';


import { registerForPushNotificationsAsync } from '../services/notificationService';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tasks, toggleTask, deleteTask, fetchTasks, syncPendingTasks, isLoading, error } = useTaskStore();

  // 2. USAMOS EL HOOK AQUÍ (Reemplaza al useState y la función vieja handleDelayedComplete)
  // "Cuando active el trigger, espera 5 seg y luego ejecuta toggleTask"
  const { trigger: markCompletedLater, isPending } = useDelayedAction(toggleTask, 5000);

  // 1. Cargar tareas al abrir la app
  useEffect(() => {
    // registerForPushNotificationsAsync(); // Descomentar si usas build de desarrollo
    fetchTasks();
  }, []);

  // 2. Botón de Sincronizar en la barra superior (Header)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSync} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 24 }}>🔄</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSync = async () => {
    Alert.alert('Sincronizando...', 'Subiendo tareas pendientes y actualizando lista.');
    await syncPendingTasks();
    Alert.alert('¡Listo!', 'Tus tareas están al día.');
  };

  const renderItem = ({ item }: { item: any }) => (
  <TaskItem
    task={item}
    isPending={isPending(item.id)} // Usamos tu hook aquí
    onToggle={() => markCompletedLater(item.id)} // Usamos tu hook aquí
    onDelete={() => deleteTask(item.id)}
    onPress={() => navigation.navigate('CreateTask', { 
      taskId: item.id, 
      currentTitle: item.title 
    })}
  />
);

  return (
    // Cambiamos el View principal por un fondo gris muy clarito para contraste
    <View style={[styles.container, { backgroundColor: '#F5F7FA' }]}>
      
      <LinearGradient
        // Puedes jugar con estos colores: morado a azul
        colors={['#c42c73ff', '#b72fdaff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mis Tareas 📝</Text>
      </LinearGradient>

      {/* El resto de tu lógica (Loading/Error) sigue aquí... */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#6a11cb" style={styles.center} />
      ) : error ? (
        <Text style={[styles.errorText, styles.center]}>{error}</Text>
      ) : tasks.filter(t => !t.isCompleted).length === 0 ? (
        
        <View style={styles.emptyContainer}>
          {/* Un emoji gigante ayuda mucho */}
          <Text style={{ fontSize: 60, marginBottom: 20 }}>🎉</Text> 
          <Text style={styles.emptyTextTitle}>¡Todo listo por hoy!</Text>
          <Text style={styles.emptyTextSubtitle}>No tienes tareas pendientes. Disfruta tu día.</Text>
        </View>

      ) : (
          <FlatList
          data={tasks.filter(t => !t.isCompleted)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshing={isLoading} 
          onRefresh={fetchTasks} 
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateTask')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Quitamos el padding del contenedor principal para que el header toque los bordes
  },
  header: {
    // El header ahora tiene padding interno y bordes redondeados abajo
    paddingTop: 60, // Espacio para la barra de estado
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 5, // Sombra en Android
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800', // Letra más gordita
    color: 'white', // Texto blanco sobre el degradado
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTextTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyTextSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#6a11cb', // Morado a juego con el tema
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  errorText: { 
    color: 'red', 
    fontSize: 16,
    textAlign: 'center'
  }, // (Tu estilo de error)
  fabText: { color: 'white', fontSize: 30, marginTop: -2 },
});