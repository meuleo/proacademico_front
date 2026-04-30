<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h2 class="mb-1"><i class="fas fa-calendar-alt me-2"></i>Horário</h2>
          <p class="mb-0 text-muted" v-show="params.abreviatura">
            <strong>{{params.abreviatura}} {{params.classe}}ª {{params.serie}} | {{params.turno}} | Ano Letivo: {{params.ano_letivo}}</strong>
          </p>
        </div>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <div v-if="loader">
        <Loader_1/>
      </div>

      <div v-else  class="form-container bg-white p-3 p-md-4 rounded shadow-sm">
  <form @submit.prevent="submitForm">
    <!-- Controles -->
      <div class="row mb-3">
        <div class="col-md-4 mb-3">
          <label class="form-label">Intervalo entre aulas (minutos)</label>
          <input
            type="number"
            v-model="intervaloMinutos"
            min="0"
            max="30"
            class="form-control"
            @change="aplicarIntervalo"
          >
        </div>

        <div class="col-md-4 mb-3">
          <div class="form-check form-switch mt-4">
            <input class="form-check-input" type="checkbox" id="autoPreencher" v-model="autoPreencherHorarios">
            <label class="form-check-label" for="autoPreencher">Preencher horas automaticamente</label>
          </div>
        </div>
      </div>

    <!-- Tabela de Horário -->
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th style="width: 50px;">Tempo</th>
            <th style="min-width: 120px;">Horário</th>
            <th v-for="dia in diasSemana" :key="dia" style="min-width: 150px;">{{ dia }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(tempo, index) in tempos" :key="tempo.numero">
            <!-- Linha separadora antes do 7º tempo -->
            <tr v-if="index === 6" class="separator-row">
              <td :colspan="2 + diasSemana.length">
                <div class="text-center p-3">
                  Ed. Física
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <span v-if="tempo.numero == 7">
                  1º
                </span>
                <span v-else-if="tempo.numero == 8">
                  2º
                </span>
                <span v-else>
                  {{ tempo.numero }}º
                </span>
              </td>
              <td>
                <div class="d-flex flex-column flex-md-row gap-1">
                  <!-- REMOVIDO o disabled: os campos de hora estão sempre editáveis -->
                  <input
                    type="time"
                    v-model="tempo.entrada"
                    class="form-control form-control-sm"
                    @change="atualizarHorarios(index)"
                  >
                  <input
                    type="time"
                    v-model="tempo.saida"
                    class="form-control form-control-sm"
                    @change="atualizarHorarios(index)"
                  >
                </div>
              </td>

              <td v-for="dia in diasSemana" :key="dia">
                <div class="position-relative" v-if="horario[tempo.numero] && horario[tempo.numero][dia]">
                  <select
                    v-model="horario[tempo.numero][dia].disciplina"
                    class="form-select form-select-sm"
                    @change="selecionarDisciplina(tempo.numero, dia)"
                  >
                    <option value=""></option>
                    <option
                      v-for="disciplina in disciplinas"
                      :key="disciplina.id"
                      :value="disciplina.id"
                    >
                      {{ disciplina.nome }}
                    </option>
                  </select>

                  <!-- Popup de Professores -->
                  <div
                    v-if="mostrarProfessores === `${tempo.numero}-${dia}`"
                    class="professor-popup p-2 border shadow-sm rounded bg-white"
                  >
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <small class="fw-bold">Selecione o professor:</small>
                      <button
                        type="button"
                        class="btn-close btn-sm me-2"
                        @click="mostrarProfessores = null"
                      ></button>
                    </div>
                    <div class="list-group">
                      <div>
                        <button
                          type="button"
                          class="list-group-item list-group-item-action py-1"
                          @click="selecionarProfessor(tempo.numero, dia)"
                        >
                         Sem Professor
                        </button>
                      </div>
                      <div>
                        <button
                          v-for="professor in professoresPorDisciplina[horario[tempo.numero][dia].disciplina] || []"
                          :key="professor.id"
                          type="button"
                          class="list-group-item list-group-item-action py-1"
                          @click="selecionarProfessor(tempo.numero, dia, professor)"
                        >
                          {{ professor.nome }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Professor selecionado -->
                  <div
                    v-if="horario[tempo.numero][dia].professor"
                    class="mt-1 d-flex align-items-center"
                  >
                    <span class="badge bg-info text-dark me-1">
                      {{ horario[tempo.numero][dia].professor.nome }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Botões -->
    <div class="d-flex justify-content-between mt-4">
      <button type="button" class="btn btn-outline-secondary" @click="resetarHorario">
        <i class="fas fa-redo me-2"></i>Limpar
      </button>
      <div>
        <button type="button" class="btn btn-outline-success me-2" @click="modelarHorario">
          <i class="fas fa-eye me-2"></i>Visualizar
        </button>
         <LoaderBtnGuardar v-if="loaderSave" />
          <button v-else type="submit" class="btn btn-primary">
            <i class="fas fa-save me-2"></i> Guardar
          </button>
      </div>
    </div>
  </form>
</div>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import axios from 'axios'
import Loader_1 from '@/components/loader_1.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'

export default {
  components: { navbar, sidebar, Loader_1, LoaderBtnGuardar },

  data() {
    return {
      turmaSelecionada: '',
      periodoSelecionado: 'manha',
      autoPreencherHorarios: true, // comportamento original: controla preenchimento/propagação
      intervaloMinutos: 5,
      mostrarProfessores: null,
      diasSemana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      tempos: [
        { numero: 1, entrada: '07:30', saida: '08:15' },
        { numero: 2, entrada: '08:15', saida: '09:00' },
        { numero: 3, entrada: '09:00', saida: '09:45' },
        { numero: 4, entrada: '09:45', saida: '10:30' },
        { numero: 5, entrada: '10:30', saida: '11:15' },
        { numero: 6, entrada: '11:15', saida: '12:00' },
        { numero: 7, entrada: '12:00', saida: '12:45' },
        { numero: 8, entrada: '12:45', saida: '13:30' }
      ],
      disciplinas: [],
      professores: [],
      horario: {},
      professoresPorDisciplina: {},
      loader: true,
      params: {
          ano_letivo: '',
          nome_curso: '',
          horario_id: '',
          abreviatura: '',
          classe: '',
          serie: '',
          turno: '',
          sala: '',
      },
      loaderSave: false
    }
  },

  created() {
    this.carregarDados().then(() => {
      this.inicializarHorario()
      this.organizarProfessoresPorDisciplina()
      this.carregarHorario()
    })
  },

  methods: {
    async carregarDados() {
      await this.fetchDisciplinas()
      await this.fetchProfessores()
      this.organizarProfessoresPorDisciplina()
    },

    inicializarHorario() {
      const horario = {}
      this.tempos.forEach(tempo => {
        horario[tempo.numero] = {}
        this.diasSemana.forEach(dia => {
          horario[tempo.numero][dia] = {
            disciplina: '',
            professor: null,
            entrada: tempo.entrada,
            saida: tempo.saida
          }
        })
      })
      this.horario = horario
    },

    getCelula(tempo, dia) {
      if (!this.horario[tempo]) this.$set(this.horario, tempo, {})
      if (!this.horario[tempo][dia]) {
        this.$set(this.horario[tempo], dia, {
          disciplina: '',
          professor: null,
          entrada: '',
          saida: '',
          turma_id: this.turmaSelecionada || null
        })
      }
      return this.horario[tempo][dia]
    },

    organizarProfessoresPorDisciplina() {
      this.professoresPorDisciplina = {}
      this.disciplinas.forEach(disciplina => {
        this.professoresPorDisciplina[disciplina.id] = []
      })

      this.professores.forEach(professor => {
        professor.disciplinas.forEach(disciplinaId => {
          if (this.professoresPorDisciplina[disciplinaId]) {
            this.professoresPorDisciplina[disciplinaId].push(professor)
          }
        })
      })
    },

    aplicarIntervalo() {
      // comportamento original: propaga horas se autoPreencherHorarios estiver true
      if (this.autoPreencherHorarios && this.tempos.length > 0) {
        const duracao = this.calcularDuracao(this.tempos[0].entrada, this.tempos[0].saida)

        for (let i = 1; i < this.tempos.length; i++) {
          const saidaComIntervalo = this.adicionarMinutos(this.tempos[i - 1].saida, parseInt(this.intervaloMinutos || 0))
          this.tempos[i].entrada = saidaComIntervalo
          this.tempos[i].saida = this.adicionarMinutos(saidaComIntervalo, duracao)

          this.diasSemana.forEach(dia => {
            this.getCelula(this.tempos[i].numero, dia).entrada = this.tempos[i].entrada
            this.getCelula(this.tempos[i].numero, dia).saida = this.tempos[i].saida
          })
        }
      }
    },

    calcularDuracao(entrada, saida) {
      const [entH, entM] = (entrada || '00:00').split(':').map(Number)
      const [saiH, saiM] = (saida || '00:00').split(':').map(Number)
      return (saiH - entH) * 60 + (saiM - entM)
    },

    adicionarMinutos(hora, minutos) {
      const [h, m] = (hora || '00:00').split(':').map(Number)
      let totalMinutos = h * 60 + m + (minutos || 0)
      const novasHoras = Math.floor(totalMinutos / 60) % 24
      const novosMinutos = totalMinutos % 60
      return `${novasHoras.toString().padStart(2, '0')}:${novosMinutos.toString().padStart(2, '0')}`
    },

    atualizarHorarios(index) {
      // manter comportamento original: se autoPreencherHorarios true, alteração no 1º tempo propaga
      if (this.autoPreencherHorarios && index === 0) {
        this.aplicarIntervalo()
      }

      // sempre atualiza as células com as horas manuais editadas
      const tempo = this.tempos[index]
      if (!tempo) return
      this.diasSemana.forEach(dia => {
        const cel = this.getCelula(tempo.numero, dia)
        cel.entrada = tempo.entrada
        cel.saida = tempo.saida
      })
    },

    selecionarDisciplina(tempo, dia) {
      const celula = this.getCelula(tempo, dia)
      celula.professor = null
      if (celula.disciplina) {
        this.mostrarProfessores = `${tempo}-${dia}`
      }
    },

    selecionarProfessor(tempo, dia, professor) {
      const celula = this.getCelula(tempo, dia)
      celula.professor = professor
      this.mostrarProfessores = null

      const id = this.$route.params.horario_id
      this.turmaSelecionada = this.$route.params.turma_id

      const registro = {
        horario_id: id,
        turma_id: this.turmaSelecionada,
        disciplina_id: celula.disciplina,
        professor_id: professor?.id || "",
        dia_semana: dia,
        num_tempo: tempo,
        hora_entrada: celula.entrada,
        hora_saida: celula.saida
      }

      let registros = JSON.parse(sessionStorage.getItem('horario_temporario')) || []

      registros = registros.filter(
        r => !(r.dia_semana === dia && r.num_tempo === tempo)
      )

      registros.push(registro)
      sessionStorage.setItem('horario_temporario', JSON.stringify(registros))
    },

    resetarHorario() {
      if (confirm('Tem certeza que deseja limpar todo o horário?')) {
        this.inicializarHorario()
        this.tempos = [
          { numero: 1, entrada: '07:30', saida: '08:15' },
          { numero: 2, entrada: '08:15', saida: '09:00' },
          { numero: 3, entrada: '09:00', saida: '09:45' },
          { numero: 4, entrada: '09:45', saida: '10:30' },
          { numero: 5, entrada: '10:30', saida: '11:15' },
          { numero: 6, entrada: '11:15', saida: '12:00' },
          { numero: 7, entrada: '12:00', saida: '12:45' },
          { numero: 8, entrada: '12:45', saida: '13:30' }
        ]
        this.intervaloMinutos = 5
      }
    },

    salvarRascunho() {
      console.log('Rascunho salvo:', this.horario)
      alert('Rascunho do horário salvo com sucesso!')
    },

    async submitForm() {
  this.loaderSave = true
  try {
    const registros = JSON.parse(sessionStorage.getItem('horario_temporario')) || []

    if (registros.length === 0) {
      this.loaderSave = false
      return alert('Nenhum horário foi preenchido.')
    }

    const response = await api.add('horarioTempos/store', registros)
    console.log('API response:', response) // útil para debugar o formato real

    // Normaliza checagem de sucesso:
    const status = response?.status ?? response?.data?.status ?? null
    const ok = status === null ? !!(response?.data?.message || response?.message) : (status >= 200 && status < 300)

    if (!ok) {
      // opcional: mostra mensagem detalhada do servidor
      const errMsg = response?.data?.message || response?.message || 'Erro ao guardar os horários'
      throw new Error(errMsg)
    }

    // Pega a mensagem de sucesso de qualquer lugar que ela venha
    const mensagem = response?.data?.message || response?.message || 'Horário guardado!'

    sessionStorage.removeItem('horario_temporario')
    toast.success(mensagem)
  } catch (error) {
    console.error(error)
    // mostra a mensagem específica do erro, se houver
    const text = error?.message || 'Erro ao guardar o horário'
    toast.error(text)
  } finally {
    this.loaderSave = false
  }

    },

    async fetchDisciplinas() {
      const resp = await api.listar(request.disciplinasListar)
      this.disciplinas = resp.data
    },

    async fetchProfessores() {
      const resp = await api.listar("funcionarios-disciplinas")
      this.professores = resp
    },

    modelarHorario() {
      this.$router.push({
        name: 'horarios.show',
        params: this.params,
      })
    },

    async carregarHorario() {
      const horarioId = this.$route.params.horario_id;

      this.params = this.$route.params

      const dadosTemporarios = sessionStorage.getItem('horario_temporario');
      let registros = [];

      if (dadosTemporarios && 0) {
        registros = JSON.parse(dadosTemporarios);
      } else {
        try {
          const response = await api.show(`carregar-horario/${this.params.turma_id}`);
          registros = response
          if(registros) {
            this.loader = false
          }
        } catch (error) {
          console.error('Erro ao carregar horário do servidor:', error);
          return;
        }
      }

      // Inicializa a estrutura padrão
      this.inicializarHorario();

      // Preenche com os dados vindos
      registros.forEach(item => {
        const tempo = parseInt(item.num_tempo);
        const dia = item.dia_semana;

        const celula = this.getCelula(tempo, dia);
        celula.disciplina = item.disciplina_id;
        celula.professor = this.professores.find(p => p.id === item.professor_id) || null;
        celula.entrada = item.hora_entrada?.slice(0, 5) || '';
        celula.saida = item.hora_saida?.slice(0, 5) || '';
      });
    }
  }
}
</script>

<style scoped>
.form-container {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 10;
}

.professor-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 200px;
  overflow-y: auto;
}

.list-group-item {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
}

.btn-close {
  font-size: 0.75rem;
}

/* linha separadora acima dos tempos 7 e 8 */
.separator-row td {
  height: 12px;
  background: transparent;
  border-top: 2px solid #e9ecef;
  padding: 0;
}

/* responsividade */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .table {
    width: max-content;
    min-width: 100%;
  }
  
  .form-select {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
  
  input[type="time"] {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 576px) {
  .dias-semana th {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    text-align: center;
    width: 30px;
    padding: 0.5rem 0.2rem;
  }
  
  .btn {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
