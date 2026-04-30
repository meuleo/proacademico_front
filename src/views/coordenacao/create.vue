<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-plus me-2"></i>Nova Coordenação</h2>
        <router-link to="/coordenacoes">
          <button class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </button>
        </router-link>
      </div>

      <!-- Formulário -->
      <div class="card p-4 shadow-sm">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome da Coordenação *</label>
            <input
              v-model="form.nome"
              type="text"
              class="form-control"
              id="nome"
              required
            />
          </div>

          <div class="mb-3">
            <label for="curso_id" class="form-label">Curso *</label>
            <select
              v-model="form.curso_id"
              class="form-select"
              id="curso_id"
              required
            >
              <option disabled value="">Selecione o curso</option>
              <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                {{ curso.nome }}
              </option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save me-2"></i>Guardar
          </button>
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

export default {
  components: { navbar, sidebar },
  data() {
    return {
      form: {
        nome: '',
        curso_id: '',
        escola_id: '1'
      },
      cursos: []
    }
  },
  async created() {
    await this.loadCursos()
  },
  methods: {
    async loadCursos() {
      try {
        const response = await api.listar('cursos')
        this.cursos = response.data
      } catch (error) {
        alert('Erro ao carregar cursos.')
        console.error(error)
      }
    },
    async submitForm() {
      try {
        await api.add('coordenacoes/store', this.form)
        alert('Coordenação cadastrada com sucesso!')
        this.$router.push('/coordenacoes')
      } catch (error) {
        alert('Erro ao cadastrar coordenação. Verifique os campos.')
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
}
</style>
