<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Services\LdapService;

try {
    echo "=== TESTE DE CONEXÃO LDAP ===\n";
    
    $ldap = new LdapService();
    $result = $ldap->testConnection();
    
    if ($result['success']) {
        echo "✅ Conexão LDAP: SUCESSO\n";
        if (isset($result['server'])) {
            echo "Servidor: " . $result['server'] . "\n";
        }
        if (isset($result['message'])) {
            echo "Mensagem: " . $result['message'] . "\n";
        }
        echo "Resultado completo: " . json_encode($result) . "\n";
        
        echo "\n=== TESTE DE BUSCA DE USUÁRIO ===\n";
        $userData = $ldap->getUserData('sistema.sms');
        
        if ($userData && isset($userData['success']) && $userData['success']) {
            echo "✅ Busca de usuário: SUCESSO\n";
            echo "Dados do usuário encontrados:\n";
            if (isset($userData['data'])) {
                foreach ($userData['data'] as $key => $value) {
                    if ($value) {
                        echo "  $key: $value\n";
                    }
                }
            }
        } else {
            echo "❌ Busca de usuário: FALHOU\n";
            if ($userData && isset($userData['message'])) {
                echo "Erro: " . $userData['message'] . "\n";
            } else {
                echo "Erro: Resposta inválida ou nula\n";
            }
        }
        
        echo "\n=== TESTE DE SINCRONIZAÇÃO ===\n";
        $syncResult = $ldap->syncUsers();
        
        if ($syncResult['success']) {
            echo "✅ Sincronização: SUCESSO\n";
            echo "Usuários criados: " . $syncResult['created'] . "\n";
            echo "Usuários atualizados: " . $syncResult['updated'] . "\n";
            echo "Erros: " . $syncResult['errors'] . "\n";
        } else {
            echo "❌ Sincronização: FALHOU\n";
            echo "Erro: " . $syncResult['message'] . "\n";
        }
        
    } else {
        echo "❌ Conexão LDAP: FALHOU\n";
        echo "Erro: " . $result['message'] . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ ERRO GERAL: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== TESTE CONCLUÍDO ===\n";
