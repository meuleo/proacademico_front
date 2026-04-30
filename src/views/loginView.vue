<template>
<div class="body">
    <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
    </div>
    
    <div class="container px-0">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6 px-0">
                <div class="login-container">
                    <div class="login-header">
                        <div class="logo">
                            <div>
                                <div class="logo-icon mx-auto mb-3">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <span>ProAcademico</span>
                            </div>
                        </div>
                        <p class="mb-0 invisible">Sistema de Gestão Escolar</p>
                    </div>
                    
                    <div class="login-body">
                        <form @submit.prevent="fazerLogin">
                            <div class="form-floating mb-3">
                                <input type="text" v-model="login" class="form-control" id="email" placeholder="nome@exemplo.com" style="padding-left: 13px !important; padding-top: 30px !important;" required>
                                <label for="email"><i class="fas fa-user me-2"></i>E-mail ou Usuário</label>
                            </div>
                            
                            <div class="form-floating mb-4">
                                <input :type="input_type" v-model="senha" class="form-control" id="senha" placeholder="Senha" style="padding-left: 13px !important; padding-top: 30px !important;" required>
                                <label for="senha"><i class="fas fa-lock me-2"></i>Senha</label>
                                <div style="position: absolute; top: 18px; right: 15px;">
                                    <div @click="mostrarSenha" style="cursor: pointer;">
                                        <i v-if="see" class="fas fa-eye-slash"></i>
                                        <i v-else class="fas fa-eye"></i>
                                    </div>
                                </div>
                            </div>
                           
                            <div v-if="erro" class="alert alert-danger">
                                {{ erro }}
                            </div>
                            
                            <button v-if="loader" type="button" class="btn btn-primary btn-login mb-3 mt-2" style="height: 48px;">
                                <div class="wave-loader">
                                    <div class="wave-bar"></div>
                                    <div class="wave-bar"></div>
                                    <div class="wave-bar"></div>
                                </div>
                            </button>
                            <button v-else type="submit" class="btn btn-primary btn-login mb-3 mt-2" style="height: 48px;">
                                <i class="fas fa-sign-in-alt me-2"></i> Entrar
                            </button>
                            
                            <div class="login-footer mt-3">
                                <router-link to="#" class="text-muted small">Esqueceu a senha?</router-link>
                            </div>
                            
                        </form>
                    </div>
                </div>

                <div class="text-center mt-4 copyright">
                    <p>© 2025 ProAcademico. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default { 
  data() {
    return {
      see: false,
      input_type: "password",
      login: "",
      senha: "",
      erro: null,
      loader: false,
      regras: ["director_pedagogico"]
    };
  },

  methods: {
    mostrarSenha() {
      this.see = !this.see;
      this.input_type = this.see ? "text" : "password";
    },

    // Helper: base URL (substitui em build pelo VUE_APP_API_URL)
    baseUrl() {
      return import.meta.env.VITE_API_URL;
    },

    // Helper: POST com tratamento e debug
    async fetchPost(path, body = {}, token = null) {
      const url = `${this.baseUrl()}/${path.replace(/^\/+/, '')}`;
      console.log('[fetchPost] url:', url, 'body:', body);
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const text = await resp.text();
      // tenta parsear JSON (alguns endpoints devolvem texto)
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) {
        console.warn('[fetchPost] resposta nao é JSON:', text);
        throw new Error(`Resposta inválida do servidor: ${text}`);
      }

      if (!resp.ok) {
        // tenta mensagens de erro do body, caso existam
        const message = data?.message || data?.erro || `HTTP ${resp.status}`;
        const err = new Error(message);
        err.response = { status: resp.status, data };
        throw err;
      }

      return { status: resp.status, data };
    },

    // Helper: GET com token
    async fetchGet(path, token = null) {
      const url = `${this.baseUrl()}/${path.replace(/^\/+/, '')}`;
      console.log('[fetchGet] url:', url);
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(url, { method: 'GET', headers });
      const text = await resp.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) {
        console.warn('[fetchGet] resposta nao é JSON:', text);
        throw new Error(`Resposta inválida do servidor: ${text}`);
      }

      if (!resp.ok) {
        const message = data?.message || `HTTP ${resp.status}`;
        const err = new Error(message);
        err.response = { status: resp.status, data };
        throw err;
      }

      return { status: resp.status, data };
    },

    async fazerLogin() {
      console.log('fazerLogin chamado');
      this.erro = null;
      this.loader = true;

      try {
        // 1) Login
        const loginPayload = { login: this.login, password: this.senha };
        const loginResp = await this.fetchPost('fazer-login', loginPayload);
        console.log('loginResp:', loginResp);

        const token = loginResp.data?.token;
        const regra = loginResp.data?.regra;

        if (!token || !regra) {
          throw new Error('Token ou regra não retornados pela API.');
        }

        // 2) salvar token/regra na sessionStorage
        this.$store.state.token = token;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('regra', regra);

        // 3) buscar usuario e permissoes
        const usuarioResp = await this.fetchGet('get-usuario', token);
        console.log('usuarioResp:', usuarioResp);

        this.$store.state.usuario = usuarioResp.data?.usuario ?? null;
        this.$store.state.permissoes = usuarioResp.data?.permissoes ?? [];

        // 4) redirecionar
        if (["director_pedagogico", "director_geral", "director_administrativo", "secretario_geral", "secretario", "secretario_pedagogico", "secretario_administrativo", "chefe_de_secretaria"].includes(regra)) {
          await this.$router.push({ name: 'painel.geral' });
          window.location.reload();
        } else if (regra === "professor") {
          await this.$router.push({ name: 'painel.geral' });
          window.location.reload();
        } else if (regra === "aluno") {
          await this.$router.push({ name: 'painel.aluno' });
          window.location.reload();
        } else {
          console.warn("Regra não reconhecida:", regra);
          await this.$router.push({ name: 'login' });
        }

      } catch (error) {
        console.error('ERRO LOGIN:', error);
        this.erro = error.response?.data?.message || error.message || 'Erro ao fazer login.';
      } finally {
        this.loader = false;
      }
  },

},

