import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
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

interface PlayerScreenProps {
  navigation: any;
  route: {
    params: {
      item: MediaItem;
    };
  };
}

export default function PlayerScreen({ navigation, route }: any) {
  const { item } = route.params || { item: {
    id: '1',
    title: 'Vídeo de Exemplo',
    thumbnail: '',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '10:00',
    category: 'Teste'
  }};
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => subscription.remove();
  }, [navigation]);

  // Ocultar controles automaticamente
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = async (seekTime: number) => {
    if (videoRef.current && duration > 0) {
      const newPosition = Math.max(0, Math.min(duration, position + seekTime));
      await videoRef.current.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const onPlaybackStatusUpdate = (status: any) => {
    setStatus(status);
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);
    }
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Player de Vídeo */}
      <Video
        ref={videoRef}
        source={{ uri: item.url }}
        style={styles.video}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay={true}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />

      {/* Overlay com controles */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setShowControls(!showControls)}
        activeOpacity={1}
      >
        {showControls && (
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.controlsContainer}
          >
            {/* Header */}
            <SafeAreaView style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← Voltar</Text>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoCategory}>{item.category}</Text>
              </View>
            </SafeAreaView>

            {/* Controles centrais */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleSeek(-10000)}
              >
                <Text style={styles.controlButtonText}>⏪ 10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.playButton]}
                onPress={handlePlayPause}
              >
                <Text style={styles.playButtonText}>
                  {isPlaying ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleSeek(10000)}
              >
                <Text style={styles.controlButtonText}>10s ⏩</Text>
              </TouchableOpacity>
            </View>

            {/* Controles inferiores */}
            <View style={styles.bottomControls}>
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <View style={styles.progressBar}>
                  <View style={styles.progressTrack} />
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${progressPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </LinearGradient>
        )}
      </TouchableOpacity>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 20,
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoCategory: {
    color: '#cccccc',
    fontSize: 16,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.8)',
    borderColor: '#00d4ff',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playButtonText: {
    fontSize: 32,
    textAlign: 'center',
  },
  bottomControls: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 16,
    minWidth: 60,
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    position: 'relative',
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 3,
  },
});
