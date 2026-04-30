<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-edit me-2"></i>Editar Disciplina</h2>
        <router-link to="/disciplinas">
          <button class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </button>
        </router-link>
      </div>

      <div v-if="resp.length === 0">
        A Carregar...
      </div>

      <!-- Formulário -->
      <div v-else class="card p-4 shadow-sm">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome da Disciplina *</label>
            <input
              v-model="form.nome"
              type="text"
              class="form-control"
              id="nome"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save me-2"></i> Guardar
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../../api/api.js'
import * as request from '../../../api/request.js'

export default {
  components: { navbar, sidebar },
  data() {
    return {
      form: {
        nome: '',
        escola_id: '1'
      },
      resp: []

    }
  },
  async created() {
    const id = this.$route.params.id
    try {
      this.resp = await api.show(`${request.disciplinasShow}${id}`)
      this.form.nome = this.resp.nome
    } catch (error) {
      alert('Erro ao carregar a disciplina.')
      console.error(error)
    }
  },
  methods: {
    async submitForm() {
      const id = this.$route.params.id
      try {
        await api.update(`${request.disciplinasUpdate}${id}`, this.form)
        alert('Disciplina atualizada com sucesso!')
        this.$router.push('/disciplinas')
      } catch (error) {
        alert('Erro ao atualizar disciplina. Verifique os campos.')
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
