<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-plus me-2"></i>Novo Perfil</h2>
        <router-link to="/regras">
          <button class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </button>
        </router-link>
      </div>

      <!-- Formulário -->
      <div class="card p-4 shadow-sm">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome do Perfil *</label>
            <select name="" id="" v-model="form.nome" class="form-select" required>
              <option value="">Selecionar</option>
              <option value="administrador_do_sistema">Administrador do sistema</option>
              <option value="director_geral">Director Geral</option>
              <option value="director_pedagogico">Director Pedagógico</option>
              <option value="director_administrativo">Director Administrativo</option>
              <option value="secretario_geral">Director Geral</option>
              <option value="secretario_pedagogico">Director Pedagógico</option>
              <option value="secretario_administrativo">Director Administrativo</option>
              <option value="professor">Professor</option>
              <option value="aluno">Aluno</option>
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
import * as api from '../../../api/api.js'
import * as request from '../../../api/request.js'

export default {
  components: { navbar, sidebar },
  data() {
    return {
      form: {
        nome: ''
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        await api.add('regras/store', this.form)
        alert('Cadastrado com sucesso!')
        this.$router.push('/regras')
      } catch (error) {
        alert('Erro ao cadastrar. Verifique os campos.')
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
