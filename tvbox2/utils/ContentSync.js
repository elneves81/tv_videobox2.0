// ============================================
// INTEGRAÇÃO TV BOX COM SERVIDOR ADMINISTRATIVO
// ============================================
// Este arquivo mostra como integrar o TV Box com o painel administrativo

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Configurações do servidor
const SERVER_CONFIG = {
  baseUrl: 'http://192.168.1.100:3001', // IP do servidor na rede MPLS
  ubsId: 'ubs-centro-guarapuava', // ID único desta UBS
  syncInterval: 30 * 60 * 1000, // Sync a cada 30 minutos
  maxRetries: 3,
  timeout: 60000 // 60 segundos
};

// Diretório local para armazenar vídeos
const LOCAL_VIDEO_DIR = FileSystem.documentDirectory + 'videos/';

class ContentSyncManager {
  constructor() {
    this.isRunning = false;
    this.lastSync = null;
    this.syncTimer = null;
  }

  // Iniciar sincronização automática
  async startAutoSync() {
    console.log('🔄 Iniciando sincronização automática...');
    
    // Criar diretório de vídeos se não existir
    await FileSystem.makeDirectoryAsync(LOCAL_VIDEO_DIR, { intermediates: true });
    
    // Primeira sincronização imediata
    await this.syncContent();
    
    // Configurar timer para sincronizações periódicas
    this.syncTimer = setInterval(() => {
      this.syncContent();
    }, SERVER_CONFIG.syncInterval);
    
    this.isRunning = true;
  }

