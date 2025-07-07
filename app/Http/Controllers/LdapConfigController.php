<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class LdapConfigController extends Controller
{
    /**
     * Atualiza as configurações LDAP no .env
     */
    public function update(Request $request)
    {
        try {
            $request->validate([
                'LDAP_ENABLED' => 'required|in:true,false,1,0',
                'LDAP_HOSTS' => 'required|string',
                'LDAP_PORT' => 'required|integer',
                'LDAP_BASE_DN' => 'required|string',
                'LDAP_USERNAME' => 'nullable|string',
                'LDAP_PASSWORD' => 'nullable|string',
                'LDAP_USE_TLS' => 'required|in:true,false,1,0',
            ]);

            $envUpdates = [
                'LDAP_ENABLED' => $request->LDAP_ENABLED,
                'LDAP_HOSTS' => $request->LDAP_HOSTS,
                'LDAP_PORT' => $request->LDAP_PORT,
                'LDAP_BASE_DN' => $request->LDAP_BASE_DN,
                'LDAP_USERNAME' => $request->LDAP_USERNAME,
                'LDAP_PASSWORD' => $request->LDAP_PASSWORD,
                'LDAP_USE_TLS' => $request->LDAP_USE_TLS,
            ];

            $this->setEnvValues($envUpdates);
            Artisan::call('config:clear');
            Artisan::call('cache:clear');

            return response()->json(['success' => true, 'message' => 'Configurações atualizadas com sucesso!']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao salvar configurações LDAP.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Atualiza valores no arquivo .env
     */
    protected function setEnvValues(array $values)
    {
        $envPath = base_path('.env');
        $env = file_get_contents($envPath);
        foreach ($values as $key => $value) {
            // Se o valor contém espaço, vírgula, aspas ou quebra de linha, coloca entre aspas
            if ($value !== null && preg_match('/[\s,\"\n]/', $value)) {
                // Escapa aspas duplas
                $value = '"' . str_replace('"', '\"', $value) . '"';
            }
            $pattern = "/^{$key}=.*$/m";
            $line = $key . '=' . $value;
            if (preg_match($pattern, $env)) {
                $env = preg_replace($pattern, $line, $env);
            } else {
                $env .= "\n{$line}";
            }
        }
        if (!is_writable($envPath)) {
            throw new \Exception('O arquivo .env não tem permissão de escrita.');
        }
        file_put_contents($envPath, $env);
    }
}
