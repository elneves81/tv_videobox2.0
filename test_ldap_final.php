<?php

require_once 'vendor/autoload.php';

use App\Services\LdapService;
use Illuminate\Foundation\Application;

// Carregar a aplicação Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Testar o serviço LDAP
try {
    $ldapService = new LdapService();
    
    echo "=== TESTE DO SERVIÇO LDAP ===\n";
    
    // Teste de conexão
    echo "\n1. Testando conexão LDAP...\n";
    $connectionResult = $ldapService->testConnection();
    if ($connectionResult['success']) {
        echo "✅ " . $connectionResult['message'] . "\n";
        
        // Teste de busca por usuário específico
        echo "\n2. Testando busca por usuário específico (Administrator)...\n";
        $user = $ldapService->getUserData('Administrator');
        if ($user) {
            echo "✅ Usuário Administrator encontrado!\n";
            echo "DN: " . ($user['dn'] ?? 'N/A') . "\n";
            echo "Nome: " . ($user['name'] ?? 'N/A') . "\n";
            echo "Email: " . ($user['email'] ?? 'N/A') . "\n";
        } else {
            echo "❌ Usuário Administrator não encontrado\n";
        }
        
        // Teste de sincronização de usuários
        echo "\n3. Testando sincronização de usuários...\n";
        $syncResult = $ldapService->syncUsers();
        if ($syncResult['success']) {
            echo "✅ Sincronização bem-sucedida!\n";
            echo "Usuários criados: " . $syncResult['created'] . "\n";
            echo "Usuários atualizados: " . $syncResult['updated'] . "\n";
            echo "Erros: " . $syncResult['errors'] . "\n";
            if (!empty($syncResult['messages'])) {
                echo "Mensagens:\n";
                foreach (array_slice($syncResult['messages'], 0, 3) as $msg) {
                    echo "  - " . $msg . "\n";
                }
            }
        } else {
            echo "❌ Falha na sincronização\n";
            if (!empty($syncResult['messages'])) {
                foreach ($syncResult['messages'] as $msg) {
                    echo "  - " . $msg . "\n";
                }
            }
        }
    } else {
        echo "❌ " . $connectionResult['message'] . "\n";
        if ($connectionResult['details']) {
            echo "Detalhes: " . $connectionResult['details'] . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Erro no teste LDAP: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== FIM DO TESTE ===\n";
