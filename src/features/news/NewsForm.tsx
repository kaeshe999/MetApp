import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/lib/theme';

const schema = z.object({
  title: z.string().min(3, 'Minimo 3 caracteres'),
  body: z.string().min(10, 'Minimo 10 caracteres'),
});

export type NewsFormData = z.infer<typeof schema>;

export interface NewsFormState {
  coverImageUri: string | null;
  coverImageUrl: string;
  galleryUris: string[];
  galleryUrls: string[];
}

interface Props {
  defaultValues?: Partial<NewsFormData>;
  initialState?: Partial<NewsFormState>;
  submitting: boolean;
  error: string;
  onSubmit: (data: NewsFormData, state: NewsFormState, status: 'draft' | 'published') => void;
  submitLabel?: string;
}

export function NewsForm({ defaultValues, initialState, submitting, error, onSubmit, submitLabel }: Props) {
  const [coverImageUri, setCoverImageUri] = useState<string | null>(initialState?.coverImageUri ?? null);
  const [coverImageUrl] = useState(initialState?.coverImageUrl ?? '');
  const [galleryUris, setGalleryUris] = useState<string[]>(initialState?.galleryUris ?? []);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialState?.galleryUrls ?? []);

  const { control, handleSubmit, formState: { errors } } = useForm<NewsFormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', body: '', ...defaultValues },
  });

  const pickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImageUri(result.assets[0].uri);
  };

  const pickGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setGalleryUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeGalleryUri = (index: number) => {
    setGalleryUris((prev) => prev.filter((_, i) => i !== index));
  };

  const removeGalleryUrl = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const getState = (): NewsFormState => ({
    coverImageUri,
    coverImageUrl,
    galleryUris,
    galleryUrls,
  });

  const coverPreview = coverImageUri || coverImageUrl || null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Foto portada */}
        <Text style={styles.label}>Foto de portada</Text>
        <TouchableOpacity onPress={pickCover} style={styles.coverPicker}>
          {coverPreview ? (
            <Image source={{ uri: coverPreview }} style={styles.coverPreview} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder}>
              <MaterialCommunityIcons name="image-plus" size={36} color={Colors.accent} />
              <Text style={styles.placeholderText}>Toca para agregar foto de portada</Text>
            </View>
          )}
        </TouchableOpacity>
        {coverPreview && (
          <Button
            mode="text"
            textColor={Colors.secondary}
            onPress={pickCover}
            style={styles.changePhoto}
          >
            Cambiar foto de portada
          </Button>
        )}

        {/* Titulo */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Titulo"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.title}
              style={styles.input}
            />
          )}
        />
        {errors.title && <Text style={styles.fieldError}>{errors.title.message}</Text>}

        {/* Cuerpo */}
        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Contenido"
              mode="outlined"
              multiline
              numberOfLines={8}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.body}
              style={[styles.input, styles.bodyInput]}
            />
          )}
        />
        {errors.body && <Text style={styles.fieldError}>{errors.body.message}</Text>}

        {/* Galeria */}
        <Text style={styles.label}>Fotos de galeria (opcional)</Text>
        <View style={styles.gallery}>
          {/* URLs existentes */}
          {galleryUrls.map((url, i) => (
            <View key={`url-${i}`} style={styles.thumb}>
              <Image source={{ uri: url }} style={styles.thumbImage} resizeMode="cover" />
              <TouchableOpacity style={styles.thumbRemove} onPress={() => removeGalleryUrl(i)}>
                <MaterialCommunityIcons name="close-circle" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          ))}
          {/* URIs nuevas */}
          {galleryUris.map((uri, i) => (
            <View key={`uri-${i}`} style={styles.thumb}>
              <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
              <TouchableOpacity style={styles.thumbRemove} onPress={() => removeGalleryUri(i)}>
                <MaterialCommunityIcons name="close-circle" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          ))}
          {/* Boton agregar */}
          <TouchableOpacity style={styles.addThumb} onPress={pickGallery}>
            <MaterialCommunityIcons name="plus" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {error !== '' && <Text style={styles.serverError}>{error}</Text>}

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleSubmit((data) => onSubmit(data, getState(), 'draft'))}
            disabled={submitting}
            style={styles.draftButton}
          >
            Borrador
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit((data) => onSubmit(data, getState(), 'published'))}
            loading={submitting}
            disabled={submitting}
            buttonColor={Colors.secondary}
            style={styles.publishButton}
          >
            {submitLabel ?? 'Publicar'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13, color: '#666', marginBottom: 8, marginTop: 4 },
  coverPicker: { marginBottom: 8, borderRadius: 8, overflow: 'hidden' },
  coverPreview: { width: '100%', height: 200 },
  coverPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  placeholderText: { color: Colors.textLight, fontSize: 13 },
  changePhoto: { alignSelf: 'flex-start', marginBottom: 8 },
  input: { marginBottom: 4, backgroundColor: '#fff', marginTop: 8 },
  bodyInput: { minHeight: 160 },
  fieldError: { color: Colors.secondary, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  thumb: { width: 90, height: 90, borderRadius: 6, overflow: 'visible' },
  thumbImage: { width: 90, height: 90, borderRadius: 6 },
  thumbRemove: { position: 'absolute', top: -8, right: -8, backgroundColor: '#fff', borderRadius: 10 },
  addThumb: {
    width: 90,
    height: 90,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  serverError: { color: Colors.secondary, textAlign: 'center', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  draftButton: { flex: 1 },
  publishButton: { flex: 1 },
});
