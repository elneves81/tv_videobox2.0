import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface MediaItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  items: MediaItem[];
}

// Dados específicos para Postos de Saúde de Guarapuava
const HEALTH_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Campanhas de Saúde',
    items: [
      {
        id: '1',
        title: 'Campanha de Vacinação 2025',
        thumbnail: 'https://via.placeholder.com/300x169/00a86b/ffffff?text=Vacinação',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '2min 30s',
        category: 'Prevenção'
      },
      {
        id: '2',
        title: 'Prevenção da Dengue',
        thumbnail: 'https://via.placeholder.com/300x169/ff6b6b/ffffff?text=Dengue',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '3min 15s',
        category: 'Prevenção'
      },
      {
        id: '3',
        title: 'Cuidados com Diabetes',
        thumbnail: 'https://via.placeholder.com/300x169/4ecdc4/ffffff?text=Diabetes',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '4min 20s',
        category: 'Educação'
      },
    ]
  },
  {
    id: '2',
    name: 'Orientações da UBS',
    items: [
      {
        id: '4',
        title: 'Como Agendar Consulta',
        thumbnail: 'https://via.placeholder.com/300x169/45b7d1/ffffff?text=Agendamento',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: '2min',
        category: 'Orientação'
      },
      {
        id: '5',
        title: 'Horários de Funcionamento',
        thumbnail: 'https://via.placeholder.com/300x169/f9ca24/ffffff?text=Horários',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: '1min 30s',
        category: 'Informação'
      },
      {
        id: '6',
        title: 'Serviços Disponíveis',
        thumbnail: 'https://via.placeholder.com/300x169/a55eea/ffffff?text=Serviços',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        duration: '3min',
        category: 'Informação'
      },
    ]
  },
  {
    id: '3',
    name: 'Saúde e Bem-estar',
    items: [
      {
        id: '7',
        title: 'Alimentação Saudável',
        thumbnail: 'https://via.placeholder.com/300x169/6c5ce7/ffffff?text=Alimentação',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        duration: '5min',
        category: 'Educação'
      },
      {
        id: '8',
        title: 'Exercícios em Casa',
        thumbnail: 'https://via.placeholder.com/300x169/ff9ff3/ffffff?text=Exercícios',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        duration: '4min 15s',
        category: 'Bem-estar'
      },
      {
        id: '9',
        title: 'Cuidados com Idosos',
        thumbnail: 'https://via.placeholder.com/300x169/54a0ff/ffffff?text=Idosos',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        duration: '6min',
        category: 'Cuidados'
      },
    ]
  }
];

export default function HomeScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const categoryRefs = useRef<any[]>([]);
  const itemRefs = useRef<any[]>([]);

  // Navegação por controle remoto
  useEffect(() => {
    const handleBackPress = () => {
      BackHandler.exitApp();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => subscription.remove();
  }, []);

  const handlePlayMedia = (item: MediaItem) => {
    navigation.navigate('Player', { item });
  };

  const renderMediaItem = ({ item, index }: { item: MediaItem; index: number }) => (
    <TouchableOpacity
      ref={(ref) => { itemRefs.current[index] = ref; }}
      style={[
        styles.mediaItem,
        selectedItem === index && styles.selectedItem
      ]}
      onPress={() => handlePlayMedia(item)}
      onFocus={() => setSelectedItem(index)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.mediaInfo}>
          <Text style={styles.mediaTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.mediaDuration}>{item.duration}</Text>
          <Text style={styles.mediaCategory}>{item.category}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategory = ({ item, index }: { item: Category; index: number }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        ref={(ref) => { categoryRefs.current[index] = ref; }}
        style={[
          styles.categoryHeader,
          selectedCategory === index && styles.selectedCategoryHeader
        ]}
        onPress={() => setSelectedCategory(index)}
        onFocus={() => setSelectedCategory(index)}
      >
        <Text style={[
          styles.categoryTitle,
          selectedCategory === index && styles.selectedCategoryTitle
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
      
      {selectedCategory === index && (
        <FlatList
          data={item.items}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaList}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
          <Text style={styles.appTitle}>🏥 UBS Guarapuava</Text>
          <Text style={styles.subtitle}>Sistema de Informação em Saúde</Text>
        </View>

        {/* Conteúdo Principal */}
        <FlatList
          data={HEALTH_CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Footer com informações da unidade */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            📍 Secretaria Municipal de Saúde - Guarapuava/PR | 📞 Emergência: 192
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 40,
  },
  header: {
    paddingVertical: 30,
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
    top: 30,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#cccccc',
    marginTop: 8,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 40,
  },
  categoryHeader: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedCategoryHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#cccccc',
  },
  selectedCategoryTitle: {
    color: '#ffffff',
  },
  mediaList: {
    paddingLeft: 20,
  },
  mediaItem: {
    width: 300,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#00d4ff',
    transform: [{ scale: 1.05 }],
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  mediaInfo: {
    padding: 15,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  mediaDuration: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 2,
  },
  mediaCategory: {
    fontSize: 12,
    color: '#00d4ff',
    textTransform: 'uppercase',
  },
  itemSeparator: {
    width: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
});
