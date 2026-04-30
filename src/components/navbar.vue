<template>
    <nav class="navbar navbar-expand-lg fixed-top px-3">
        <div class="container-fluid">
            <button class="navbar-toggler d-lg-none btn-menu-icon" type="button" id="sidebarToggle">
                <i class="fas fa-bars text-white"></i>
            </button>
            <a class="navbar-brand ms-2 d-none d-md-inline" href="#">
                <i class="fas fa-graduation-cap me-1"></i>
                ProAcademico
            </a>
            
            <div class="navbar-nav ms-auto d-flex flex-row align-items-center">
                <!-- Notificações -->
                <div class="nav-item dropdown me-3">
                    <a class="nav-link dropdown-toggle" href="#" id="notificationsDropdown" role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                        <i class="fas fa-bell"></i>
                        <span v-if="$store.state.notificacoesTotal > 0" class="badge bg-danger position-absolute start-100 translate-middle" style="font-size: 0.7rem; top: 5px;">
                            {{$store.state.notificacoesTotal}}
                        </span>
                    </a>
                    <ul class="content-notify dropdown-menu dropdown-menu-end dropdown-menu-lg-end shadow-lg" 
                        style="max-height: 400px; overflow-y: auto; z-index: 1050; right: -80px;" 
                        aria-labelledby="notificationsDropdown">

                        <li>
                            <h6 class="dropdown-header text-dark fw-bold border-bottom py-2">
                                🔔 Notificações
                            </h6>
                        </li>
                        
                        <li
    v-for="item in notificacoes"
    :key="item.id"
    class="dropdown-item p-0"
    :class="{
        'bg-primary bg-opacity-10': !item.visualizado,
        'bg-secondary bg-opacity-10': item.visualizado
    }"
    style="border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.3s;"
    @click="verNotificacao(item.id)"
>
    <div class="d-flex align-items-start p-3 text-break" style="white-space: normal;">

        <!-- Ícone -->
        <div class="flex-shrink-0 me-2 mt-1 text-primary">
            <i :class="{
                    'fas fa-file text-dark': item.visualizado == 0,
                    'fas fa-check': item.visualizado == 1
                }" style="font-size: 12px;"></i>
        </div>

        <div class="flex-grow-1">
            <!-- Conteúdo -->
            <p
                class="mb-1"
                :class="{
                    'fw-bold text-dark': item.visualizado == 0,
                    'text-secondary': item.visualizado == 1
                }"
            >
                {{ item.conteudo }}
            </p>

            <div class="d-flex justify-content-between align-items-center">
                <!-- Tempo -->
                <small class="text-muted text-truncate" style="font-size: 11px;">
                    <i class="far fa-clock me-1"></i> {{ item.tempo_atras }}
                </small>

                <!-- Estado -->
                <small
                    v-show="item.visualizado == 1"
                    class="text-success ms-auto"
                    style="font-size: 11px;"
                >
                    <i class="fas fa-check-circle me-1"></i> Visto
                </small>
            </div>
        </div>
    </div>
</li>

                        
                        <!-- li>
                            <a class="dropdown-item text-center text-primary small py-2" href="#">Todas as notificações (10)</a>
                        </li -->
                    </ul>
                </div>

                <!-- Perfil do Usuário -->
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                        <!-- <img src="https://via.placeholder.com/32x32" class="rounded-circle me-2" alt="Avatar"> -->
                         <div class="bg-white text-dark rounded-circle me-2 opacity-7 d-flex justify-content-center align-items-center" style="display: inline-block; width: 32px; height: 32px; ">
                            {{ nome_letra }}
                         </div>
                        <!-- <span class="d-none d-md-inline">{{ nome }}</span> -->
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-end" aria-labelledby="userDropdown">
                        <li><router-link class="dropdown-item" to="/perfil"><i class="fas fa-user me-2"></i>Perfil</router-link></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt me-2"></i>Sair</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <div v-show="loader" class="fundo">
        <div class="loader-container">
            <div class="loader"></div>
            <p class="mt-3 text-white">Saindo...</p>
        </div>
    </div>
</template>

<script>
    import * as api from '../api/api.js'
    
    export default {
        data() {
            return {
                nome: "",
                nome_letra: "",
                loader: false,
                notificacoes: ""
            }
        },

        async created() {
            if(this.$store.state.usuario != "") {
                const usuario = this.$store.state.usuario
                this.nome_letra = usuario.name.charAt(0).toUpperCase();
            } else {
              const resp = await api.listar("get-usuario")
              const usuario = resp.usuario
              this.nome_letra = usuario.name.charAt(0).toUpperCase();
              this.$store.state.usuario = usuario
              this.$store.state.permissoes = resp.permissoes
            }

            this.listarNotificacao ()
        },

        methods: {
            async listarNotificacao () {
                try {
                const resp = await api.listar("notificacoes");

                    if(resp) {
                        this.notificacoes = resp.notificacoes.data

                        this.$store.state.notificacoesTotal = resp.notificacoesTotal

                        console.log(this.notificacoes)
                    }
                } catch (error) {

                }
            },

            async verNotificacao(id) {
                try {

                    const response = await api.update(`notificacoes/visualizar/${id}`, []); 

                    if(response) {
                        this.listarNotificacao ()
                    } 
                } catch (error) {

                }

            },

            async logout() {
                if(sessionStorage.getItem("token")) {

                this.loader = true
                const token = sessionStorage.getItem("token");
                
                if (!token) {
                    return;
                }

                try {
                    await fetch(import.meta.env.VITE_API_URL+'/logout', {
                    method: 'POST',
                    headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    }
                });

                // Remove dados do usuário do sessionStorage
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("regra");

                // Redireciona para a tela de login (ou outra)
                this.$router.push("/login")
                } catch (error) {
                    console.error("Erro ao terminar sessão:", error);
                    alert("Erro ao terminar sessão. Tente novamente.");
                }
            }
            }
        }

    }
</script>

<style scoped>
    .fundo {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    .loader-container {
        margin-top: -100px;
        text-align: center;
    }

    .loader {
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }

    .btn-menu-icon {
        display: none !important;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 758px) {
        .btn-menu-icon {
            display: inline !important;
        }
    }

    /* Layout e aparência mais compacta para desktop */
.kv {
  display: inline-block;
  background: #f7fafc; /* leve bloco claro */
  padding: 6px 10px;
  border-radius: 8px;
  min-height: 32px;
  line-height: 18px;
  color: #0f172a;
}

/* garantir espaçamento vertical consistente entre pares dt/dd */
dl.row dt {
  padding-top: 6px;
  padding-bottom: 6px;
}

dl.row dd {
  padding-top: 6px;
  padding-bottom: 6px;
  margin-bottom: 0;
}

/* label menor e alinhada para leitura rápida */
dl.row dt {
  font-size: 0.85rem;
  letter-spacing: 0.2px;
}

/* valor um pouco maior para contraste */
dl.row dd {
  font-size: 0.95rem;
  font-weight: 600;
}

.content-notify {
    width: 420px;
}

/* ajuste em telas pequenas: empilha e alinha ao início */
@media (max-width: 767.98px) {
  dl.row dt {
    text-align: left !important;
    margin-top: 6px;
  }
  .kv {
    display: block;
    width: 100%;
  }
  
  .content-notify {
    width: 250px;
  }
}


</style>
