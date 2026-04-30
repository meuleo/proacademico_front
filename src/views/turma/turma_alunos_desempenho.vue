<template>
  <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <div class="main-content px-0" id="mainContent">
    <div class="container-fluid px-0 px-md-4">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4 mt-4 px-3">
        <div>
          <h4>
            <Voltar/>
            Desempenho da Turma
          </h4>
          <p class="page-subtitle mb-1">Ano Letivo: {{ estatisticas
          ?.turma?.ano_letivo || '' }}</p>
          <p class="page-subtitle">
            {{ estatisticas.turma?.curso?.abreviatura ?? '' }}
            {{ estatisticas.turma?.classe ? estatisticas.turma.classe + 'º Classe' : 'Iniciação' }}
            {{ estatisticas.turma?.serie }} | {{ estatisticas.turma?.sala }}
            {{ estatisticas.turma?.turno }}
          </p>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-3">
          <label class="form-label fw-bold">Estatísticas por trimestre</label>
          <select
            class="form-select"
            v-model="filtroTrimestre"
            @change="fetchEstatisticas"
          >
            <option value="all">Todos os trimestres</option>
            <option value="1">1º Trimestre</option>
            <option value="2">2º Trimestre</option>
            <option value="3">3º Trimestre</option>
          </select>
        </div>
      </div>

      <!-- Estatísticas Gerais -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary">
            <div class="stat-value">{{ estatisticas.total_alunos }}</div>
            <div class="stat-label text-white">Alunos</div>
            <i class="stat-icon fas fa-users"></i>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success">
            <div class="stat-value">{{estatisticas.media_geral_turma}}</div>
            <div class="stat-label text-white">Média Geral</div>
            <i class="stat-icon fas fa-chart-line"></i>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning">
            <div class="stat-value">{{ estatisticas.percentual_desempenho_turma }}%</div>
            <div class="stat-label text-dark">Desempenho</div>
            <!-- i class="stat-icon fas fa-check-circle"></i -->
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info">
            <div class="stat-value">{{ estatisticas.total_disciplinas }}</div>
            <div class="stat-label text-white">Disciplinas</div>
            <i class="stat-icon fas fa-book"></i>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="p-3 shadow Regular text-success" style="font-size: 20px;">
            Médias Positivas: {{ estatisticas.total_positivas}}
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 shadow Regular text-danger" style="font-size: 20px;">
            Médias Negativas: {{ estatisticas.total_negativas }}
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 shadow Regular text-secondary" style="font-size: 20px;">
            Não avaliados: {{ estatisticas.total_alunos-(estatisticas.total_positivas+estatisticas.total_negativas) }}
          </div>
        </div>
      </div>

      <div class="px-2">
        <!-- Gráfico de Desempenho -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title"><i class="fas fa-chart-bar me-2"></i>Desempenho por Disciplina</h5>
            <div class="performance-chart">
              <canvas ref="performanceChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Lista de Alunos -->
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title m-0"><i class="fas fa-user-graduate me-2"></i>Classificação</h5>
              <div class="input-group search-box">
                <input
                  v-model="search"
                  type="text"
                  class="form-control"
                  placeholder="Pesquisar aluno..."
                />
                <button class="btn btn-search">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Média Geral</th>
                    <th>Desempenho</th>
                    <th>Status</th>
                    <th class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(aluno, index) in filteredAlunos" :key="aluno.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar-sm me-3">{{ aluno.nome.charAt(0) }}</div>
                        {{ aluno.nome }}
                      </div>
                    </td>
                    <td>{{ aluno.mediaGeral.toFixed(1) }}</td>
                    <td>
                      <div class="progress" style="height: 20px;">
                        <div 
                          class="progress-bar" 
                          :class="getPerformanceClass(aluno.mediaGeral)"
                          :style="{ width: (aluno.mediaGeral * 10) + '%' }"
                        >
                          {{ aluno.mediaGeral.toFixed(1) }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusClass(aluno.mediaGeral)">
                        {{ getStatusText(aluno.mediaGeral) }}
                      </span>
                    </td>
                    <td class="text-end">
                      <button 
                        class="btn btn-sm btn-primary"
                        data-bs-toggle="modal" 
                        data-bs-target="#studentModal"
                        @click="setSelectedStudent(aluno)"
                      >
                        <i class="fas fa-eye me-1"></i> Detalhes
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Desempenho do Aluno -->
    <div class="modal fade" id="studentModal" tabindex="-1" aria-labelledby="studentModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="studentModalLabel">
              <i class="fas fa-user-graduate me-2"></i>
              {{ selectedStudent ? selectedStudent.nome : '' }} - Desempenho Acadêmico
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedStudent">
            <div class="row mb-4">
              <div class="col-md-4">
                <div class="info-card">
                  <div class="info-label">Média Geral</div>
                  <div class="info-value">{{ selectedStudent.mediaGeral?.toFixed(1) || '--' }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-card">
                  <div class="info-label">Posição na Turma</div>
                  <div class="info-value">{{ selectedStudent.posicao || '--' }}º</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-card">
                  <div class="info-label">Status</div>
                  <div class="info-value">
                    <span class="badge" :class="getStatusClass(selectedStudent.mediaGeral)">
                      {{ getStatusText(selectedStudent.mediaGeral) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h5 class="mb-3"><i class="fas fa-book me-2"></i>Desempenho por Disciplina</h5>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>1º Trim</th>
                    <th>2º Trim</th>
                    <th>3º Trim</th>
                    <th>Média</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="disciplina in selectedStudent.disciplinas" :key="disciplina.id">
                    <td>{{ disciplina.nome }}</td>
                    <td>{{ disciplina.notas[0] }}</td>
                    <td>{{ disciplina.notas[1] }}</td>
                    <td>{{ disciplina.notas[2] }}</td>
                    <td>
                      <strong>{{ calcularMedia(disciplina.notas).toFixed(1) }}</strong>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusClass(calcularMedia(disciplina.notas))">
                        {{ getStatusText(calcularMedia(disciplina.notas)) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-primary">
              <i class="fas fa-print me-2"></i>Imprimir Relatório
            </button>
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
import Voltar from '@/components/voltar.vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  components: { navbar, sidebar, Voltar },
  data() {
    return {
      turmaId: null,
      trimestre: 1,              // 1 | 2 | 3
      trimestresAvaliados: 1,    // 1 | 2 | 3
      alunosSelecionados: [],    // ids dos alunos
      boletim: {},
      alunos: [],
      disciplinas: [],
      mediasPorDisciplina: {},
      mediaGeralTurma: null,
      percentagemTurma: null,
      totalAlunos: 0,
      totalDisciplinas: 0,
      estatisticas: null,
      classChart: null,
      studentChart: null,
      estatisticas: {},
      filtroTrimestre: 'all', // 👈 valor inicial = TODOS
      loading: false,
      search: '',
      selectedStudent: null,
      alunos: [
        {
          id: 1,
          nome: 'Ana Silva',
          mediaGeral: 8.5,
          posicao: 1,
          disciplinas: [
            { id: 1, nome: 'Matemática', notas: [9.0, 8.5, 8.0] },
            { id: 2, nome: 'Português', notas: [8.0, 9.0, 8.5] },
            { id: 3, nome: 'Física', notas: [8.5, 9.0, 8.0] },
            { id: 4, nome: 'Química', notas: [9.0, 8.5, 9.0] },
            { id: 5, nome: 'Biologia', notas: [8.0, 8.5, 9.0] }
          ]
        },
        {
          id: 2,
          nome: 'Bruno Costa',
          mediaGeral: 7.8,
          posicao: 2,
          disciplinas: [
            { id: 1, nome: 'Matemática', notas: [8.0, 7.5, 8.0] },
            { id: 2, nome: 'Português', notas: [7.5, 8.0, 7.0] },
            { id: 3, nome: 'Física', notas: [8.0, 7.5, 8.5] },
            { id: 4, nome: 'Química', notas: [7.5, 8.0, 8.0] },
            { id: 5, nome: 'Biologia', notas: [8.0, 7.5, 7.0] }
          ]
        },
        {
          id: 3,
          nome: 'Carla Mendes',
          mediaGeral: 6.3,
          posicao: 12,
          disciplinas: [
            { id: 1, nome: 'Matemática', notas: [6.0, 7.0, 6.5] },
            { id: 2, nome: 'Português', notas: [5.5, 6.0, 7.0] },
            { id: 3, nome: 'Física', notas: [6.5, 5.0, 7.0] },
            { id: 4, nome: 'Química', notas: [6.0, 7.0, 6.5] },
            { id: 5, nome: 'Biologia', notas: [7.0, 6.5, 5.0] }
          ]
        },
        {
          id: 4,
          nome: 'Daniel Oliveira',
          mediaGeral: 5.2,
          posicao: 20,
          disciplinas: [
            { id: 1, nome: 'Matemática', notas: [5.0, 4.5, 6.0] },
            { id: 2, nome: 'Português', notas: [6.0, 5.5, 4.0] },
            { id: 3, nome: 'Física', notas: [5.5, 6.0, 5.0] },
            { id: 4, nome: 'Química', notas: [4.0, 5.5, 6.0] },
            { id: 5, nome: 'Biologia', notas: [5.0, 4.5, 6.0] }
          ]
        }
      ],
      alunos: [],
      studentChart: null,
    }
  },
  computed: {
    filteredAlunos() {
      return this.alunos.filter(aluno => 
        aluno.nome.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  mounted() {
    this.fetchEstatisticas()
  },
  watch: {
    estatisticas(newVal) {
      if (newVal) {
        this.renderClassChart()
      }
    }
  },
  methods: {
    async fetchEstatisticas() {
      try {
        this.loading = true

        const turmaId = this.$route.params.turma_id
        const filtroTrimestre = this.filtroTrimestre // 1,2,3 ou null

        // Se quiser "Todos", envia null ou não envia
        const url = filtroTrimestre
          ? `turmas-estatisticas/${turmaId}/${filtroTrimestre}`
          : `turmas-estatisticas/${turmaId}`

        const resp = await api.listar(url)
        this.estatisticas = resp

        this.alunos = estatisticas.alunos

      } catch (error) {
        console.error('Erro ao carregar estatísticas', error)
      } finally {
        this.loading = false
      }
    },
    setSelectedStudent(aluno) {
      this.selectedStudent = JSON.parse(JSON.stringify(aluno))
      this.$nextTick(() => {
        this.renderStudentChart()
      })
    },
    renderClassChart() {
      if (!this.$refs.performanceChart || !this.estatisticas) return

      const ctx = this.$refs.performanceChart.getContext('2d')

      // destrói se já existir para não sobrepor
      if (this.classChart) this.classChart.destroy()

      const medias = this.estatisticas.medias_por_disciplina || {}

      this.classChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(medias), // usa labels da API
          datasets: [{
            label: 'Desempenho por Disciplina (%)',
            data: Object.values(medias),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%'; // adiciona o símbolo de percentual
                }
              }
            }
          }
        }
      })
    },
    renderStudentChart() {
      if (this.$refs.studentChart) {
        const ctx = this.$refs.studentChart.getContext('2d')
        
        if (this.studentChart) {
          this.studentChart.destroy()
        }
        
        this.studentChart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: this.selectedStudent.disciplinas.map(d => d.nome),
            datasets: [{
              label: 'Notas por Trimestre',
              data: this.selectedStudent.disciplinas.map(d => this.calcularMedia(d.notas)),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
            }]
          },
          options: {
            responsive: true,
            scales: {
              r: {
                angleLines: { display: true },
                suggestedMin: 0,
                suggestedMax: 20 // caso a média do aluno seja de 0 a 20
              }
            }
          }
        })
      }
    },
    calcularMedia(notas) {
      return notas.reduce((a, b) => a + b, 0) / notas.length
    },
    getPerformanceClass(media) {
      if (media >= 8) return 'bg-success'
      if (media >= 6) return 'bg-primary'
      if (media >= 5) return 'bg-warning'
      return 'bg-danger'
    },
    getStatusClass(media) {
      if (media >= 8) return 'bg-success'
      if (media >= 6) return 'bg-primary'
      if (media >= 5) return 'bg-warning'
      return 'bg-danger'
    },
    getStatusText(media) {
      if (media >= 8) return 'Excelente'
      if (media >= 6) return 'Bom'
      if (media >= 5) return 'Regular'
      return 'Preocupante'
    }
  }
}
</script>

