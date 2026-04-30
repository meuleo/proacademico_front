<template>
  <!-- navbar -->
  <navbar />

  <!-- sidebar -->
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid0">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="titulo-pagina">
          <Voltar/> 
          Direção/Administrativa/Funcionários
        </h4>
      </div>

      <!-- Barra de Pesquisa -->
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="input-group">
            <input
              v-model="search"
              @keyup.enter="fetchData()"
              type="text"
              class="form-control"
              placeholder="Pesquisar por nome..."
            />
            <button class="btn btn-outline-secondary" @click="fetchData()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-6 mb-3 d-flex justify-content-md-end">
          <router-link to="/funcionarios/create">
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Novo
            </button>
          </router-link>
        </div>
      </div>

      <!-- Cards de Funcionários -->
      <div class="card shadow-sm0 border-0">
        <div class="card-body0 p-0 mt-3">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-3 text-muted">Carregando funcionários...</p>
          </div>

          <div v-else-if="funcionarios.length === 0" class="text-center py-5">
            <i class="fas fa-user-slash fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">Nenhum funcionário encontrado</h5>
            <p class="text-muted mb-4">Tente ajustar os filtros de pesquisa ou adicione um novo funcionário</p>
            <router-link to="/funcionarios/create">
              <button class="btn btn-primary">
                <i class="fas fa-plus me-2"></i>Adicionar Funcionário
              </button>
            </router-link>
          </div>

          <div v-else class="row p-0">
            <div v-for="item in funcionariosFiltrados" :key="item.id" class="col-xl-3 col-lg-4 col-md-6 mb-4" :class="{ 'd-none': item?.isPovot }">
              <div class="card funcionario-card shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="avatar-circle">
                      {{ getInitials(item.nome_completo) }}
                    </div>
                    <span :class="['badge', badgeClass(item.situacao)]">
                      <i :class="situacaoIcon(item.situacao)" class="me-1"></i>
                      {{ formatSituacao(item.situacao) }}
                    </span>
                  </div>
                  
                  <h5 class="card-title">{{ item.nome_completo }}</h5>
                  
                  <div class="funcionario-info">
                    <div v-if="item.email" class="info-item mb-2">
                      <i class="fas fa-envelope text-muted me-2"></i>
                      <small class="text-truncate">{{ item.email }}</small>
                    </div>
                    
                    <div v-if="item.telefone" class="info-item mb-2">
                      <i class="fas fa-phone text-muted me-2"></i>
                      <small>{{ item.telefone }}</small>
                    </div>
                    
                    <div class="info-item">
                      <div v-if="item.funcionario_cargos && item.funcionario_cargos.length > 0">
                        <small v-for="(cargo, index) in item.funcionario_cargos" :key="cargo.id" 
                               class="d-block text-truncate">
                         <i class="fas fa-briefcase text-muted me-2"></i> {{ cargo.cargo.nome }}
                        </small>
                      </div>
                      <small v-else class="text-muted">Nenhum cargo</small>
                    </div>
                  </div>
                </div>
                
                <div class="card-footer bg-transparent d-flex justify-content-between">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    title="Editar"
                    @click="editarFuncionario(item.id)"
                  >
                    <i class="fas fa-edit me-1"></i>Editar
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    title="Excluir"
                    @click="excluirFuncionario(item.id)"
                  >
                    <i class="fas fa-trash me-1"></i>Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <nav v-if="links.length > 3" class="mt-4 d-flex justify-content-between align-items-center">
        <div class="text-muted small">
          Mostrando {{ funcionarios.length }} de {{ totalItems }} registros
        </div>
        <ul class="pagination pagination-sm mb-0">
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
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import Voltar from '@/components/voltar.vue'
import * as api from "../../api/api.js"
import * as request from "../../api/request.js"

