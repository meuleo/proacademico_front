<template>

  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-users-class me-2"></i>Turmas</h2>
      </div>

      <!-- Barra de Pesquisa e Filtros -->
      <div class="row mb-4">
        <div class="col-md-4 mb-2 mb-md-0">
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
        <i class="fas fa-building-columns fa-4x text-muted mb-4"></i>
        <h5>Nenhuma turma encontrada</h5>
        <!-- <p class="text-muted text-center">
          <button class="btn btn-sm btn-secondary">Recarregar</button>
        </p> -->
      </div>

      <!-- Grid de Turmas -->
      <div v-else class="row g-4">
  <div
    class="col-12 col-md-6 mb-4"
    v-for="item in turmas"
    :key="item.turma?.id || item.disciplina?.id"
  >
    <div class="card h-100 turma-card">
      <!-- Cabeçalho do Card -->
      <div
        class="card-header d-flex justify-content-between align-items-center"
        :style="{ background: `linear-gradient(135deg, ${getCourseColor(item.turma.curso.abreviatura)} 0%, #3498db 100%)` }"
      >
        <div class="d-flex align-items-center">
          <div>
            <!-- Nome da disciplina ou curso -->
            <p class="m-0 text-white mb-3" style="font-size: 22px;">
              {{ item.turma.curso.nome || '---' }}
            </p>

            <!-- Classe e Série -->
            <span class="badge bg-white text-primary me-2" style="font-size: 17px;">
              {{ item.turma?.curso?.abreviatura || '' }} {{ item.turma?.classe || 'Iniciação' }}ª{{ item.turma?.serie || '---' }}
            </span>

            <!-- Turno e Sala -->
            <small class="text-white" style="font-size: 17px;">
              {{ item.turma?.turno || 'Não informado' }} |
              Sala {{ item.turma?.sala || '---' }}
            </small>
          </div>
        </div>
      </div>

      <!-- Corpo do Card -->
      <div class="card-body">
        <!-- Total de Alunos -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="students-count">
            <div class="avatar-group">
              <div class="avatar-sm">
                <i class="fas fa-user-graduate"></i>
              </div>
              <span class="ms-2 fw-bold">
                {{ item.turma?.total_alunos ?? '---' }} alunos
              </span>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="quick-actions">
          <div class="row g-2">
            <div class="col-6" v-for="action in quickActions" :key="action.id">
              <span
                :to="action.route"
                class="btn btn-action d-flex flex-column align-items-center justify-content-center"
                data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                @click="handleQuickAction(action.id, item)"
              >
                <i :class="action.icon"></i>
                <span>{{ action.label }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rodapé do Card -->
      <div class="card-footer bg-transparent border-top-0 pt-0">
        <div class="mb-3">
                <router-link :to="`/turmas/${item.turma?.id}/alunos`" class="btn btn-outline-primary btn-sm w-100">
                  <i class="fas fa-users me-2"></i>Lista nominal
                </router-link>
              </div>
              <div>
                <router-link :to="`/turmas/${item.turma?.id}/alunos/desempenho`" class="btn btn-outline-primary btn-sm w-100">
                  <i class="fas fa-chart-line me-2"></i>Desempeho da turma
                </router-link>
              </div>
      </div>
    </div>
  </div>
</div>
<br>
      </div>

      <!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style="z-index: 9999 !important;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">{{ titulo_modal }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <strong>Selecione a Disciplina</strong>
        </div>
        <div>
          <div v-for="item in disciplinasTurma" :key="item.id">
            <div class="p-3 my-2" @click="irPara(item)" style="background: #e1e1e1; border-radius: 8px; cursor: pointer;" data-bs-dismiss="modal" aria-label="Close">
              <i :class="item.icon" class="me-2"></i> {{ item.nome }}
            </div>
          </div> 
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Fechar</button>
      </div>
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import Loader_1 from '@/components/loader_1.vue'

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      turmas: [],        // sempre um array
      itemTurmas: [],
      search: '',
      titulo_modal: [],
      url: "", 
      loading: false,
      disciplinasTurma: [], 
      quickActions: [
          // { id: 1, icon: 'fas fa-book-open', label: 'Programa' },
          { id: 2, icon: 'fas fa-clock', label: 'Horário' },
          { id: 3, icon: 'fas fa-clipboard-list', label: 'Mini Pauta' },
          // { id: 4, icon: 'fas fa-book', label: 'Matérias' },
          // { id: 5, icon: 'fas fa-tasks', label: 'Atividades' },
          { id: 6, icon: 'fas fa-bullhorn', label: 'Comunicados' }
        ],
    }
  },

  async created() {
    await this.fetchData()
  },

  methods: {
    getCourseColor(abreviatura) {
      const colors = {
        INF: '#6a11cb',
        ADM: '#11998e',
        MEC: '#f46b45',
        ELE: '#FF416C'
      }
      return colors[abreviatura] || '#3498db'
    },

    async fetchData(url = request.turmasDoProfessorListar) {
      this.loading = true
      try {
        const params = {
          search: this.search || ''
        }

        const resp = await api.listar(url, params)

        // Alguns wrappers retornam { data: ... }, outros já retornam o payload direto.
        const payload = resp?.data ?? resp

        // Se vier paginado (payload.data é array), usa payload.data; se vier lista direta, usa payload.
        this.turmas = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload?.data) ? payload.data : [])

      } catch (error) {
        console.error('Erro ao carregar turmas:', error)
        this.turmas = [] // garante estado consistente
        // alert('Não encotrou turmas.')
      } finally {
        this.loading = false
      }
    },

    handleQuickAction(actionId, turmaItem) {
       this.disciplinasTurma = turmaItem.disciplinas
       this.itemTurmas = turmaItem

      //  alert(JSON.stringify(this.itemTurmas))
       switch (actionId) {
        case 2:
          this.titulo_modal = "Horario do Professor"
          this.url = 'horarios.professor'
          break;
        case 3:
          this.titulo_modal = "Mini Pauta"
          this.url = 'professor.mini.pauta.edit'
          break;
        case 4:
          this.verMaterias(turmaItem)
          break;
        default:
          console.log('Ação não implementada:', actionId);
      }
    },

    irPara(item) {
      this.$router.push({
        name: this.url,
        params: {
          disciplina_id: item.id,
          ano_letivo: this.itemTurmas.turma?.ano_letivo || "sem Ano letivo",
          nome_curso: this.itemTurmas.turma?.curso?.nome || "nd",
          horario_id: 1,
          abreviatura: this.itemTurmas.turma?.curso?.abreviatura || 'nd',
          turma_id: this.itemTurmas.turma?.id || "nd",
          classe: this.itemTurmas.turma?.classe || "nd",
          serie: this.itemTurmas.turma?.serie || "nd",
          sala: this.itemTurmas.turma?.sala || "sem Sala",
          turno: this.itemTurmas.turma?.turno || "nd",
          disciplina_nome: item?.nome || "nd",
          disciplina_abreviatura: item?.abreviatura || "nd"
        }
      });
      
    },
  }
}
</script>

<style scoped>
/* Cards */
.turma-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.turma-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.turma-card .card-header {
  border-bottom: none;
  padding: 1.25rem;
}

.course-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Quick Actions */
.quick-actions {
  margin-top: 1rem;
}

.btn-action {
  height: 80px;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #3498db;
  transition: all 0.2s;
  border: 1px solid #e9ecef;
  padding: 0.5rem;
}

.btn-action:hover {
  background-color: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(74, 108, 247, 0.2);
}

.btn-action i {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.btn-action span {
  font-size: 0.75rem;
  text-align: center;
}

/* Avatar Group */
.avatar-group {
  display: flex;
  align-items: center;
}

.avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e9f0ff;
  color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Badges */
.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

/* Responsividade */
@media (max-width: 768px) {
  .turma-card .card-header {
    padding: 1rem;
  }
  
  .btn-action {
    height: 70px;
  padding: 0.25rem;
  font-size: 0.7rem;
  }
  
  .course-icon {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
}

/* Cores dos cursos */
.course-color-it {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

.course-color-adm {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.course-color-mec {
  background: linear-gradient(135deg, #f46b45 0%, #eea849 100%);
}
</style>