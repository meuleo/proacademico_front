<template>
  <!-- navbar -->
  <navbar/>

  <!-- sidebar -->
  <sidebar/>

  <div class="main-content" id="mainContent">
    <div class="container-fluid0">
      <div class="mb-3 p-3 text-muted">
        <!-- span class="ms-1">
          {{ saudacao() }} {{ helloUser() }} <strong>{{ $store.state.usuario.name.split(' ')[0] }}</strong>, <br>
          <i>Desejo um bom trabalho!</i> 😊
        </span -->
        <div class="perfil-container">
            <img src="/assets/images/logo_saopio.jpg" class="perfil-img" alt="Logo">
            <div>
              <h5 class="mb-1">Escola São Pio da Pietrelcina</h5>  
              <p class="mb-0">
                Usuário: {{helloUser()}} {{$store.state.usuario.name.split(' ')[0]}}
                <span class="bg-success" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%;"></span>
              </p>
            </div>
            

        </div>

      </div>

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center px-3 mb-4">
        <h4>Painel Geral</h4>
        <div class="text-muted">{{ formatarData(new Date()) }}</div>
      </div>

      <!-- Cards Resumo PROFESSOR -->
      <div v-if="regra_usuario == 'professor'" class="row mb-4">
        <div class="col-lg-4 col-md-6 mb-3">
          <router-link to="/professor/area/turmas" class="router-link text-white small d-block mt-2">
          <div class="card bg-light-blue text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title">Turmas</h5>
                  <h2 class="mb-0 invisible">--</h2>
                </div>
                <i class="fas fa-layer-group fa-3x opacity-50"></i>
              </div>
                Ver turmas <i class="fas fa-arrow-right ms-1"></i>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-lg-4 col-md-6 mb-3">
          <router-link to="#" class="text-dark router-link small d-block mt-2">
            <div class="card bg-light-orange text-dark h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title">Solicitações</h5>
                    <h2 class="mb-0 invisible">--</h2>
                  </div>
                  <i class="fas fa-hand fa-3x opacity-50"></i>
                </div>
                  Ver solicitações <i class="fas fa-arrow-right ms-1"></i>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-lg-4 col-md-6 mb-3">
          <router-link to="#" class="text-white router-link small d-block mt-2">
            <div class="card bg-light-purple text-white h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title">Calendário</h5>
                    <h2 class="mb-0 invisible">--</h2>
                  </div>
                  <i class="fas fa-calendar-alt fa-3x opacity-50"></i>
                </div>
                  Ver calendário <i class="fas fa-arrow-right ms-1"></i>
              </div>
            </div>
          </router-link>
        </div>

        
      </div>

      <!-- ###################################### -->
      <!-- ###################################### -->
      <!-- ###################################### -->
      <!-- ###################################### -->

      <!-- Cards Resumo GERAL -->
      <div v-else class="row m-0 p-0 mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card bg-light-blue text-white h-100">
            <router-link to="/alunos" class="router-link text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title">Alunos</h5>
                  <h2 class="mb-0">
                    {{ dashboard.alunos || '--' }}
                  </h2>
                </div>
                <i class="fas fa-users fa-3x opacity-50"></i>
              </div>
                Ver alunos <i class="fas fa-arrow-right ms-1"></i>
            </div>
          </router-link>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card bg-light-green text-white h-100">
            <router-link to="#" class="router-link text-white small d-block mt-2">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title">Turmas</h5>
                  <h2 class="mb-0">
                    {{ dashboard.turmas || '--' }}
                  </h2>
                </div>
                <i class="fas fa-layer-group fa-3x opacity-50"></i>
              </div>
                Ver turmas <i class="fas fa-arrow-right ms-1"></i>
              </div>
            </router-link>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card bg-light-orange text-dark h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title">Solicitações</h5>
                  <h2 class="mb-0">--</h2>
                </div>
                <i class="fas fa-hand fa-3x opacity-50"></i>
              </div>
              <router-link to="#" class="text-dark router-link small d-block mt-2">
                Ver todas <i class="fas fa-arrow-right ms-1"></i>
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card bg-light-purple text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title">Calendário</h5>
                  <h2 class="mb-0">--</h2>
                </div>
                <i class="fas fa-calendar-alt fa-3x opacity-50"></i>
              </div>
              <router-link to="#" class="text-white small d-block mt-2">
                Ver eventos <i class="fas fa-arrow-right ms-1"></i>
              </router-link>
            </div>
          </div>
        </div>

        
      </div>

      <!-- Comunicados -->
      <!-- ###################################### -->
      <!-- ###################################### -->
      <!-- ###################################### -->
      <!-- ###################################### -->

      <!-- Duas colunas principais -->
      <div class="row">
        <!-- Coluna esquerda - Avisos -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="fas fa-info-circle mt-1 me-3"></i>Comunicados</h5>
              <!-- <button class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-bell"></i>
              </button> -->
            </div>
            <div class="card-body">
              <!-- div class="alert alert-info">
                <div>
                  <strong>Reunião pedagógica</strong>
                  <p class="mb-0">Dia 25/05 às 14h na sala dos professores</p>
                </div>
              </div -->

                <div class="d-flex justify-content-center align-items-center h-100">
                  <div class="text-muted text-center">
                    <div>
                      <i class="fas fa-bullhorn"></i> Nenhum comunicado disponível
                    </div>
                  </div>
                </div>
                

              <!-- div>
                <router-link to="#" class="text-dark small d-block mt-2">
                  Ver todos <i class="fas fa-arrow-right ms-1"></i>
                </router-link>
              </div -->
            </div>
          </div>
        </div>

        <!-- Coluna direita - Atalhos -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-white">
              <h5 class="mb-0"><i class="fas fa-exclamation-triangle mt-1 me-3"></i> Atalhos</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6 mb-3" v-for="(atalho, index) in atalhos" :key="index">
                  <router-link :to="atalho.rota" class="btn btn-outline-secondary w-100 h-100 py-3">
                    <div>
                      <i :class="`fas fa-${atalho.icone} fa-2x mb-2`"></i>
                      <p class="mb-0">{{ atalho.titulo }}</p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendário simplificado -->
      <!-- <div class="row mt-3">
        Quadro de Honra
      </div> -->
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../api/api.js'