  // Parar sincronização automática
  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.isRunning = false;
    console.log('⏹️ Sincronização automática interrompida');
  }

  // Sincronizar conteúdo com o servidor
  async syncContent() {
    try {
      console.log('📡 Sincronizando conteúdo...');
      
      // 1. Buscar lista de vídeos disponíveis
      const response = await this.fetchWithTimeout(
        `${SERVER_CONFIG.baseUrl}/api/sync/videos/${SERVER_CONFIG.ubsId}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`📥 Encontrados ${data.total} vídeos no servidor`);
      
      // 2. Verificar quais vídeos precisam ser baixados
      const videosToDownload = [];
      for (const video of data.videos) {
        const localPath = LOCAL_VIDEO_DIR + video.filename;
        
        if (!await FileSystem.getInfoAsync(localPath).then(info => info.exists)) {
          videosToDownload.push(video);
        }
      }
      
      console.log(`⬇️ ${videosToDownload.length} vídeos para download`);
      
      // 3. Baixar vídeos em falta
      for (const video of videosToDownload) {
        await this.downloadVideo(video);
      }
      
      // 4. Atualizar lista local de vídeos
      await AsyncStorage.setItem('videosList', JSON.stringify(data.videos));
      
      // 5. Limpar vídeos que não estão mais no servidor
      await this.cleanupOldVideos(data.videos);
      
      this.lastSync = new Date().toISOString();
      await AsyncStorage.setItem('lastSync', this.lastSync);
      
      console.log('✅ Sincronização concluída com sucesso');
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      
      // Tentar novamente em caso de erro
      setTimeout(() => {
        if (this.isRunning) {
          this.syncContent();
        }
      }, 5 * 60 * 1000); // Retry em 5 minutos
    }
  }

  // Baixar um vídeo específico
  async downloadVideo(video) {
    try {
      console.log(`⬇️ Baixando: ${video.title}`);
      
      const downloadUrl = `${SERVER_CONFIG.baseUrl}/api/download/${video.filename}`;
      const localPath = LOCAL_VIDEO_DIR + video.filename;
      
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, localPath);
      
      if (downloadResult.status === 200) {
        console.log(`✅ Download concluído: ${video.title}`);
      } else {
        throw new Error(`Erro no download: ${downloadResult.status}`);
      }
      
    } catch (error) {
      console.error(`❌ Erro ao baixar ${video.title}:`, error);
    }
  }

  // Limpar vídeos antigos que não estão mais no servidor
  async cleanupOldVideos(serverVideos) {
    try {
      const localFiles = await FileSystem.readDirectoryAsync(LOCAL_VIDEO_DIR);
      const serverFilenames = serverVideos.map(v => v.filename);
      
      for (const filename of localFiles) {
        if (!serverFilenames.includes(filename)) {
          const filePath = LOCAL_VIDEO_DIR + filename;
          await FileSystem.deleteAsync(filePath);
          console.log(`🗑️ Removido arquivo antigo: ${filename}`);
        }
      }
    } catch (error) {
      console.error('❌ Erro na limpeza de arquivos:', error);
    }
  }

  // Buscar vídeos locais para reprodução
  async getLocalVideos() {
    try {
      const videosListStr = await AsyncStorage.getItem('videosList');
      if (!videosListStr) return [];
      
      const videosList = JSON.parse(videosListStr);
      
      // Verificar quais vídeos existem localmente
      const localVideos = [];
      for (const video of videosList) {
        const localPath = LOCAL_VIDEO_DIR + video.filename;
        const fileInfo = await FileSystem.getInfoAsync(localPath);
        
        if (fileInfo.exists) {
          localVideos.push({
            ...video,
            localPath: localPath,
            fileSize: fileInfo.size
          });
        }
      }
      
      return localVideos;
    } catch (error) {
      console.error('❌ Erro ao buscar vídeos locais:', error);
      return [];
    }
  }

  // Utilitário para requisições com timeout
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SERVER_CONFIG.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Obter status da sincronização
  async getSyncStatus() {
    const lastSync = await AsyncStorage.getItem('lastSync');
    const localVideos = await this.getLocalVideos();
    
    return {
      isRunning: this.isRunning,
      lastSync: lastSync ? new Date(lastSync) : null,
      totalVideos: localVideos.length,
      totalSize: localVideos.reduce((sum, video) => sum + (video.fileSize || 0), 0)
    };
  }
}

// Instância global do gerenciador de sincronização
export const syncManager = new ContentSyncManager();

// ============================================
// COMPONENTE REACT PARA CONFIGURAÇÕES DE SYNC
// ============================================

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export const SyncSettingsComponent = () => {
  const [syncStatus, setSyncStatus] = useState({
    isRunning: false,
    lastSync: null,
    totalVideos: 0,
    totalSize: 0
  });

  useEffect(() => {
    updateSyncStatus();
    
    // Atualizar status a cada 30 segundos
    const statusInterval = setInterval(updateSyncStatus, 30000);
    
    return () => clearInterval(statusInterval);
  }, []);

  const updateSyncStatus = async () => {
    const status = await syncManager.getSyncStatus();
    setSyncStatus(status);
  };

  const toggleSync = async () => {
    if (syncStatus.isRunning) {
      syncManager.stopAutoSync();
      Alert.alert('Sincronização', 'Sincronização automática desativada');
    } else {
      await syncManager.startAutoSync();
      Alert.alert('Sincronização', 'Sincronização automática ativada');
    }
    updateSyncStatus();
  };

  const manualSync = async () => {
    Alert.alert('Sincronização', 'Iniciando sincronização manual...');
    await syncManager.syncContent();
    updateSyncStatus();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return 'Nunca';
    return date.toLocaleString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sincronização MPLS</Text>
      
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusValue, { color: syncStatus.isRunning ? '#4CAF50' : '#FF5722' }]}>
          {syncStatus.isRunning ? 'Ativa' : 'Inativa'}
        </Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Última Sincronização:</Text>
        <Text style={styles.statusValue}>{formatDate(syncStatus.lastSync)}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Vídeos Armazenados:</Text>
        <Text style={styles.statusValue}>{syncStatus.totalVideos}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Espaço Utilizado:</Text>
        <Text style={styles.statusValue}>{formatFileSize(syncStatus.totalSize)}</Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={toggleSync}>
        <Text style={styles.buttonText}>
          {syncStatus.isRunning ? 'Desativar Sync' : 'Ativar Sync'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={manualSync}>
        <Text style={[styles.buttonText, { color: '#2196F3' }]}>
          Sincronizar Agora
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
    textAlign: 'center'
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  statusValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold'
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#2196F3'
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2196F3'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  }
});

// ============================================
// EXEMPLO DE USO NO COMPONENTE PRINCIPAL
// ============================================

/*
// No App.tsx ou componente principal:

import { syncManager } from './utils/ContentSync';

export default function App() {
  useEffect(() => {
    // Iniciar sincronização quando o app abre
    syncManager.startAutoSync();
    
    // Cleanup quando o app fecha
    return () => {
      syncManager.stopAutoSync();
    };
  }, []);

  // Resto da aplicação...
}

// No KioskModeScreen.tsx:

import { syncManager } from '../utils/ContentSync';

export default function KioskModeScreen() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadLocalVideos();
  }, []);

  const loadLocalVideos = async () => {
    const localVideos = await syncManager.getLocalVideos();
    setVideos(localVideos);
  };

  // Usar localPath ao invés de URI remota para reprodução
  const videoUri = videos[currentIndex]?.localPath || null;

  // Resto do componente...
}
*/
