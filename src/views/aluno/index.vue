<template>
  <!-- navbar -->
  <navbar />

  <!-- sidebar -->
  <sidebar />

  <div class="main-content p-0" id="mainContent">
    <div class="container-fluid0 px-md-4">
      <!-- Cabeçalho --> 
      <div class="d-flex justify-content-between align-items-center mb-4 mt-3 px-3">
        <div>
          <h4 class="titulo-pagina mb-0">
            <Voltar/> Secretaria/Alunos
          </h4>
        </div>
        <router-link to="/alunos/create">
          <button class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>Novo Aluno
          </button>
        </router-link>
      </div>

      <!-- Barra de Pesquisa -->
       <div class="px-3">
        <div class="card search-card shadow-sm mb-4">
          <div class="card-body py-3">
            <div class="row">
              <div class="col-md-6">
                <form @submit.prevent="buscarAlunos">
                  <div class="mb-0">
                    <label for="search" class="form-label small text-uppercase text-muted fw-bold">Buscar Aluno</label>
                    <div class="input-group">
                      <span class="input-group-text bg-transparent">
                        <i class="fas fa-search text-muted"></i>
                      </span>
                      <input
                        v-model="search"
                        type="text"
                        class="form-control border-start-0"
                        placeholder="Nome ou nº do BI"
                      />
                      <button class="btn btn-primary" type="submit">
                        Buscar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="row">
        <!-- Lista de Alunos -->
        <div class="col-md-4 position-relative">
          <!-- Loader -->
          <div v-if="loading" class="loading-overlay">
            <div class="loader-container">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
              </div>
              <p class="mt-3 text-muted">Carregando alunos...</p>
            </div>
          </div>
        
          <div class="student-list-container py-3">
            <div v-for="item in alunos" :key="item?.id" 
                 class="student-card card mb-3 shadow-sm hover-lift"
                 :class="{ 'selected': alunoSelecionado && alunoSelecionado?.id === item?.id }"
                 @click="detalharAluno(item?.id)">
              <div class="card-body py-3">
                <div class="d-flex0 text-center ">
                  <div class="avatar-circle me-3">
                    {{ getInitials(item?.nome_completo) }}
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold text-truncate mt-2">{{ item?.nome_completo }}</h6>
                    <div class="d-flex justify-content-center text-muted small">
                      <span class="me-2"><i class="fas fa-venus-mars me-1"></i>{{ item?.genero }}</span>
                      <span><i class="fas fa-birthday-cake me-1"></i>{{ calcularIdade(item?.data_nascimento) }} anos</span>
                    </div>
                  </div>
                  <div class="actions mt-2">
                    <button class="btn btn-sm btn-icon" @click.stop="editarAluno(item?.id)">
                      <i class="fas fa-edit text-primary"></i> <strong>Editar</strong>
                    </button>
                    <!-- button class="btn btn-sm btn-icon" @click.stop="excluirAluno(item?.id)">
                      <i class="fas fa-trash text-danger"></i>
                    </button -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginação -->
          <nav v-if="links.length" class="mt-4">
            <ul class="pagination pagination-sm justify-content-center">
              <li
                v-for="link in limitedLinks"
                :key="link.label"
                class="page-item"
                :class="{ 'disabled': !link.url, 'active': link.active }"
              >
                <a href="#" class="page-link" v-html="link.label" @click.prevent="fetchData(link.url)"></a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Perfil do Aluno -->
        <div class="col-md-8">
          <div class="card profile-card h-100 shadow-sm">
            <div class="card-body p-4">
              <div v-if="!alunoSelecionado" class="empty-state text-center py-5">
                <div class="empty-icon mb-4 text-light bg-primary rounded-circle mx-auto" style="display: flex; justify-content: center; align-items: center; width: 150px; height: 150px;">
                  <i class="fas fa-user-graduate fa-3x" style=""></i>
                </div>
                <h5 class="text-muted">Nenhum aluno selecionado</h5>
                <p class="text-muted mb-0">Selecione um aluno da lista para visualizar seus detalhes</p>
              </div>

              <div v-else>
                <!-- Cabeçalho do perfil -->
                <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start position-relative mb-4">
                  <div class="avatar-profile mb-3 mb-md-0 me-md-4">
                    {{ getInitials(alunoSelecionado?.nome_completo) }}
                  </div>
                  <div class="flex-grow-1">
                    <h4 class="mb-2">{{ alunoSelecionado?.nome_completo }}</h4>
                    <div class="d-flex flex-wrap gap-4 mb-2">
                      <div>
                        <small class="text-muted d-block">Gênero</small>
                        <div class="fw-medium">{{ alunoSelecionado?.genero || 'Não informado' }}</div>
                      </div>
                      <div>
                        <small class="text-muted d-block">Nascimento</small>
                        <div class="fw-medium">{{ formatDate(alunoSelecionado?.data_nascimento) || 'Não informado' }}</div>
                      </div>
                      <div>
                        <small class="text-muted d-block">Idade</small>
                        <div class="fw-medium">{{ calcularIdade(alunoSelecionado?.data_nascimento) || 'Não informado' }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="profile-actions">
                    <div class="dropdown">
                      <button class="btn btn-sm btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                        <li><a class="dropdown-item" href="#"><i class="fas fa-file-alt me-2"></i> Declaração</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-file-contract me-2"></i> Termo</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-certificate me-2"></i> Certificado</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <hr>

                <div class="row">
                  <div class="col-md-6">
                    <h5 class="mb-3 section-title"><i class="fas fa-info-circle me-2 text-primary"></i>Informações Pessoais</h5>
                    <div class="info-item mb-3">
                      <small class="text-muted d-block">Bilhete de Identidade</small>
                      <div class="fw-medium">{{ alunoSelecionado?.bi || 'Não informado' }}</div>
                    </div>
                    <div class="info-item mb-3">
                      <small class="text-muted d-block">Email</small>
                      <div class="fw-medium">{{ alunoSelecionado?.email || 'Não informado' }}</div>
                    </div>
                    <div class="info-item mb-3">
                      <small class="text-muted d-block">Telefone</small>
                      <div class="fw-medium">{{ alunoSelecionado?.telefone || 'Não informado' }}</div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <h5 class="mb-3 section-title"><i class="fas fa-school me-2 text-primary"></i>Escolaridade</h5>
                    <div class="info-item mb-3">
                      <small class="text-muted d-block">Turma</small>
                      <div class="fw-medium">{{ alunoSelecionado?.turma || 'Não informado' }}</div>
                    </div>
                    <div class="info-item mb-3">
                      <small class="text-muted d-block">Ano Letivo</small>
                      <div class="fw-medium">{{ alunoSelecionado?.ano_letivo || 'Não informado' }}</div>
                    </div>
                  </div>
                </div>

                <hr>
                
                <h5 class="mb-3 section-title"><i class="fas fa-users me-2 text-primary"></i>Encarregados</h5>

                <div v-if="alunoSelecionado?.encarregados?.length > 0" class="row">
                  <div v-for="(item, index) in alunoSelecionado?.encarregados" :key="index" class="col-md-6 mb-3">
                    <div class="card bg-light">
                      <div class="card-body py-3">
                        <h6 class="card-title mb-1">{{ item?.nome || 'Não Informado' }}</h6>
                        <p class="card-text mb-1 small">
                          <span class="badge bg-secondary">{{ item?.parentesco || 'Não Informado' }}</span>
                        </p>
                        <p class="card-text text-muted small mb-0">
                          <i class="fas fa-phone me-1"></i>{{ item?.telefone || 'Não Informado' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="alert alert-light" role="alert">
                    <i class="fas fa-info-circle me-2"></i>Nenhum encarregado cadastrado
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
    <br><br>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import Voltar from '@/components/voltar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'

export default {
  components: { navbar, sidebar, Voltar },
  data() {
    return {
      alunos: [],
      alunoSelecionado: null,
      links: [],
      search: '',
      currentPage: 1,
      perPage: 10,
      loading: false,
      nao_encotrado: false,
      viewMode: 'grid' // 'grid' ou 'list'
    }
  },
  async created() {
    await this.fetchData(request.alunosListar)
  },
  
  methods: {
    async fetchData(url = request.alunosListar) {
      this.loading = true
      try {
        const resp = await api.listar(url, { 
          search: this.search,
          per_page: this.perPage 
        })
        this.alunos = resp.data
        this.links = resp.links
        this.currentPage = resp.current_page
        this.perPage = resp.per_page
      } catch (error) {
        console.error('Erro ao carregar alunos:', error)
        alert('Erro ao carregar alunos.')
      } finally {
        this.loading = false
      }
    },

    async buscarAlunos() {
      this.loading = true
      this.nao_encotrado = false
      this.alunos = [];

      // if (!this.search) return;
      try {
        const resp = await api.listar(`alunos/search_alunos?query=${this.search}`, { 
          search: this.search,
          per_page: this.perPage 
        })
        this.alunos = resp.data

        this.links = resp.links
        this.currentPage = resp.current_page
        this.perPage = resp.per_page

        if(resp) {
          this.loading = false

          if(this.alunos == 0) {
            this.nao_encotrado = true
          } 
        } 
        
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        this.alunos = [];
      }
    },

    async detalharAluno(id) {
      this.loading = true
      try {
        const response = await api.show(`${request.alunosShow}${id}`)
        this.alunoSelecionado = response
      } catch (error) {
        console.error('Erro ao carregar detalhes do aluno:', error)
        alert('Erro ao carregar detalhes do aluno.')
      } finally {
        this.loading = false
      }
    },

    editarAluno(id) {
      this.$router.push(`/alunos/edit/${id}`)
    },

    async excluirAluno(id) {
      if (confirm('Tem certeza que deseja excluir este aluno?')) {
        this.loading = true
        try {
          
          await api.destroy(`alunos/destroy/${id}`)
          await this.fetchData(request.alunosListar)
          this.alunoSelecionado = null

        } catch (error) {
          console.error('Erro ao excluir aluno:', error)
          alert('Erro ao excluir aluno.')
        } finally {
          this.loading = false
        }
      }
    },

    getInitials(name) {
      if (!name) return ''
      const names = name.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR')
    },

    calcularIdade(dataNascimento) {
      const date = this.formatDate(dataNascimento)
      if (!date) return ''
      const hoje = new Date()
      const nascimento = new Date(date)
      let idade = hoje.getFullYear() - nascimento.getFullYear()
      const mes = hoje.getMonth() - nascimento.getMonth()
      
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
      
      return `${idade+1}`
    }
  },

  computed: {
    limitedLinks() {
      // pega índice da página atual
      const currentIndex = this.links.findIndex(l => l.active)
      if (currentIndex === -1) return this.links

      // pega só 3: anterior, atual e próximo
      return this.links.slice(
        Math.max(currentIndex - 1, 0),
        Math.min(currentIndex + 2, this.links.length)
      )
    }
  }
}
</script>

<style scoped>
/* Estilos gerais */
.main-content {
  padding: 20px;
  /* background-color: #f8f9fa; */
  /* min-height: calc(100vh - 76px); */
}

.page-title {
  font-weight: 600;
  color: #343a40;
}

/* Breadcrumb personalizado */
.breadcrumb {
  padding: 0;
  background: transparent;
  margin-bottom: 0.5rem;
}

.breadcrumb-item a {
  color: #6c757d;
  text-decoration: none;
}

.breadcrumb-item.active {
  color: #495057;
}

/* Cards */
.card {
  border: none;
  border-radius: 0.75rem;
}

.search-card {
  background: #fff;
}

.student-list-container {
  /* max-height: calc(100vh - 300px); */
  overflow-y: auto;
  padding-right: 8px;
}

.student-list-container::-webkit-scrollbar {
  width: 6px;
}

.student-list-container::-webkit-scrollbar-thumb {
  background-color: #c2c2c2;
  border-radius: 10px;
}

.student-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.student-card:hover, .student-card.selected {
  transform: translateY(-2px);
  border-color: #0d6efd;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.student-card.selected {
  background-color: #f0f7ff;
}

/* Avatar circles */
.avatar-circle {
  display: inline-flex;
  width: 48px !important;
  height: 48px;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.avatar-profile {
  width: 80px;
  height: 80px;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
}

/* Ações */
.actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.student-card:hover .actions {
  opacity: 1;
}

.btn-icon {
  padding: 0.25rem 0.5rem;
}

/* Profile card */
.profile-card {
  background: #fff;
}

.section-title {
  color: #495057;
  font-weight: 600;
  font-size: 1.1rem;
}

.info-item {
  padding-left: 0.5rem;
  border-left: 3px solid #e9ecef;
}

.info-item:hover {
  border-left-color: #0d6efd;
}

/* Empty state */
.empty-icon {
  opacity: 0.7;
}

/* Loader */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 0.75rem;
}

.loader-container {
  text-align: center;
}

/* Paginação */
.pagination {
  margin-bottom: 0;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Responsividade */
@media (max-width: 768px) {
  .student-list-container {
    max-height: none;
    margin-bottom: 1.5rem;
  }
  
  .profile-actions {
    position: static;
    margin-top: 1rem;
  }
}
</style>