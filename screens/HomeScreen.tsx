import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MenuButton } from '../components/MenuButton';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LetVision</Text>
      <MenuButton title="Deteksi Pertumbuhan" onPress={() => navigation.navigate('GrowthUp')} />
      <MenuButton title="Deteksi Penyakit" onPress={() => navigation.navigate('Disease')} />
      <MenuButton title="Riwayat Deteksi" onPress={() => navigation.navigate('History')} />
      <MenuButton title="Artikel" onPress={() => navigation.navigate('Artikel')} />
      {/* Fitur lain bisa ditambahkan di sini */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
});
