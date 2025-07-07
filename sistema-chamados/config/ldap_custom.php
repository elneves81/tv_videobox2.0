<?php

return [
    /*
    |--------------------------------------------------------------------------
    | LDAP Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para integração com Active Directory / LDAP
    |
    */

    'enabled' => env('LDAP_ENABLED', false),
    'connection' => env('LDAP_CONNECTION', 'default'),

    'connections' => [
        'default' => [
            'hosts' => explode(',', env('LDAP_HOSTS', '127.0.0.1')),
            'port' => env('LDAP_PORT', 389),
            'base_dn' => env('LDAP_BASE_DN', 'dc=empresa,dc=local'),
            'username' => env('LDAP_USERNAME', null),
            'password' => env('LDAP_PASSWORD', null),
            'use_ssl' => env('LDAP_USE_SSL', false),
            'use_tls' => env('LDAP_USE_TLS', false),
            'timeout' => env('LDAP_TIMEOUT', 5),
        ],
    ],

    'authentication' => [
        'enabled' => env('LDAP_AUTH_ENABLED', false),
        'fallback' => env('LDAP_AUTH_FALLBACK', true), // Permitir login local se LDAP falhar
        'bind_as_user' => env('LDAP_BIND_AS_USER', true),
        'username_attribute' => env('LDAP_USERNAME_ATTRIBUTE', 'samaccountname'),
    ],

    'sync' => [
        'enabled' => env('LDAP_SYNC_ENABLED', true),
        'auto_import' => env('LDAP_AUTO_IMPORT', true),
        'auto_update' => env('LDAP_AUTO_UPDATE', true),
        
        'user_filter' => env('LDAP_USER_FILTER', '(&(objectCategory=person)(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))'),
        'search_base' => env('LDAP_SEARCH_BASE', null), // Se null, usa base_dn
        
        'attributes' => [
            'username' => 'samaccountname',
            'name' => 'displayname',
            'first_name' => 'givenname',
            'last_name' => 'sn',
            'email' => 'mail',
            'phone' => 'telephonenumber',
            'department' => 'department',
            'title' => 'title',
            'office' => 'physicaldeliveryofficename',
            'manager' => 'manager',
            'employee_id' => 'employeeid',
        ],

        'group_mapping' => [
            // Grupos AD => Roles do Sistema
            'CN=Domain Admins,CN=Users,DC=empresa,DC=local' => 'admin',
            'CN=IT Support,OU=Groups,DC=empresa,DC=local' => 'technician',
            'CN=Help Desk,OU=Groups,DC=empresa,DC=local' => 'technician',
            'CN=Managers,OU=Groups,DC=empresa,DC=local' => 'manager',
        ],

        'default_role' => env('LDAP_DEFAULT_ROLE', 'user'),
        'default_department' => env('LDAP_DEFAULT_DEPARTMENT', 'TI'),
    ],

    'logging' => [
        'enabled' => env('LDAP_LOGGING', true),
        'level' => env('LDAP_LOG_LEVEL', 'info'),
    ],

    'cache' => [
        'enabled' => env('LDAP_CACHE_ENABLED', true),
        'ttl' => env('LDAP_CACHE_TTL', 3600), // 1 hora
        'prefix' => env('LDAP_CACHE_PREFIX', 'ldap_'),
    ],

    'security' => [
        'require_secure_connection' => env('LDAP_REQUIRE_SECURE', false),
        'certificate_path' => env('LDAP_CERT_PATH', null),
        'ignore_certificate_errors' => env('LDAP_IGNORE_CERT_ERRORS', false),
    ],
];
