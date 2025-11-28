import React, { useEffect, useLayoutEffect, useState } from 'react'; // Agregamos useState
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTaskStore } from '../store/useTaskStore';
import { RootStackParamList } from '../navigation/types';
import { registerForPushNotificationsAsync } from '../services/notificationService';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tasks, toggleTask, deleteTask, fetchTasks, syncPendingTasks, isLoading } = useTaskStore();

  // NUEVO: Estado local para manejar las tareas que están "esperando" desaparecer
  const [tempCompletedIds, setTempCompletedIds] = useState<string[]>([]);

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

  // NUEVO: Función con temporizador para tachar visualmente y borrar después
  const handleDelayedComplete = (id: string | number) => {
    const idString = id.toString();
    
    // 1. Agregamos el ID a la lista temporal (tachado visual instantáneo)
    setTempCompletedIds((prev) => [...prev, idString]);

    // 2. Esperamos 5 segundos
    setTimeout(() => {
      // 3. Ejecutamos el cambio real en la base de datos/store
      toggleTask(id);
      
      // 4. Limpiamos la lista temporal (ya no hace falta porque el filtro de la lista la ocultará)
      setTempCompletedIds((prev) => prev.filter((i) => i !== idString));
    }, 5000);
  };

  const renderItem = ({ item }: { item: any }) => {
    // NUEVO: Lógica para saber si se debe ver tachada (por BD o por estado temporal)
    const isTempCompleted = tempCompletedIds.includes(item.id.toString());
    const isVisuallyCompleted = item.isCompleted || isTempCompleted;

    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={[styles.check, isVisuallyCompleted && styles.checkCompleted]} 
          // NUEVO: Usamos la función con delay en lugar de toggleTask directo
          onPress={() => handleDelayedComplete(item.id)}
          // Deshabilitamos para que no le den click muchas veces mientras espera
          disabled={isVisuallyCompleted}
        />
        
        {/* Al tocar el texto, vamos a Editar */}
        <TouchableOpacity 
          style={{ flex: 1 }} 
          onPress={() => navigation.navigate('CreateTask', { 
            taskId: item.id, 
            currentTitle: item.title 
          })}
        >
          {/* Aplicamos el estilo de tachado si está visualmente completada */}
          <Text style={[styles.title, isVisuallyCompleted && styles.textCompleted]}>
            {item.title}
          </Text>
          {item.needsSync && <Text style={styles.syncText}>⏳ Pendiente de subir</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={styles.delete}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
         Como 'handleDelayedComplete' tarda 5 seg en cambiar 'isCompleted' a true en el store,
         el item se seguirá renderizando esos 5 segundos (pero tachado gracias a nuestra lógica visual).
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