<style scoped>
/* Estilos gerais */
.page-title {
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: var(--text-light);
  font-size: 0.9rem;
}

.btn-back {
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  padding: 8px 16px;
  color: var(--text-color);
  transition: all 0.3s;
}

.btn-back:hover {
  background-color: #f0f0f0;
  transform: translateX(-2px);
}

/* Cards de estatísticas */
.stat-card {
  border-radius: var(--border-radius);
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  height: 120px;
  box-shadow: var(--card-shadow);
}

.stat-card.bg-primary { background-color: var(--primary-color); }
.stat-card.bg-success { background-color: var(--success-color); }
.stat-card.bg-warning { background-color: var(--warning-color); color: #212529; }
.stat-card.bg-info { background-color: var(--info-color); }
.stat-card.bg-danger { background-color: var(--danger-color); }

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

.stat-icon {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  font-size: 3rem;
  opacity: 0.2;
}

/* Tabela de alunos */
.table {
  margin-bottom: 0;
}

.avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.progress {
  border-radius: 10px;
  background-color: #f0f0f0;
}

.progress-bar {
  border-radius: 10px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal */
.modal-content {
  border-radius: var(--border-radius);
  border: none;
}

.modal-header {
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  color: var(--text-color);
  font-weight: 600;
}

.info-card {
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
  padding: 1rem;
  text-align: center;
}

.info-label {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

/* Gráficos */
.performance-chart, .student-chart {
  height: 300px;
  margin-top: 1rem;
}

/* Search box */
.search-box {
  max-width: 300px;
}

.btn-search {
  background-color: var(--primary-color);
  color: white;
}

.btn-search:hover {
  background-color: var(--secondary-color);
}

/* Responsividade */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .search-box {
    max-width: 100%;
    margin-top: 1rem;
  }
}
</style>