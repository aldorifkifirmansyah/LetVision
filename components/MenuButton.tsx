import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type MenuButtonProps = {
  title: string;
  onPress: () => void;
};

export const MenuButton: React.FC<MenuButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});