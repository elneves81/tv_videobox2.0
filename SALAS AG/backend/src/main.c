#include "../include/server.h"
#include "../include/database.h"

// Variáveis globais
struct MHD_Daemon *daemon = NULL;
db_config_t db_config = {
    .host = "localhost",
    .user = "root",
    .password = "",
    .database = "salas_ag",
    .port = 3306
};

int main(int argc, char *argv[]) {
    printf("Iniciando servidor SALAS AG...\n");
    printf("Porta: %d\n", SERVER_PORT);
    
    // Verificar conexão com banco de dados
    MYSQL *test_conn = db_connect();
    if (!test_conn) {
        fprintf(stderr, "Erro: Não foi possível conectar ao banco de dados\n");
        return 1;
    }
    db_disconnect(test_conn);
    printf("Conexão com banco de dados: OK\n");
    
    // Iniciar servidor HTTP
    if (start_server() != 0) {
        fprintf(stderr, "Erro ao iniciar servidor\n");
        return 1;
    }
    
    printf("Servidor iniciado com sucesso!\n");
    printf("API disponível em: http://localhost:%d/api/\n", SERVER_PORT);
    printf("Pressione ENTER para parar o servidor...\n");
    
    // Aguardar input do usuário
    getchar();
    
    // Parar servidor
    stop_server();
    printf("Servidor parado.\n");
    
    return 0;
}

int start_server(void) {
    daemon = MHD_start_daemon(
        MHD_USE_SELECT_INTERNALLY,
        SERVER_PORT,
        NULL, NULL,
        &answer_to_connection, NULL,
        MHD_OPTION_END
    );
    
    return (daemon == NULL) ? 1 : 0;
}

void stop_server(void) {
    if (daemon) {
        MHD_stop_daemon(daemon);
        daemon = NULL;
    }
}

