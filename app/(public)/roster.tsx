import { View, Text, StyleSheet } from 'react-native';

export default function RosterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Plantel — proximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder: { fontSize: 16, color: '#666' },
});