export default {
  components: { navbar, sidebar },

  data() {
    return {
      atalhos: [
        { titulo: 'Comunicados',       icone: 'bullhorn',       rota: '#' }, // megafone
        { titulo: 'Solicitações',      icone: 'hand-paper', rota: '#' }, // pedido/documento
        // { titulo: 'Prog. Curriculares',icone: 'book-open',      rota: '#' }, // livros abertos
        { titulo: 'Mini Pautas',       icone: 'file-alt',       rota: '#' }, // documento simples
        { titulo: 'Pautas',            icone: 'clipboard-list', rota: '#' }, // pauta/listagem
        // { titulo: 'Perfil',            icone: 'user-circle',    rota: '#' }  // perfil/usuário
      ],
      dashboard: [],
      regra_usuario: "",
    }
  },

  async created() {
    if(sessionStorage.getItem('regra')) {
      this.regra_usuario = sessionStorage.getItem('regra')

    }

    try {
       this.dashboard = await api.listar('dashboard-totais')

    } catch (error) {
      console.log("Erro ao Carregar dados da Dashboard")

    }

  },

  methods: {
    helloUser() {
      const regra = sessionStorage.getItem('regra')
      if (!regra) return ''

      const genero = this.$store.state.usuario.genero

      const cargos = {
        director_geral: 'Director',
        director_pedagogico: 'Director',
        director_administrativo: 'Director',
        secretario_geral: 'Secretário',
        secretario_pedagogico: 'Secretário',
        secretario_administrativo: 'Secretário',
        secretario: 'Secretário',
        professor: 'Professor'
      }

      let cargo = cargos[regra] || ''

      // Ajuste para feminino
      if (genero !== 'masculino') {
        if (cargo === 'Director') cargo = 'Directora'
        else if (cargo === 'Secretário') cargo = 'Secretária'
        else if (cargo === 'Professor') cargo = 'Professora'
      }

      return cargo
    },

    saudacao() {
      const hora = new Date().getHours()

      if (hora >= 5 && hora < 12) {
        return "Bom dia"
      } else if (hora >= 12 && hora < 18) {
        return "Boa tarde"
      } else {
        return "Boa noite"
      }
    },

    formatarData(data) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric' 
      }
      return data.toLocaleDateString('pt-BR', options)
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: transform 0.2s;
  border: none;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #f8f9fa;
}

.bg-light-blue {
  background-color: #4285f4;
}

.bg-light-green {
  background-color: #34a853;
}

.bg-light-purple {
  background-color: #9c27b0;
}

.bg-light-orange {
  background-color: #ff9800;
}

.alert {
  border-left: 4px solid transparent;
  border-radius: 0.25rem;
}

.alert-info {
  border-left-color: #17a2b8;
}

.alert-warning {
  border-left-color: #ffc107;
}

.alert-success {
  border-left-color: #28a745;
}

.table th {
  border-top: none;
  border-bottom: 1px solid #dee2e6;
}

.btn-outline-secondary {
  transition: all 0.3s;
}

.btn-outline-secondary:hover {
  background-color: #3498db;
  transform: translateY(-2px);
}

/* Logo com titulo do lado*/
.perfil-container {
    display: flex;
    align-items: center;        /* Alinha verticalmente */
    gap: 10px;                  /* Espaço entre img e texto */
}

.perfil-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;         /* Deixa redondo */
    object-fit: cover;          /* Evita distorção */
    background: #f0f0f0;
}

</style>