import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/lib/theme';

function LoginButton() {
  return (
    <TouchableOpacity onPress={() => router.push('/login')} style={{ marginRight: 16 }}>
      <MaterialCommunityIcons name="account-circle-outline" size={26} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

export default function PublicLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.primary },
        headerTitleStyle: { color: Colors.textLight, fontWeight: 'bold', letterSpacing: 1 },
        headerRight: () => <LoginButton />,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { borderTopColor: '#eee' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Noticias',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Partidos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="roster"
        options={{
          title: 'Plantel',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="standings" options={{ href: null }} />
      <Tabs.Screen name="news/[id]" options={{ href: null }} />
    </Tabs>
  );
}
