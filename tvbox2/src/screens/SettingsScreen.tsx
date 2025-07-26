import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import TVButton from '../components/TVButton';

interface SettingsScreenProps {
  navigation: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const handleKioskMode = () => {
    Alert.alert(
      '🏥 Modo Automático',
      'Ativar modo automático para reprodução contínua?\n\n• Vídeos rodando automaticamente\n• Sem interação do usuário\n• Ideal para TVs dos postos',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Ativar', 
          onPress: () => navigation.navigate('Kiosk'),
          style: 'default'
        }
      ]
    );
  };

  const handleManualMode = () => {
    Alert.alert(
      '🎮 Modo Manual',
      'Este é o modo com navegação manual.\n\n• Seleção de categorias\n• Controle de reprodução\n• Ideal para configuração e testes',
      [{ text: 'OK' }]
    );
  };

  const handleSyncContent = () => {
    Alert.alert(
      '🔄 Sincronizar Conteúdo',
      'Funcionalidade em desenvolvimento.\n\nEsta opção irá:\n• Baixar novos vídeos do servidor\n• Atualizar playlist automaticamente\n• Usar a rede MPLS da Prefeitura',
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>⚙️ Configurações</Text>
          <Text style={styles.subtitle}>Sistema UBS Guarapuava</Text>
        </View>

        {/* Opções de Configuração */}
        <View style={styles.optionsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎮 Modos de Operação</Text>
            
            <TouchableOpacity style={styles.option} onPress={handleKioskMode}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🏥 Modo Automático</Text>
                <Text style={styles.optionDescription}>
                  Reprodução contínua para TVs dos postos de saúde
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleManualMode}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🎮 Modo Manual</Text>
                <Text style={styles.optionDescription}>
                  Navegação manual para configuração e testes
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Gestão de Conteúdo</Text>
            
            <TouchableOpacity style={styles.option} onPress={handleSyncContent}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📡 Sincronizar Conteúdo</Text>
                <Text style={styles.optionDescription}>
                  Atualizar vídeos via rede MPLS da Prefeitura
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📊 Status da Rede</Text>
                <Text style={styles.optionDescription}>
                  Verificar conexão com servidor central
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ Informações do Sistema</Text>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>📍 Unidade de Saúde</Text>
              <Text style={styles.infoText}>Configurar via painel administrativo</Text>
              
              <Text style={styles.infoTitle}>🔗 Rede MPLS</Text>
              <Text style={styles.infoText}>Conectado à rede da Prefeitura</Text>
              
              <Text style={styles.infoTitle}>📱 Versão do App</Text>
              <Text style={styles.infoText}>UBS Guarapuava v1.0.0</Text>
            </View>
          </View>
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
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginTop: 8,
  },
  optionsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#cccccc',
  },
  arrow: {
    fontSize: 20,
    color: '#00d4ff',
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginTop: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#cccccc',
  },
});
