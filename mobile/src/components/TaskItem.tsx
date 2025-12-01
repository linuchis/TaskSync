import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  isPending: boolean; // ¿Está esperando los 5 seg?
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void; // Para editar
}

export const TaskItem = ({ task, isPending, onToggle, onDelete, onPress }: TaskItemProps) => {
  // Calculamos si se ve completada (ya sea real o temporalmente)
  const isVisuallyCompleted = task.isCompleted || isPending;

  return (
    <View style={styles.card}>
      {/* Botón del Check */}
      <TouchableOpacity 
        style={[styles.check, isVisuallyCompleted && styles.checkCompleted]} 
        onPress={onToggle}
        disabled={isVisuallyCompleted} // Evita doble click
      />
      
      {/* Cuerpo de la Tarea (Título) */}
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <Text style={[styles.title, isVisuallyCompleted && styles.textCompleted]}>
          {task.title}
        </Text>
        {task.needsSync && <Text style={styles.syncText}>⏳ Pendiente de subir</Text>}
      </TouchableOpacity>

      {/* Botón Eliminar */}
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
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
});