int answer_to_connection(void *cls, struct MHD_Connection *connection,
                        const char *url, const char *method,
                        const char *version, const char *upload_data,
                        size_t *upload_data_size, void **con_cls) {
    
    static int aptr;
    struct MHD_Response *response;
    int ret;
    response_t *api_response = NULL;
    
    // Primeira chamada - inicializar
    if (&aptr != *con_cls) {
        *con_cls = &aptr;
        return MHD_YES;
    }
    
    // Adicionar headers CORS
    handle_cors(connection);
    
    // Preparar dados da requisição
    request_data_t req_data = {0};
    req_data.method = method;
    req_data.url = url;
    req_data.data = upload_data;
    req_data.data_size = *upload_data_size;
    
    // Validar sessão (exceto para endpoints de autenticação)
    if (strstr(url, "/api/auth/") == NULL) {
        const char *session_header = MHD_lookup_connection_value(
            connection, MHD_HEADER_KIND, "Authorization"
        );
        
        if (session_header && strncmp(session_header, "Bearer ", 7) == 0) {
            req_data.session_id = strdup(session_header + 7);
            if (!validate_session(req_data.session_id, &req_data.user_id, req_data.user_type)) {
                api_response = create_response(HTTP_UNAUTHORIZED, "application/json", 
                    "{\"error\":\"Sessão inválida ou expirada\"}");
                goto send_response;
            }
        } else {
            api_response = create_response(HTTP_UNAUTHORIZED, "application/json", 
                "{\"error\":\"Token de autenticação necessário\"}");
            goto send_response;
        }
    }
    
    // Roteamento das APIs
    if (strncmp(url, "/api/", 5) == 0) {
        // Endpoints de autenticação
        if (strncmp(url, "/api/auth/login", 15) == 0) {
            api_response = api_auth_login(&req_data);
        } else if (strncmp(url, "/api/auth/logout", 16) == 0) {
            api_response = api_auth_logout(&req_data);
        } else if (strncmp(url, "/api/auth/register", 18) == 0) {
            api_response = api_auth_register(&req_data);
        } else if (strncmp(url, "/api/auth/profile", 17) == 0) {
            api_response = api_auth_profile(&req_data);
        }
        
        // Endpoints de usuários
        else if (strncmp(url, "/api/usuarios", 13) == 0) {
            if (strcmp(method, "GET") == 0) {
                int id = 0;
                sscanf(url, "/api/usuarios/%d", &id);
                if (id > 0) {
                    api_response = api_usuarios_get(&req_data, id);
                } else {
                    api_response = api_usuarios_list(&req_data);
                }
            } else if (strcmp(method, "POST") == 0) {
                api_response = api_usuarios_create(&req_data);
            } else if (strcmp(method, "PUT") == 0) {
                int id = 0;
                sscanf(url, "/api/usuarios/%d", &id);
                api_response = api_usuarios_update(&req_data, id);
            } else if (strcmp(method, "DELETE") == 0) {
                int id = 0;
                sscanf(url, "/api/usuarios/%d", &id);
                api_response = api_usuarios_delete(&req_data, id);
            }
        }
        
        // Endpoints de salas
        else if (strncmp(url, "/api/salas", 10) == 0) {
            if (strcmp(method, "GET") == 0) {
                int id = 0;
                sscanf(url, "/api/salas/%d", &id);
                if (id > 0) {
                    api_response = api_salas_get(&req_data, id);
                } else {
                    api_response = api_salas_list(&req_data);
                }
            } else if (strcmp(method, "POST") == 0) {
                api_response = api_salas_create(&req_data);
            } else if (strcmp(method, "PUT") == 0) {
                int id = 0;
                sscanf(url, "/api/salas/%d", &id);
                api_response = api_salas_update(&req_data, id);
            } else if (strcmp(method, "DELETE") == 0) {
                int id = 0;
                sscanf(url, "/api/salas/%d", &id);
                api_response = api_salas_delete(&req_data, id);
            }
        }
        
        // Endpoints de agendamentos
        else if (strncmp(url, "/api/agendamentos", 17) == 0) {
            if (strncmp(url, "/api/agendamentos/check-conflict", 32) == 0) {
                api_response = api_agendamentos_check_conflict(&req_data);
            } else if (strcmp(method, "GET") == 0) {
                int id = 0;
                sscanf(url, "/api/agendamentos/%d", &id);
                if (id > 0) {
                    api_response = api_agendamentos_get(&req_data, id);
                } else {
                    api_response = api_agendamentos_list(&req_data);
                }
            } else if (strcmp(method, "POST") == 0) {
                api_response = api_agendamentos_create(&req_data);
            } else if (strcmp(method, "PUT") == 0) {
                int id = 0;
                sscanf(url, "/api/agendamentos/%d", &id);
                api_response = api_agendamentos_update(&req_data, id);
            } else if (strcmp(method, "DELETE") == 0) {
                int id = 0;
                sscanf(url, "/api/agendamentos/%d", &id);
                api_response = api_agendamentos_delete(&req_data, id);
            }
        }
        
        // Endpoint não encontrado
        else {
            api_response = create_response(HTTP_NOT_FOUND, "application/json", 
                "{\"error\":\"Endpoint não encontrado\"}");
        }
    } else {
        // Página inicial da API
        api_response = create_response(HTTP_OK, "application/json", 
            "{\"message\":\"SALAS AG API\",\"version\":\"1.0\",\"endpoints\":[\"/api/auth\",\"/api/usuarios\",\"/api/salas\",\"/api/agendamentos\"]}");
    }
    
send_response:
    if (!api_response) {
        api_response = create_response(HTTP_INTERNAL_ERROR, "application/json", 
            "{\"error\":\"Erro interno do servidor\"}");
    }
    
    // Log da requisição
    log_request(&req_data, api_response);
    
    // Criar resposta HTTP
    response = MHD_create_response_from_buffer(
        api_response->body_size,
        (void*)api_response->body,
        MHD_RESPMEM_MUST_COPY
    );
    
    // Adicionar headers
    MHD_add_response_header(response, "Content-Type", api_response->content_type);
    MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
    MHD_add_response_header(response, "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    MHD_add_response_header(response, "Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    ret = MHD_queue_response(connection, api_response->status_code, response);
    MHD_destroy_response(response);
    
    // Limpar recursos
    if (req_data.session_id) free(req_data.session_id);
    free_response(api_response);
    
    return ret;
}

void handle_cors(struct MHD_Connection *connection) {
    // Headers CORS são adicionados na resposta
}

void log_request(request_data_t *req, response_t *resp) {
    time_t now;
    char timestr[26];
    
    time(&now);
    strcpy(timestr, ctime(&now));
    timestr[24] = '\0'; // Remover \n
    
    printf("[%s] %s %s - %d\n", timestr, req->method, req->url, resp->status_code);
}
