import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

import type { NavigationProp } from '@react-navigation/native';

type HomeProps = {
  navigation: NavigationProp<any>;
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐍 Snake Game</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Snake')}>
        <Text style={styles.buttonText}>Jugar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { fontSize: 36, fontWeight: 'bold', marginBottom: 40, color: '#4CAF50' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});

export default Home;
