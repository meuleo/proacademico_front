<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h2 class="mb-1">Iniciação</h2>

          <p class="mb-0 text-muted">
            <strong>Iniciação {{ params.serie }} | {{ params.turno }} | Ano Lectivo: {{ params.ano_letivo }}</strong>
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

          <div class="row">
            <div class="mb-4">
              <h5 class="opacity-7 mb-2">Definir Professor</h5>
              <select v-model="form.professor_id" class="form-control">
                <option value="">Selecionar</option>
                <option v-for="item in professores" :key="item.id" :value="item.id">
                  {{ item.nome_completo }}
                </option>
              </select>
            </div>

            <hr>

            <h5 class="opacity-7 mb-2">Disciplinas</h5>

            <div v-for="item in disciplinas" :key="item.id" class="col-md-3 mb-3">
              <input 
                type="checkbox" 
                class="me-2" 
                :value="item.id"
                v-model="form.disciplina_ids"
              >
              <label class="text-dark">{{ item.nome }}</label>
            </div>

          </div>
          <!-- Botões -->
          <div class="d-flex justify-content-between mt-4">
            <button v-show="!loaderSave" type="submit" class="btn btn-primary">
              <i class="fas fa-save me-2"></i> Guardar
            </button>
            <LoaderBtnGuardar v-show="loaderSave"/>
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
import Loader_1 from '@/components/loader_1.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'

export default {
  components: { navbar, sidebar, Loader_1, LoaderBtnGuardar },

  data() {
    return {
      professores: [],
      disciplinas: [],
      form: {
        turma_id: "",
        professor_id: "",
        disciplina_ids: []
      },
      params: {},
      loaderSave: false
    }
  },

 created() {
  this.form.turma_id = this.$route.params.turma_id
  this.params = this.$route.params

  this.fetchDisciplinas()
  this.fetchProfessores()
  this.fetchDados()
},

methods: {
    async fetchDados() {
      try {
        const response = await api.show(`turmas-do-professor-show/${this.form.turma_id}`)
        this.form.professor_id = response.professor_id
        this.form.disciplina_ids = response.disciplina_ids
      } catch (error) {
        console.error('Erro ao buscar dados existentes', error)
      }
    },

    async fetchDisciplinas() {
      this.disciplinas = await api.listar(request.disciplinasAll)
      
    },

    async fetchProfessores() {
      const resp = await api.listar('funcionarios-professores-all')
      this.professores = resp
      
    },

    async submitForm() {
      this.form.turma_id = this.$route.params.turma_id
        this.loaderSave = true

      try {
        await api.add('turmas-do-professor-store', this.form)
        // this.$toast.success('Dados salvos com sucesso!')
        toast.success('Professor adicionado a turma');
        this.loaderSave = false
      } catch (error) {
        console.error(error)
        this.loaderSave = false
        this.$toast.error('Erro ao salvar os dados.')
      }
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