<template>
  <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid px-4">
      <!-- Cabeçalho -->
      <div class="d-flex align-items-center mb-0 mt-4">
        <h4>
          <Voltar/>
          Lista da Turma
        </h4>
      </div>
      <div class="d-flex align-items-center mb-4 mt-3 p-0"> 
        <button @click="printTurma" class="btn btn-sm btn-danger">
          <i class="fas fa-print me-2"></i> Imprimir
        </button>
        <button v-show="regra != 'professor'" @click="alterarTurma" class="btn btn-sm btn-warning mx-2">
          <i class="fas fa-pencil me-2"></i> Alterar
        </button>
        <button v-show="regra != 'professor'" @click="addAlunoTurma" class="btn btn-sm btn-primary">
          <i class="fas fa-plus me-2"></i> Adicionar
        </button>
      </div>

      <div v-if="loading" class="text-center p-4">Carregando dados...</div>

      <div v-if="turma" ref="printArea">
        <!-- DIV com cabeçalhos da turma --> 
        <div class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-6 col-md-4 mb-2"><strong>Curso:</strong> {{ turma.curso ? turma.curso.nome || '—' : '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Classe:</strong> {{ turma.classe ? turma.classe+'ª classe' || 'Iniciação' : 'Iniciação' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Turma:</strong> {{ turma.serie || '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Sala:</strong> {{ turma.sala || '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Periodo:</strong> {{ turma.turno || '—' }}</div>
              <div class="col-sm-6 col-md-4 mb-2"><strong>Ano letivo:</strong> {{ turma.ano_letivo || '—' }}</div>
            </div>
          </div>
        </div>

        <!-- Tabela simples de alunos -->
        <div class="card">
          <div class="card-body p-0 table-responsive  ">
            <table class="table table-sm table-striped mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width:80px">Nº</th>
                  <th>Nome</th>
                  <th style="width:120px">Idade</th>
                  <th style="width:140px">Gênero</th>
                  <th style="width:140px" v-show="seeAlterar">Status</th>
                  <th style="width:140px" v-show="seeAlterar" class="text-center">Acções</th>
                </tr>
              </thead> 
              <tbody>
                <tr v-for="mat in alunosSorted" :key="mat.id">
                  <td>{{ mat.num_aluno ?? '—' }}</td>
                  <td>{{ mat.aluno?.nome_completo || '—' }}</td>
                  <td>{{ calcularIdade(mat.aluno?.data_nascimento) }}</td>
                  <td>{{ formatGenero(mat.aluno?.genero) }}</td>
                  <td v-show="seeAlterar">--</td>
                  <td v-show="seeAlterar" class="text-center">
                    <button class="btn btn-sm btn-outline-danger" title="Excluir" @click="confirmarExclusao(mat.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="alunosSorted.length === 0">
                  <td colspan="4" class="text-center py-3">Nenhum aluno encontrado.</td>
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
import Voltar from '@/components/voltar.vue'
import * as api from '@/api/api'
import * as request from '@/api/request'
import html2pdf from 'html2pdf.js'

export default {
  name: 'TurmaAlunos',
  components: { navbar, sidebar, Voltar },
  data() {
    return {
      turma: null,
      loading: false,
      error: null,
      seeAlterar: false,
      regra: sessionStorage.getItem('regra') || ''
    }
  },
  computed: {
    alunosSorted() {
      if (!this.turma || !Array.isArray(this.turma.matriculas)) return [];
      // Ordena por num_aluno (se houver), mantendo segurança com nulls
      return [...this.turma.matriculas].sort((a, b) => {
        const na = Number(a.num_aluno ?? 0)
        const nb = Number(b.num_aluno ?? 0)
        return na - nb
      })
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    alterarTurma() {
      this.seeAlterar = !this.seeAlterar
    },
    addAlunoTurma() {
      this.$router.push(`/turmas/${this.$route.params.id}/alunos/add`)
    },
    async fetchData() {
      const id = this.$route.params.id
      this.loading = true
      this.error = null
      try {
        const resp = await api.show(`turmas/alunos-da-Turma/${id}`)
        this.turma = resp?.data ?? resp
      } catch (err) {
        console.error(err)
        this.error = 'Erro ao carregar os dados da turma.'
      } finally {
        this.loading = false
      }
    },
    calcularIdade(dataNascimento) {
      if (!dataNascimento) return '—'
      const partes = dataNascimento.split ? dataNascimento.split('-') : null
      let nasc
      if (partes && partes.length >= 3) {
        const y = Number(partes[0])
        const m = Number(partes[1]) - 1
        const d = Number(partes[2])
        nasc = new Date(y, m, d)
      } else {
        nasc = new Date(dataNascimento)
      }
      if (isNaN(nasc.getTime())) return '—'

      const hoje = new Date()
      let idade = hoje.getFullYear() - nasc.getFullYear()
      const diffMes = hoje.getMonth() - nasc.getMonth()
      if (diffMes < 0 || (diffMes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--
      }
      return idade >= 0 ? `${idade} anos` : '—'
    },
    formatGenero(genero) {
      if (!genero) return '—'
      const str = String(genero).trim()
      if (!str) return '—'
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    async printTurma() {
      this.seeAlterar = false
      
      if (!this.turma) {
        this.error = 'Turma não carregada.'
        return
      }

      // Elemento que será convertido para PDF
      const element = this.$refs.printArea
      if (!element) {
        this.error = 'Área de impressão não encontrada.'
        return
      }

      const nomeArquivoBase = ((this.turma.serie || 'turma') + '_' + (this.turma.sala || '')).split(' ').join('_')
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `${nomeArquivoBase}_lista.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      try {
        await html2pdf().set(opt).from(element).save()
      } catch (err) {
        console.error('Erro ao gerar PDF:', err)
        this.error = 'Erro ao gerar PDF. Veja console para mais detalhes.'
      }
    },

    async confirmarExclusao(id) {
      if (confirm('Tem certeza que deseja excluir?')) {
        try {
          await api.destroy(`${request.matriculasDestroy}${id}`)
          alert('Registo excluído com sucesso.')
          await this.fetchData()
        } catch (error) {
          alert('Erro ao excluir o Registo.')
          console.error(error)
        }
      } 
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
