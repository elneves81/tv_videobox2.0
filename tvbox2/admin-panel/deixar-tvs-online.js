// Script para deixar as TVs online (simulação de sync recente)
const fs = require('fs');
const path = require('path');

// Timestamps atuais (últimos 2 minutos)
const now = new Date();
const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);

// Atualizar sync_log.json
const syncLogPath = path.join(__dirname, 'data', 'sync_log.json');
const syncLog = [
  {
    "id": "sync-online-001",
    "unit_id": "ubs-centro-guarapuava",
    "video_id": null,
    "action": "sync_request",
    "status": "success",
    "timestamp": twoMinutesAgo.toISOString()
  },
  {
    "id": "sync-online-002",
    "unit_id": "ubs-bonsucesso-guarapuava",
    "video_id": null,
    "action": "sync_request",
    "status": "success",
    "timestamp": oneMinuteAgo.toISOString()
  },
  {
    "id": "sync-online-003",
    "unit_id": "ubs-primavera-guarapuava",
    "video_id": null,
    "action": "sync_request",
    "status": "success",
    "timestamp": thirtySecondsAgo.toISOString()
  },
  {
    "id": "sync-download-001",
    "unit_id": "ubs-centro-guarapuava",
    "video_id": "video-vacinacao-infantil",
    "action": "download",
    "status": "success",
    "timestamp": twoMinutesAgo.toISOString()
  },
  {
    "id": "sync-download-002",
    "unit_id": "ubs-bonsucesso-guarapuava",
    "video_id": "video-prevencao-dengue",
    "action": "download",
    "status": "success",
    "timestamp": oneMinuteAgo.toISOString()
  }
];

// Atualizar units.json
const unitsPath = path.join(__dirname, 'data', 'units.json');
const units = [
  {
    "id": "ubs-centro-guarapuava",
    "name": "UBS Centro Guarapuava",
    "address": "Rua XV de Novembro, 123 - Centro",
    "phone": "(42) 3623-1234",
    "status": "active",
    "location": "Centro",
    "last_sync": twoMinutesAgo.toISOString(),
    "created_at": "2025-07-25T18:00:00.000Z"
  },
  {
    "id": "ubs-bonsucesso-guarapuava",
    "name": "UBS Bonsucesso",
    "address": "Rua Santos Dumont, 456 - Bonsucesso",
    "phone": "(42) 3623-5678",
    "status": "active",
    "location": "Bonsucesso",
    "last_sync": oneMinuteAgo.toISOString(),
    "created_at": "2025-07-25T18:00:00.000Z"
  },
  {
    "id": "ubs-primavera-guarapuava",
    "name": "UBS Primavera",
    "address": "Rua das Flores, 789 - Primavera",
    "phone": "(42) 3623-9012",
    "status": "active",
    "location": "Primavera",
    "last_sync": thirtySecondsAgo.toISOString(),
    "created_at": "2025-07-25T18:00:00.000Z"
  }
];

try {
  // Salvar arquivos
  fs.writeFileSync(syncLogPath, JSON.stringify(syncLog, null, 2));
  fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
  
  console.log('✅ TVs configuradas como ONLINE!');
  console.log('📺 UBS Centro: Online há 2 minutos');
  console.log('📺 UBS Bonsucesso: Online há 1 minuto');
  console.log('📺 UBS Primavera: Online há 30 segundos');
  console.log('');
  console.log('🎯 Agora acesse: http://localhost:3001/tv-monitor.html');
  console.log('   Vá na aba "📺 Status das TVs" para ver todas online!');
  
} catch (error) {
  console.error('❌ Erro ao atualizar arquivos:', error.message);
}
