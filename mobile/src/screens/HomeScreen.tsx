import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTaskStore } from '../store/useTaskStore';
import { RootStackParamList } from '../navigation/types';
//  ESTE ES EL HOOK 
import { useDelayedAction } from '../hooks/useDelayedAction';
import { TaskItem } from '../components/TaskItem';


import { registerForPushNotificationsAsync } from '../services/notificationService';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tasks, toggleTask, deleteTask, fetchTasks, syncPendingTasks, isLoading } = useTaskStore();

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
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text>Cargando...</Text>
        </View>
      )}

      {/* NOTA IMPORTANTE: 
          Mantenemos el filtro !t.isCompleted. 
          Como el hook tarda 5 seg en ejecutar toggleTask (que cambia isCompleted a true en el store),
          el item se seguirá renderizando esos 5 segundos (pero tachado gracias a isPending).
          Una vez pasen los 5 seg, toggleTask corre, isCompleted se vuelve true, y este filtro lo saca.
      */}
      {!isLoading && tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes tareas pendientes.</Text>
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
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  loader: { padding: 20, alignItems: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6200ee',
    marginRight: 15,
  },
  checkCompleted: { backgroundColor: '#6200ee' },
  title: { fontSize: 16, color: '#333' },
  textCompleted: { textDecorationLine: 'line-through', color: '#888' },
  syncText: { fontSize: 10, color: 'orange', marginTop: 4 },
  delete: { fontSize: 20, color: 'red', marginLeft: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: 'white', fontSize: 30, marginTop: -2 },
});