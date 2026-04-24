import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useAuth } from '@/lib/auth';
import { Redirect } from 'expo-router';
import { Colors } from '@/lib/theme';

const schema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { user, loading } = useAuth();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!loading && user) {
    return <Redirect href="/(admin)/dashboard" />;
  }

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setSubmitting(true);
    try {
      await signIn(data.email, data.password);
    } catch {
      setServerError('Email o contrasena incorrectos.');
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.clubName}>MET HANDBALL CLUB</Text>
        <View style={styles.accentLine} />
        <Text style={styles.subtitle}>Acceso Cuerpo Tecnico</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.email}
              style={styles.input}
              outlineColor="#334d70"
              activeOutlineColor={Colors.accent}
              textColor={Colors.textLight}
              theme={{ colors: { onSurfaceVariant: '#aac4e8' } }}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.fieldError}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Contrasena"
              mode="outlined"
              secureTextEntry
              autoComplete="password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.password}
              style={styles.input}
              outlineColor="#334d70"
              activeOutlineColor={Colors.accent}
              textColor={Colors.textLight}
              theme={{ colors: { onSurfaceVariant: '#aac4e8' } }}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.fieldError}>{errors.password.message}</Text>
        )}

        {serverError !== '' && (
          <Text style={styles.serverError}>{serverError}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          disabled={submitting}
          style={styles.button}
          buttonColor={Colors.secondary}
          textColor={Colors.textLight}
        >
          Ingresar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  clubName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
    letterSpacing: 3,
    textAlign: 'center',
  },
  accentLine: {
    width: 60,
    height: 3,
    backgroundColor: Colors.secondary,
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#0f2847',
  },
  fieldError: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  serverError: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
