import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth, signOut } from '@/lib/auth';
import { Colors } from '@/lib/theme';

interface CMSActionProps {
  icon: string;
  label: string;
  onPress: () => void;
}

function CMSAction({ icon, label, onPress }: CMSActionProps) {
  return (
    <Surface style={styles.action} elevation={1}>
      <Button
        mode="text"
        onPress={onPress}
        contentStyle={styles.actionContent}
        labelStyle={styles.actionLabel}
        icon={() => (
          <MaterialCommunityIcons name={icon as any} size={28} color={Colors.primary} />
        )}
      >
        {label}
      </Button>
    </Surface>
  );
}

export default function DashboardScreen() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="titleSmall" style={styles.welcome}>
          Bienvenido, {user?.displayName ?? user?.email}
        </Text>
        <Text variant="labelSmall" style={styles.role}>
          {user?.role?.toUpperCase()}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Contenido
      </Text>

      <View style={styles.grid}>
        <CMSAction
          icon="newspaper-plus"
          label="Noticias"
          onPress={() => router.push('/(admin)/news')}
        />
        <CMSAction
          icon="calendar-plus"
          label="Partidos"
          onPress={() => router.push('/(admin)/matches')}
        />
        <CMSAction
          icon="account-group"
          label="Plantel"
          onPress={() => {}}
        />
      </View>

      <Button
        mode="text"
        onPress={handleSignOut}
        textColor="#999"
        style={styles.signOut}
      >
        Cerrar sesion
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  welcome: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  role: {
    color: Colors.secondary,
    letterSpacing: 1,
    marginTop: 2,
  },
  divider: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  action: {
    width: '47%',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  actionContent: {
    flexDirection: 'column',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: Colors.primary,
    fontSize: 13,
    marginTop: 4,
  },
  signOut: {
    marginTop: 32,
    alignSelf: 'center',
  },
});
