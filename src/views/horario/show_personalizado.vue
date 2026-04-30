<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h2 class="mb-1">Horário da Turma</h2>
          <p class="mb-0 text-muted" v-if="turma">
            <strong>{{ turma.curso_id }} {{ turma.classe }}º{{ turma.serie }} | {{ turma.turno }} | Ano Letivo: {{ turma.ano_letivo }}</strong>
          </p>
        </div>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <div v-if="loader" class="text-center py-5">
        <!-- <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div> -->
        <Loader_1/>
      </div>

      <div v-else>
        <!-- Tabela 1: Horário sem professores -->
        <div class="card mb-4 shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="fas fa-table me-2"></i>Horário Semanal</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-bordered mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 80px;">Horário</th>
                    <th v-for="dia in diasSemana" :key="dia">{{ dia }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tempo, index) in temposOrdenados" :key="tempo.numero">
                    <td>{{index+1}}º</td>
                    <td>{{ formatarHora(tempo.hora_entrada) }} - {{ formatarHora(tempo.hora_saida) }}</td>
                    <td v-for="dia in diasSemana" :key="dia">
                      <span v-if="getAulaPorDiaETempo(dia, tempo.numero)">
                        {{ getAulaPorDiaETempo(dia, tempo.numero).disciplina.nome }}
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tabela 2: Disciplinas e Professores -->
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="fas fa-chalkboard-teacher me-2"></i>Disciplinas e Professores</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-striped mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 60%;">Disciplina</th>
                    <th>Professor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="disciplina in disciplinasUnicas" :key="disciplina.id">
                    <td>
                      <i :class="`${disciplina.icon || 'fas fa-book'} me-2`"></i>
                      {{ disciplina.nome }}
                    </td>
                    <td>
                      <template v-if="getProfessorDaDisciplina(disciplina.id)">
                        <span class="badge bg-info text-dark">
                          {{ getProfessorDaDisciplina(disciplina.id).nome_completo }}
                        </span>
                      </template>
                      <span v-else class="text-muted">Não atribuído</span>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import Loader_1 from '@/components/loader_1.vue'
import axios from 'axios'

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      diasSemana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      aulas: [],
      turma: null,
      loader: true,
      tempos: []
    }
  },

  async created() {
    await this.carregarHorario()
  },

  computed: {
    disciplinasUnicas() {
      const disciplinas = []
      const ids = new Set()
      
      this.aulas.forEach(aula => {
        if (!ids.has(aula.disciplina.id)) {
          ids.add(aula.disciplina.id)
          disciplinas.push(aula.disciplina)
        }
      })
      
      return disciplinas
    },
    
    temposOrdenados() {
      // Agrupa os tempos por número e pega o primeiro de cada (já que os horários são iguais para o mesmo tempo)
      const temposMap = new Map()
      this.aulas.forEach(aula => {
        if (!temposMap.has(aula.num_tempo)) {
          temposMap.set(aula.num_tempo, {
            numero: aula.num_tempo,
            hora_entrada: aula.hora_entrada,
            hora_saida: aula.hora_saida
          })
        }
      })
      
      // Converte para array e ordena pelo número do tempo
      return Array.from(temposMap.values()).sort((a, b) => a.numero - b.numero)
    }
  },

  methods: {
    async carregarHorario() {
      try {
        // Substitua pela sua chamada API real
        const response = await axios.get('http://localhost:8000/api/horario-turma/1')
        this.aulas = response.data
        if (this.aulas.length > 0) {
          this.turma = this.aulas[0].turma
        }
        this.loader = false
      } catch (error) {
        console.error('Erro ao carregar horário:', error)
        this.$toast.error('Erro ao carregar horário da turma')
        this.loader = false
      }
    },
    
    getAulaPorDiaETempo(dia, tempo) {
      return this.aulas.find(aula => 
        aula.dia_semana === dia && aula.num_tempo === tempo
      )
    },
    
    getProfessorDaDisciplina(disciplinaId) {
      const aula = this.aulas.find(a => a.disciplina.id === disciplinaId)
      return aula ? aula.professor : null
    },
    
    formatarHora(hora) {
      if (!hora) return ''
      // Remove os segundos se existirem
      return hora.slice(0, 5)
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.25rem;
}

.table {
  margin-bottom: 0;
}

.table th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa !important;
}

.table-responsive {
  border-radius: 0 0 8px 8px;
}

.table-bordered thead th {
  border-bottom-width: 1px;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.02);
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .table {
    font-size: 0.9rem;
  }
  
  .card-header h5 {
    font-size: 1.1rem;
  }
}
</style>