<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="gap-2 mb-5">
        <button class="btn btn-outline-secondary me-2" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
        <button type="button" class="btn btn-danger" @click="gerarPDF">
          <i class="fas fa-file-pdf me-2 text-white"></i>Salvar PDF
        </button>
      </div>

      <div v-if="loader" class="text-center py-5">
        <!-- <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div> -->
        <Loader_1/>
      </div>

      <div v-else id="conteudo-pdf">
        <!-- Tabela 1: Horário sem professores -->
          <div class="cabecalho text-center">
            <div>
              <img src="/assets/images/insigbnia.PNG" alt="" class="img-fluid" width="62">
            </div>
            <div v-for="(item, index) in cabecalhos" :key="index">
              {{ item }}
            </div>
            <div>
              <strong>{{ escola.nome }}</strong>
            </div>
            <div>
              <strong>
              {{ escola.municipio }} - {{ escola.bairro }}
              </strong>
            </div>
          </div>

          <div class="text-center mt-2 mb-4">
            <h5>HORARIO DA TURMA</h5>
          </div>
          <div class="row">
            <div class="col-9">
              <div>Classe: <strong>{{params.classe}}ª</strong></div>
              <div>Período: <strong>{{params.turno}}</strong></div>
              <div>Curso: <strong>{{params.nome_curso}}</strong></div>
            </div>
            <div class="col-3">
              <div>Sala: <strong>{{params.sala}}</strong></div>
              <div>Ano Lectivo: <strong>{{params.ano_letivo}}</strong></div>
              <div>Turma: <strong>{{params.serie}}</strong></div>
            </div>
          </div>

          <div class="card-body p-0 mt-2">
            <div class="table-responsive">
              <table class="mb-0 table-horario">
                <thead class="table-light">
                  <tr>
                    <th style="width: 2% !important;">Tempo</th>
                    <th style="width: 4% !important;" >Hora</th>
                    <th v-for="(dia, index) in diasSemana" :key="dia" style="width: 10% !important;">
                      {{convertDiaSemana(dia)}}ª Feira
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tempo, index) in temposOrdenados" :key="tempo.numero">
                    <td>{{ tempo.numero }}º</td>
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
        

        <!-- Tabela 2: Disciplinas e Professores -->
          <div class="card-body p-0 mt-4">
            <div class="table-responsive">
              <table class="mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 60%;">Disciplina</th>
                    <th>Professor</th>
                    <th>Coordenador</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="disciplina in disciplinasUnicas" :key="disciplina.id">
                    <td>
                      {{ disciplina.nome }}
                    </td>
                    <td>
                      <template v-if="getProfessorDaDisciplina(disciplina.id)">
                        {{ getProfessorDaDisciplina(disciplina.id).nome_completo }}
                      </template>
                      <span v-else class="text-muted">Sem Professor</span>
                    </td>
                    <td>
                      <div class="p-3"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar_aluno.vue'
import sidebar from '@/components/sidebar_aluno.vue'
import Loader_1 from '@/components/loader_1.vue'
import html2pdf from 'html2pdf.js';
import * as api from "../../api/api.js" 

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      escola: [],
      diasSemana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      aulas: [],
      turma: null,
      loader: true,
      tempos: [],
      cabecalhos: [],
      params: {
          ano_letivo: '',
          nome_curso: '',
          horario_id: '',
          abreviatura: '',
          classe: '',
          serie: '',
          turno: '',
          sala: '',
      }
    }
  },

  async created() {
    await this.getEscola()
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
    convertDiaSemana(dia) {
      if(dia == "Segunda")
        return "2"
      if(dia == "Terça")
        return "3"
      if(dia == "Quarta")
        return "4"
      if(dia == "Quinta")
        return "5"
      if(dia == "Sexta")
        return "6"
    },

    async carregarHorario() {

      this.params = this.$route.params

      try {
        // Substitua pela sua chamada API real
        const response = await api.listar('horario-turma/'+this.params.turma_id)
        this.aulas = response
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

    async getEscola() {
      const resp = await api.getEscola()

      this.escola = resp
      // Garante que cabecalhos seja sempre um array
      if (!Array.isArray(resp.cabecalhos)) {
        this.cabecalhos.cabecalhos = []

        return
      }

      this.cabecalhos = resp.cabecalhos

    },
    
    formatarHora(hora) {
      if (!hora) return ''
      // Remove os segundos se existirem
      return hora.slice(0, 5)
    },

    gerarPDF() {
      const element = document.getElementById('conteudo-pdf');

      const opt = {
        margin:       [5, 5, 5, 5], // [top, right, bottom, left] em mm
        filename:     `horario_${this.$route.params.abreviatura}_${this.$route.params.classe}ª_${this.$route.params.turno}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3 }, // aumenta a resolução
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
}

table th, table td {
  border: 1px solid #555;
  padding: 0 5px !important;
  font-size: 11pt;
}

table.table-horario th, table.table-horario td {
  text-align: center;
}

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