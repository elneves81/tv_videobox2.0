import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface MediaItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  category: string;
}

// Playlist para modo automático
const AUTO_PLAYLIST: MediaItem[] = [
  {
    id: '1',
    title: 'Campanha de Vacinação 2025',
    thumbnail: '',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '2min 30s',
    category: 'Prevenção'
  },
  {
    id: '2',
    title: 'Prevenção da Dengue',
    thumbnail: '',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '3min 15s',
    category: 'Prevenção'
  },
  {
    id: '3',
    title: 'Como Agendar Consulta',
    thumbnail: '',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '2min',
    category: 'Orientação'
  },
  {
    id: '4',
    title: 'Alimentação Saudável',
    thumbnail: '',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '5min',
    category: 'Educação'
  },
];

export default function KioskModeScreen() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(AUTO_PLAYLIST[0]);
  const [showInfo, setShowInfo] = useState(true);

  // Avançar para próximo vídeo automaticamente
  useEffect(() => {
    const currentItem = AUTO_PLAYLIST[currentVideoIndex];
    setCurrentVideo(currentItem);
  }, [currentVideoIndex]);

  // Mostrar informações do vídeo por alguns segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfo(false);
    }, 5000); // Mostrar por 5 segundos

    return () => clearTimeout(timer);
  }, [currentVideo]);

  const handleVideoEnd = () => {
    // Próximo vídeo na playlist
    const nextIndex = (currentVideoIndex + 1) % AUTO_PLAYLIST.length;
    setCurrentVideoIndex(nextIndex);
    setShowInfo(true); // Mostrar info do próximo vídeo
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      handleVideoEnd();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Player de Vídeo */}
      <Video
        source={{ uri: currentVideo.url }}
        style={styles.video}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* Overlay com informações (aparece no início de cada vídeo) */}
      {showInfo && (
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.infoOverlay}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.unitTitle}>🏥 UBS Guarapuava</Text>
            <Text style={styles.unitSubtitle}>Sistema de Informação em Saúde</Text>
          </View>
          
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{currentVideo.title}</Text>
            <Text style={styles.videoCategory}>{currentVideo.category}</Text>
            <Text style={styles.videoDuration}>{currentVideo.duration}</Text>
          </View>
        </LinearGradient>
      )}

      {/* Footer sempre visível */}
      <View style={styles.footer}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.footerGradient}
        >
          <Text style={styles.footerText}>
            📍 Secretaria Municipal de Saúde - Guarapuava/PR
          </Text>
          <Text style={styles.emergencyText}>
            🚨 Emergência: 192 | 📞 SAMU: 192
          </Text>
          
          {/* Indicador de playlist */}
          <View style={styles.playlistIndicator}>
            <Text style={styles.playlistText}>
              Vídeo {currentVideoIndex + 1} de {AUTO_PLAYLIST.length}
            </Text>
            <View style={styles.progressDots}>
              {AUTO_PLAYLIST.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentVideoIndex && styles.activeDot
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    width: width,
    height: height,
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  headerInfo: {
    alignItems: 'center',
  },
  unitTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  unitSubtitle: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 8,
  },
  videoInfo: {
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  videoCategory: {
    fontSize: 16,
    color: '#00d4ff',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 14,
    color: '#cccccc',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  footerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playlistIndicator: {
    alignItems: 'center',
  },
  playlistText: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 8,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#00d4ff',
  },
});