export default {
  components: { navbar, sidebar, Voltar },

  data() {
    return {
      funcionarios: [], 
      links: [],
      search: '',
      currentPage: 1,
      perPage: 20,
      loading: true,
      filtroSituacao: '',
      totalItems: 0
    }
  },

  async created() {
    await this.fetchData(request.funcionariosListar)
  },

  methods: {
    async fetchData(url = request.funcionariosListar) {
      this.loading = true
      try {
        const params = {
          search: this.search,
          situacao: this.filtroSituacao
        }
        
        const resp = await api.listar(url, params)
        this.funcionarios = resp.data || []
        this.links = resp.links || []
        this.currentPage = resp.current_page || 1
        this.perPage = resp.per_page || 20
        this.totalItems = resp.total || this.funcionarios.length
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        // this.$notify.error('Erro ao carregar funcionários.')
      } finally {
        this.loading = false
      }
    },

    badgeClass(status) {
      if (!status) return 'bg-secondary'
      const s = status.toLowerCase()
      if (s.includes('ativo')) return 'bg-success'
      if (s.includes('inativo')) return 'bg-warning'
      if (s.includes('colaborador')) return 'bg-info'
      return 'bg-secondary'
    },
    
    situacaoIcon(status) {
      if (!status) return 'fas fa-question'
      const s = status.toLowerCase()
      if (s.includes('ativo')) return 'fas fa-check-circle'
      if (s.includes('inativo')) return 'fas fa-times-circle'
      if (s.includes('colaborador')) return 'fas fa-hands-helping'
      return 'fas fa-question'
    },
    
    formatSituacao(status) {
      if (!status) return 'Indefinido'
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    },

    verFuncionario(id) {
      this.$router.push(`/funcionarios/show/${id}`)
    },

    editarFuncionario(id) {
      this.$router.push(`/funcionarios/edit/${id}`)
    },

    async excluirFuncionario(id) {
      if (!confirm('Tem certeza que deseja excluir este funcionário?')) return
      
      try {
        await api.destroy(`${request.funcionariosDestroy}${id}`)
        alert('Funcionário excluído com sucesso!') 
        await this.fetchData(request.funcionariosListar)
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error)
        // this.$notify.error('Erro ao excluir funcionário.')
      }
    },
    
    getInitials(name) {
      if (!name) return 'NN'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    }
  },

  computed: {
    limitedLinks() {
      if (this.links.length <= 5) return this.links
      
      const currentIndex = this.links.findIndex(l => l.active)
      if (currentIndex === -1) return this.links.slice(0, 5)
      
      const start = Math.max(currentIndex - 2, 0)
      const end = Math.min(currentIndex + 3, this.links.length)
      
      return this.links.slice(start, end)
    },
    
    funcionariosFiltrados() {
      if (!this.filtroSituacao) return this.funcionarios
      
      return this.funcionarios.filter(f => 
        f.situacao && f.situacao.toLowerCase().includes(this.filtroSituacao.toLowerCase())
      )
    }
  },
  
  watch: {
    filtroSituacao() {
      this.fetchData(request.funcionariosListar)
    }
  }
}
</script>

<style scoped>
.page-header {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  /* box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); */
}

.page-title {
  font-weight: 600;
  color: #343a40;
}

.breadcrumb {
  padding: 0;
  background: transparent;
  margin-bottom: 0.5rem;
}

.breadcrumb-item a {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item a:hover {
  color: #0d6efd;
}

.breadcrumb-item.active {
  color: #495057;
}

.search-card {
  background: #fff;
}

.funcionario-card {
  border-radius: 0.75rem;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.funcionario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
}

.funcionario-card .card-body {
  flex: 1;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.card-title {
  font-weight: 600;
  color: #343a40;
  margin-bottom: 1rem;
}

.funcionario-info {
  border-top: 1px solid #f1f1f1;
  padding-top: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.badge {
  padding: 0.5em 0.8em;
  border-radius: 0.35rem;
  font-weight: 500;
}

.card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.btn {
  border-radius: 0.35rem;
}

.pagination {
  margin-bottom: 0;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

@media (max-width: 768px) {
  .funcionario-card {
    margin-bottom: 1rem;
  }
  
  .avatar-circle {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }
}
</style>