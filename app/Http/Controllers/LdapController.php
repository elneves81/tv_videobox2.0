<?php

namespace App\Http\Controllers;

use App\Services\LdapService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LdapController extends Controller
{
    protected $ldapService;

    public function __construct(LdapService $ldapService)
    {
        $this->ldapService = $ldapService;
    }

    /**
     * Exibe a página de configuração/teste LDAP
     */
    public function index()
    {
        return view('ldap.index');
    }

    /**
     * Testa a conexão LDAP
     */
    public function testConnection()
    {
        $result = $this->ldapService->testConnection();
        
        return response()->json($result);
    }

    /**
     * Sincroniza usuários do LDAP
     */
    public function syncUsers()
    {
        $result = $this->ldapService->syncUsers();
        
        return response()->json($result);
    }

    /**
     * Busca dados de um usuário específico no LDAP
     */
    public function getUserData(Request $request)
    {
        $request->validate([
            'username' => 'required|string'
        ]);

        $userData = $this->ldapService->getUserData($request->username);
        
        if ($userData) {
            return response()->json([
                'success' => true,
                'data' => $userData
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Usuário não encontrado no LDAP'
            ]);
        }
    }

    /**
     * Tenta autenticar um usuário via LDAP
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $result = $this->ldapService->authenticate($request->username, $request->password);
        
        return response()->json($result);
    }

    /**
     * Limpa o cache LDAP
     */
    public function clearCache()
    {
        $result = $this->ldapService->clearCache();
        
        return response()->json([
            'success' => $result,
            'message' => $result ? 'Cache LDAP limpo com sucesso' : 'Cache LDAP não está habilitado'
        ]);
    }
}