mounted() {
// Estilos dinâmicos nos inputs
this.$nextTick(() => {
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
      const label = this.parentNode.querySelector('label');
      if (label) label.style.color = '#4361ee';
    });

    input.addEventListener('blur', function() {
      if (!this.value) {
        const label = this.parentNode.querySelector('label');
        if (label) label.style.color = '';
      }
    });
  });
});

// Se já existir sessão, redireciona para o painel correspondente
const token = sessionStorage.getItem('token');
const regra = sessionStorage.getItem('regra');

if (token && regra) {
  if (["director_pedagogico", "director_geral", "director_administrativo", "secretario_geral"].includes(regra)) {
    this.$router.push({ name: 'painel.geral' })
    // .then(() => window.location.reload());
  } else if (regra === "professor") {
    this.$router.push({ name: 'painel.geral' })
    // .then(() => window.location.reload());
  } else if (regra === "aluno") {
    this.$router.push({ name: 'painel.aluno' })
    // .then(() => window.location.reload());
  } else {
    console.warn("Regra não reconhecida:", regra);
    return
    this.$router.push({ name: 'login' });
  }
}
}
}
</script>

<style scoped>
    .body {
        font-family: 'Poppins', sans-serif;
        /* background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%); */
        min-height: 100vh;
        display: flex;
        align-items: center;
        overflow-x: hidden;
    }

.login-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.login-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path fill="rgba(255,255,255,0.1)" d="M0,0 L100,0 L100,100 Q50,80 0,100 L0,0 Z"></path></svg>');
  background-size: 100% 100%;
  opacity: 0.3;
}

.logo {
  font-weight: 600;
  font-size: 1.8rem;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.5rem;
}

    .login-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .login-container:hover {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .login-header {
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 2rem;
            text-align: center;
            position: relative;
        }
        
        .login-header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path fill="rgba(255,255,255,0.1)" d="M0,0 L100,0 L100,100 Q50,80 0,100 L0,0 Z"></path></svg>');
            background-size: 100% 100%;
            opacity: 0.5;
        }
        
        .logo {
            font-weight: 600;
            font-size: 2rem;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.5rem;
        }
        
        .logo-icon {
            margin-right: 10px;
            font-size: 2.2rem;
        }
        
        .login-body {
            padding: 2.5rem;
        }
        
        .form-control {
            border-radius: 10px;
            padding-top: 20px !important;
            border: 2px solid #e9ecef;
            transition: all 0.3s;
        }
        
        .form-control:focus {
            /* border-color: var(--accent-color); */
            box-shadow: 0 0 0 0.25rem rgba(76, 201, 240, 0.25);
        }
        
        .input-group-text {
            background: transparent;
            border-right: none;
        }
        
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
            color: var(--primary-color);
        }
        
        .btn-login {
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            border: none;
            border-radius: 10px;
            padding: 12px;
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: all 0.3s;
            width: 100%;
        }
        
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(67, 97, 238, 0.4);
        }
        
        .divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0;
            color: #adb5bd;
        }
        
        .divider::before, .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #dee2e6;
        }
        
        .divider::before {
            margin-right: 1rem;
        }
        
        .divider::after {
            margin-left: 1rem;
        }
        
        .social-login .btn {
            border-radius: 10px;
            padding: 10px;
            font-size: 0.9rem;
        }
        
        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            overflow: hidden;
        }
        
        .shape {
            position: absolute;
            opacity: 0.1;
            border-radius: 50%;
        }
        
        .shape-1 {
            width: 300px;
            height: 300px;
            background: var(--primary-color);
            top: -100px;
            right: -100px;
        }
        
        .shape-2 {
            width: 200px;
            height: 200px;
            background: var(--accent-color);
            bottom: -50px;
            left: -50px;
        }
        
        .login-footer {
  text-align: center;
}

.login-footer a {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s;
}

.login-footer a:hover {
  color: var(--primary-color);
}

.copyright {
  color: #6c757d;
  font-size: 0.85rem;
  opacity: 0.8;
}

        @media (max-width: 768px) {
            .login-container {
                margin: 1rem;
            }
            
            .login-body {
                padding: 1.5rem;
            }
        }

    /* Wave Loader */
    .wave-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 20px;
    }

    .wave-bar {
    width: 3px;
    height: 15px;
    background-color: #e9e9e9;
    border-radius: 4px;
    animation: wave-animation 1.2s ease-in-out infinite;
    }

    .wave-bar:nth-child(1) {
    animation-delay: 0s;
    }
    .wave-bar:nth-child(2) {
    animation-delay: 0.2s;
    }
    .wave-bar:nth-child(3) {
    animation-delay: 0.4s;
    }

    @keyframes wave-animation {
    0%, 100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(0.3);
    }
    }
</style>