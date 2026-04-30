<template>
  <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid px-4">
      <!-- Cabeçalho -->
      <div class="d-flex align-items-center mb-4 mt-4">
        <button @click="$router.back()" class="btn btn-back">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <div v-if="loading" class="text-center p-4">Carregando dados...</div>

      <div v-if="turma" ref="printArea">
        <!-- DIV com cabeçalhos da turma -->
        <div class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-6 col-md-4 mb-2"><strong>Curso:</strong> {{ turma.curso?.nome || '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Classe:</strong> {{ turma.classe ? turma.classe+'ª classe' : 'Iniciação' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Turma:</strong> {{ turma.serie || '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Sala:</strong> {{ turma.sala || '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Periodo:</strong> {{ turma.turno || '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Ano letivo:</strong> {{ turma.ano_letivo || '—' }}</div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <div class="d-flex">
            <div class="mb-3 me-2">
              <select v-model="trimestre" class="form-select">
                <option value="">Trimestre</option>
                <option value="1">Primeiro</option>
                <option value="2">Segundo</option>
                <option value="3">Terceiro</option>
              </select>
            </div>
            <div class="mb-3">
              <button @click="salvarPdf" class="btn btn-danger">
                <i class="fas fa-file-pdf"></i> Guardar PDF
              </button>
            </div>
          </div>
          <div class="mb-3">
            <button @click="entregarBoletim" class="btn btn-warning ms-2">
              <i class="fas fa-hand me-2"></i> Entregar boletim
            </button>
          </div>
        </div>

        <!-- Tabela de alunos -->
        <div class="card">
          <div class="card-body p-0 table-responsive">
            <table class="table table-sm table-striped mb-0">
              <thead class="table-light">
                <tr>
                  <th class="text-center">
                    <input 
                      type="checkbox"
                      :checked="allSelected"
                      @change="toggleAll"
                    >
                  </th>
                  <th style="width:80px">Nº</th>
                  <th>Nome</th>
                  <th style="width:120px">Idade</th>
                  <th style="width:140px">Gênero</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mat in alunosSorted" :key="mat.id">
                  <td class="text-center">
                    <input 
                      type="checkbox" 
                      :value="mat.aluno?.id" 
                      v-model="selectedAlunos"
                    >
                  </td>
                  <td>{{ mat.num_aluno ?? '—' }}</td>
                  <td>{{ mat.aluno?.nome_completo || '—' }}</td>
                  <td>{{ calcularIdade(mat.aluno?.data_nascimento) }}</td>
                  <td>{{ formatGenero(mat.aluno?.genero) }}</td>
                </tr>
                <tr v-if="alunosSorted.length === 0">
                  <td colspan="5" class="text-center py-3">Nenhum aluno encontrado.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && !error" class="alert alert-secondary">Selecione uma turma para ver os alunos.</div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '@/api/api'

export default {
  name: 'TurmaAlunos',
  components: { navbar, sidebar },
  data() {
    return {
      turma: null,
      loading: false,
      error: null,
      trimestre: '',
      selectedAlunos: []
    }
  },
  computed: {
    alunosSorted() {
      if (!this.turma || !Array.isArray(this.turma.matriculas)) return []
      return [...this.turma.matriculas].sort((a, b) => {
        const na = Number(a.num_aluno ?? 0)
        const nb = Number(b.num_aluno ?? 0)
        return na - nb
      })
    },
    allSelected() {
      return this.alunosSorted.length > 0 && this.selectedAlunos.length === this.alunosSorted.length
    }
  },
  async created() {
    const id = this.$route.params.turma_id
    this.loading = true
    try {
      const resp = await api.show(`turmas/alunos-da-Turma/${id}`)
      this.turma = resp?.data ?? resp

      // marca todos alunos por padrão
      this.selectedAlunos = this.turma.matriculas.map(m => m.aluno?.id).filter(Boolean)
    } catch (err) {
      console.error(err)
      this.error = 'Erro ao carregar os dados da turma.'
    } finally {
      this.loading = false
    }
  },
  methods: {
    toggleAll(e) {
      if (e.target.checked) {
        this.selectedAlunos = this.turma.matriculas.map(m => m.aluno?.id).filter(Boolean)
      } else {
        this.selectedAlunos = []
      }
    },
    salvarPdf() {
      if (!this.trimestre) {
        alert('Selecione um trimestre.')
        return
      }
      if (this.selectedAlunos.length === 0) {
        alert('Selecione pelo menos um aluno.')
        return
      }

      const id = this.$route.params.turma_id
      const alunos = this.selectedAlunos.join(',')

      this.$router.push({
        name: 'boletim.show',
        params: {
          id: id,
          trimestre: this.trimestre,
          alunos_id: alunos
        }
      })
    },

    async entregarBoletim() {
      /*if (this.trimestre != 1) {
        alert('Trimestre sem notas.')
        return
      }*/
      if (!this.trimestre) {
        alert('Selecione um trimestre.')
        return
      }

      if (this.selectedAlunos.length === 0) {
        alert('Selecione pelo menos um aluno.')
        return
      }

      const payload = {
        turma_id: this.$route.params.turma_id,
        trimestre: this.trimestre,
        alunos_id: this.selectedAlunos, // array
        // escola_id é opcional
      }

      await api.add('/alunos-boletins/store', payload)
        .then(() => {
          alert('Boletins entregues.')
        })
        .catch(error => {
          console.error(error)
          alert('Erro ao gerar boletins.')
      })
    },

    calcularIdade(dataNascimento) {
      if (!dataNascimento) return '—'
      const partes = dataNascimento.split ? dataNascimento.split('-') : null
      let nasc
      if (partes && partes.length >= 3) {
        nasc = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
      } else {
        nasc = new Date(dataNascimento)
      }
      if (isNaN(nasc.getTime())) return '—'
      const hoje = new Date()
      let idade = hoje.getFullYear() - nasc.getFullYear()
      const diffMes = hoje.getMonth() - nasc.getMonth()
      if (diffMes < 0 || (diffMes === 0 && hoje.getDate() < nasc.getDate())) idade--
      return idade >= 0 ? `${idade} anos` : '—'
    },

    formatGenero(genero) {
      if (!genero) return '—'
      const str = String(genero).trim()
      return str ? str.charAt(0).toUpperCase() + str.slice(1) : '—'
    }
  }
}
</script> 

<style scoped>
.btn-back {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 6px;
}
.card-body .row > div {
  font-size: 0.95rem;
}

</style>
