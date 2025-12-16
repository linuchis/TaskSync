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
    paddingVertical: 20, 
    paddingHorizontal: 20,
    marginHorizontal: 20, 
    marginBottom: 15, 
    borderRadius: 18, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, 
    shadowRadius: 12,
    elevation: 3, 
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  check: {
    width: 28, 
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5, 
    borderColor: '#6a11cb', 
    marginRight: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCompleted: {
    backgroundColor: '#6a11cb',
    borderColor: '#6a11cb',
  },
  title: {
    fontSize: 17,
    fontWeight: '600', 
    color: '#2d3436',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#b2bec3',
  },
  syncText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9800', 
    marginTop: 6,
  },
  delete: {
    fontSize: 22,
    color: '#e74c3c', 
    marginLeft: 15,
    padding: 5, 
  },
});