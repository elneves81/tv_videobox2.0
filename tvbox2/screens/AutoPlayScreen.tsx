import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

// Lista de vídeos educativos para reprodução automática
const AUTO_PLAYLIST = [
  {
    id: 1,
    title: 'Importância da Vacinação Infantil',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Vacinação',
    duration: 120000 // 2 minutos
  },
  {
    id: 2,
    title: 'Prevenção da Dengue - Cuidados Essenciais',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'Prevenção',
    duration: 90000 // 1.5 minutos
  },
  {
    id: 3,
    title: 'Diabetes - Cuidados Diários',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    category: 'Diabetes',
    duration: 150000 // 2.5 minutos
  },
  {
    id: 4,
    title: 'Cuidando da Saúde Mental',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    category: 'Saúde Mental',
    duration: 100000 // 1.7 minutos
  }
];

export default function AutoPlayScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  const currentVideo = AUTO_PLAYLIST[currentIndex];

  // Mostrar tela de boas-vindas por 3 segundos, depois começar vídeos
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  // Avançar para próximo vídeo automaticamente
  const handleVideoEnd = () => {
    const nextIndex = (currentIndex + 1) % AUTO_PLAYLIST.length;
    setCurrentIndex(nextIndex);
  };

  // Tela de boas-vindas
  if (showWelcome) {
    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <Text style={styles.logoText}>🏥</Text>
          <Text style={styles.welcomeTitle}>Bem-vindos à</Text>
          <Text style={styles.ubsName}>UBS Guarapuava</Text>
          <Text style={styles.subtitle}>Informações de Saúde</Text>
          <View style={styles.loadingDots}>
            <Text style={styles.dot}>●</Text>
            <Text style={styles.dot}>●</Text>
            <Text style={styles.dot}>●</Text>
          </View>
          <Text style={styles.startingText}>Iniciando vídeos educativos...</Text>
        </View>
        
        {/* Rodapé com informações importantes */}
        <View style={styles.welcomeFooter}>
          <Text style={styles.footerText}>
            💉 Mantenha sua vacinação em dia • 🛡️ Previna-se contra a dengue
          </Text>
          <Text style={styles.emergencyText}>
            Emergência: SAMU 192 • Bombeiros 193
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com informações do vídeo atual */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.ubsLogo}>🏥 UBS Guarapuava</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.videoTitle}>{currentVideo.title}</Text>
          <Text style={styles.videoCategory}>Categoria: {currentVideo.category}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.videoCounter}>
            {currentIndex + 1} de {AUTO_PLAYLIST.length}
          </Text>
        </View>
      </View>

      {/* Player de vídeo em tela cheia */}
      <View style={styles.videoContainer}>
        {!isLoading && (
          <Video
            source={{ uri: currentVideo.uri }}
            style={styles.video}
            shouldPlay={true} // Reproduzir automaticamente
            isLooping={false}
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                handleVideoEnd();
              }
            }}
            useNativeControls={false} // Sem controles para não confundir usuários
          />
        )}
        
        {isLoading && (
          <View style={styles.loadingVideo}>
            <Text style={styles.loadingText}>Carregando vídeo...</Text>
          </View>
        )}
      </View>

      {/* Barra inferior com próximos vídeos */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Próximos vídeos:</Text>
        <View style={styles.nextVideos}>
          {AUTO_PLAYLIST.slice(currentIndex + 1, currentIndex + 4).map((video, index) => (
            <Text key={video.id} style={styles.nextVideoItem}>
              {index + 2}. {video.title}
            </Text>
          ))}
        </View>
        
        {/* Informações importantes sempre visíveis */}
        <View style={styles.importantInfo}>
          <Text style={styles.emergencyInfo}>
            🚨 Emergência: SAMU 192 • Bombeiros 193
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Tela de boas-vindas
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#1e3c72',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 120,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 36,
    color: 'white',
    marginBottom: 10,
    fontWeight: '300',
  },
  ubsName: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#B8E6B8',
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    fontSize: 24,
    color: 'white',
    marginHorizontal: 5,
    opacity: 0.7,
  },
  startingText: {
    fontSize: 18,
    color: '#B8E6B8',
    fontStyle: 'italic',
  },
  welcomeFooter: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  emergencyText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Tela de reprodução
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 80,
    backgroundColor: '#1e3c72',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  ubsLogo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  videoCategory: {
    color: '#B8E6B8',
    fontSize: 14,
  },
  videoCounter: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height - 160, // Descontar header e footer
  },
  loadingVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  footer: {
    height: 80,
    backgroundColor: '#1e3c72',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nextVideos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  nextVideoItem: {
    color: '#B8E6B8',
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },
  importantInfo: {
    alignItems: 'center',
  },
  emergencyInfo: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
