<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <Voltar/> 
          Secretaria/Turmas
        </h4>
      </div>

      <!-- Barra de Pesquisa e Filtros -->
      <div class="row m-0 p-0 mb-4">
        <div class="col-md-12 m-0 p-0 mb-2 mb-md-0">
          <div class="input-group">
            <input
              v-model="search"
              @keyup.enter="fetchData()"
              type="text"
              class="form-control"
              placeholder="Pesquisar por classe, série, curso..."
            />
            <button class="btn btn-outline-secondary" @click="fetchData()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="position-relative">
      <!-- Loader -->
      <div v-if="loading">
        <Loader_1/>  
      </div>

      <!-- Mensagem quando não há turmas -->
      <div v-if="!loading && turmas.length === 0" class="empty-state text-center py-5">
        <i class="fas fa-users-slash fa-4x text-muted mb-4"></i>
        <h5>Nenhuma turma encontrada</h5>
        <p class="text-muted">Clique em "Nova Turma" para adicionar uma turma</p>
      </div>

      <!-- Grid de Turmas -->
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        <div class="col" v-for="turma in turmas" :key="turma.id">
          <div class="card h-100 turma-card">
            <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
              <h5 class="m-0">
                
                <span v-if="turma.curso" class="badge bg-warning me-2" style="color: #444;">{{ turma.curso.abreviatura || "---" }}</span>

                <span v-if="turma.classe">
                  {{ turma.classe > 9 ? turma.classe + 'ª' : turma.classe + 'ª Classe'  }} {{ turma.serie }}
                </span>
                <span v-else>
                  Iniciação {{ turma.serie }}
                </span>
              </h5>
              <div class="dropdown">
                <button class="btn btn-sm btn-outline-white dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li v-if="!turma.classe" class="mb-3">
                    <router-link to="#" style="color: #000; text-decoration: none;" @click="atribuirAluno(turma)">
                      <i class="fas fa-chalkboard-teacher ms-3"></i> Professor
                    </router-link>
                  </li>

                  <li v-else class="mb-3">
                    <router-link :to="`/horarios/${turma.id}`" style="color: #000; text-decoration: none;" @click="verHorario(turma)">
                      <i class="fas fa-calendar-alt ms-3"></i> Horário
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-3">
                <div>
                  <small class="text-muted">Turno</small>
                  <div class="fw-bold">{{ turma.turno || 'Não informado' }}</div>
                </div>
                <div>
                  <small class="text-muted">Sala</small>
                  <div class="fw-bold">{{ turma.sala || 'Não informada' }}</div>
                </div>
              </div>
              
              <div class="mb-3">
                <small class="text-muted">Ano Letivo</small>
                <div class="fw-bold">{{ turma.ano_letivo || 'Não informado' }}</div>
              </div>

              <hr>

              <div class="d-flex justify-content-between small">
                <span>{{ turma.total_alunos || 0 }} alunos</span>
              </div>
            </div>
            <div class="card-footer bg-white">
              <div class="mb-3">
                <router-link :to="`/turmas/${turma.id}/alunos`" class="btn btn-outline-primary btn-sm w-100">
                  <i class="fas fa-users me-2"></i>Listar nominal
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- Paginação -->
      <nav v-if="links.length > 3" class="mt-4">
        <ul class="pagination justify-content-center0">
          <li
            v-for="link in links"
            :key="link.label"
            class="page-item"
            :class="{ disabled: !link.url, active: link.active }"
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
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import Loader_1 from '@/components/loader_1.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  components: { navbar, sidebar, Loader_1, Voltar },

  data() {
    return {
      turmas: [],
      links: [],
      search: '',
      currentPage: 1,
      perPage: 10,
      loading: false,
      anoLetivoFilter: '',
      anosLetivos: ['2023/2024', '2024/2025', '2025/2026'],
    }
  },

  async created() {
    await this.fetchData()
    this.anoLetivoFilter = this.$store.state?.ano_letivo
  },

  methods: {
    async fetchData(url = request.turmasListar) {
      this.loading = true
      try {
        const params = {
          search: this.search,
          per_page: this.perPage,
          ano_letivo: this.anoLetivoFilter
        }
        
        const resp = await api.listar(url, params)
        this.turmas = resp.data
        this.links = resp.links || []
        this.currentPage = resp.current_page || 1
        this.perPage = resp.per_page || 10
      } catch (error) {
        console.error('Erro ao carregar turmas:', error)
        // alert('Erro ao carregar turmas.')
      } finally {
        this.loading = false
      }
    },

    async confirmarExclusao(id) {
      if (confirm('Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.')) {
        this.loading = true
        try {
          await api.destroy(`${request.turmasDestroy}${id}`)
          toast.success('Turma excluída com sucesso!')
          await this.fetchData()
        } catch (error) {
          console.error('Erro ao excluir turma:', error)
          toast.error('Erro ao excluir turma. Verifique se não há alunos vinculados.')
        } finally {
          this.loading = false
        }
      }
    },

    atribuirAluno(item) {
      const param = (v, fallback = 'nd') => (v === undefined || v === null || v === '' ? fallback : String(v))

      const ano_letivo  = param(item.ano_letivo, 'nd')
      const turma_id    = param(item.id, '0')
      const sala        = param(item?.sala, 'sem-sala')
      const classe      = param(item?.classe, 'nd')
      const serie       = param(item?.serie, 'nd')
      const turno       = param(item?.turno, 'nd')

      this.$router.push({
        name: 'atribuir.professor.create',
        params: { ano_letivo, turma_id, classe, serie, sala, turno }
      })
    },

    verHorario(item) {
      const param = (v, fallback = 'nd') => 
        (v === undefined || v === null || v === '' ? fallback : String(v))

        const ano_letivo   = param(item.ano_letivo, 'nd')
        const nome_curso   = param(item?.curso?.nome, 'nd')
        const horario_id   = param(item?.horario_id, '0')
        const abreviatura  = param(item?.curso?.abreviatura, 'nd')
        const turma_id     = param(item.id, '0')
        const classe       = param(item?.classe, 'nd')
        const serie        = param(item?.serie, 'nd')
        const sala         = param(item?.sala, 'sem-sala')
        const turno        = param(item?.turno, 'nd')

        this.$router.push({
          name: 'horarios.show',
          params: { 
            ano_letivo, 
            nome_curso, 
            horario_id, 
            abreviatura, 
            turma_id, 
            classe, 
            serie, 
            sala, 
            turno 
          }
        })
      }
    }
  }
</script>

<style scoped>
/* Cards */
.turma-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 10px;
  overflow: hidden;
}

.turma-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.turma-card .card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

.turma-card .card-body {
  padding: 1.25rem;
}

.turma-card .card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

/* Estado vazio */
.empty-state {
  color: #6c757d;
  width: 100%;
}

/* Progress bar */
.progress {
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

/* Responsividade */
@media (max-width: 768px) {
  .card-header h5 {
    font-size: 1rem;
  }
  
  .dropdown-menu {
    position: absolute !important;
  }
}

.pagination .page-link {
  cursor: pointer;
}

.btn-outline-white {
  border: 1px solid #f9f9f9 !important;
  color: #f9f9f9 !important;
}

</style>