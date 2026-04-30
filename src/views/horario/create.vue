<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <!-- Título e botão voltar -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-user-graduate me-2"></i>Criar Horário</h2>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <!-- Formulário -->
       <div class="form-container bg-white p-4 rounded shadow-sm animate-fadeInUp">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="genero" class="form-label">Ano Lectivo</label>
              <select v-model="form.genero" class="form-select" id="genero" required>
                <option disabled value="">2025/2026</option>
              </select>
            </div>

            <div class="col-md-4 mb-3">
              <label for="genero" class="form-label">Curso</label>
              <select v-model="form.genero" class="form-select" id="genero" required>
                <option disabled value="">Curso</option>
                <option value="">CFB</option>
              </select>
            </div>

            <div class="col-md-4 mb-3">
              <label for="genero" class="form-label">Turma</label>
              <select v-model="form.genero" class="form-select" id="genero" required>
                <option value="" disabled>Turma</option>
                <option value="">CFB | 10º A</option>
                <option value="">CFB | 10º B</option>
                <option value="">CFB | 12º A</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary mt-3">Criar</button>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from "../../api/api.js" 

export default {
  components: {
    navbar,
    sidebar
  },
  data() {
    return {
      form: {
        escola_id: '',
        turma_id: '',
        ano_letivo: ''
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        await api.add('alunos/store', this.form);
        alert('Aluno cadastrado com sucesso!')
        //Pega o Id e redireciona para editar Horario
        // this.resetForm()
      } catch (error) {
        console.error('Erro ao cadastrar aluno:', error)
        alert('Erro ao cadastrar aluno. Verifique os dados.')
      }
    },
  }
}
</script>

<style scoped>
  /* Adicione seus estilos aqui se necessário */
  table td.sala {
    text-align: center;
  }

  table td {
    border: 1px solid #222;
  }

  .rotate-sala {
    transform: rotate(-90deg);
    padding: 10px 0;
    margin-top: -10px;
  }
</style>
