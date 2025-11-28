import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTaskStore } from '../store/useTaskStore';
import { scheduleTaskNotification } from '../services/notificationService';

// Definimos qué parámetros puede recibir esta pantalla
type ParamList = {
  CreateTask: { taskId?: string; currentTitle?: string };
};

export const CreateTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'CreateTask'>>();
  const { addTask, updateTaskTitle } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const isEditing = !!route.params?.taskId; // ¿Estamos editando?

  useEffect(() => {
    if (route.params?.currentTitle) {
      setTitle(route.params.currentTitle);
    }
  }, [route.params]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título no puede estar vacío');
      return;
    }

    if (isEditing && route.params?.taskId) {
      // Lógica de EDITAR
      updateTaskTitle(route.params.taskId, title);
      Alert.alert('¡Actualizado!', 'La tarea ha sido modificada.');
    } else {
      // Lógica de CREAR (la que ya tenías)
      addTask(title);
      await scheduleTaskNotification(title, 5);
      Alert.alert('¡Listo!', 'Tarea guardada. Te avisaremos en 5 segundos.');
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ej: Comprar leche"
        value={title}
        onChangeText={setTitle}
      />
      
      <TouchableOpacity 
        style={[styles.button, isEditing && styles.buttonEdit]} 
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  label: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', color: '#333' },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: '#009688', // Color diferente para editar
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});