<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <!-- Título e botão voltar -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-user-edit me-2"></i>Editar Aluno</h2>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <!-- Formulário -->
      <div class="form-container bg-white p-4 rounded shadow-sm animate-fadeInUp">
        <form @submit.prevent="submitForm">
          <div class="mb-3" v-for="(value, key) in form" :key="key" v-if="key !== 'id'">
            <label :for="key" class="form-label">{{ getLabel(key) }}</label>
            <input
              v-if="key !== 'genero' && key !== 'data_nascimento'"
              v-model="form[key]"
              type="text"
              class="form-control"
              :id="key"
              required
            />

            <input
              v-if="key === 'data_nascimento'"
              v-model="form[key]"
              type="date"
              class="form-control"
              :id="key"
              required
            />

            <select
              v-if="key === 'genero'"
              v-model="form[key]"
              class="form-select"
              :id="key"
              required
            >
              <option disabled value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary mt-3">Atualizar Aluno</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'

export default {
  components: {
    navbar,
    sidebar
  },
  data() {
    return {
      form: {
        id: null,
        nome_completo: '',
        genero: '',
        data_nascimento: '',
        bi: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        bairro: ''
      }
    }
  },
  mounted() {
    this.fetchAluno()
  },
  methods: {
    async fetchAluno() {
      const id = this.$route.params.id
      try {
        const response = await api.get(`alunos/show/${id}`)
        this.form = { ...response.data, id }
      } catch (error) {
        console.error('Erro ao carregar aluno:', error)
        alert('Erro ao carregar dados do aluno.')
        this.$router.back()
      }
    },
    async submitForm() {
      try {
        await api.update(`alunos/update/${this.form.id}`, this.form)
        alert('Aluno atualizado com sucesso!')
        this.$router.push('/alunos')
      } catch (error) {
        console.error('Erro ao atualizar aluno:', error)
        alert('Erro ao atualizar aluno. Verifique os dados.')
      }
    },
    getLabel(field) {
      const labels = {
        nome_completo: 'Nome Completo',
        genero: 'Gênero',
        data_nascimento: 'Data de Nascimento',
        bi: 'BI',
        email: 'E-mail',
        telefone: 'Telefone',
        endereco: 'Endereço',
        cidade: 'Cidade',
        bairro: 'Bairro'
      }
      return labels[field] || field
    }
  }
}
</script>

<style scoped>
/* Estilos específicos aqui */
</style>
