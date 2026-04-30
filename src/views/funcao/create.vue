<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <Voltar/>
          Direção/Administrativa/Funções/Nova Função
        </h4>
      </div>

      <!-- Formulário -->
      <div class="card p-4 shadow-sm">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome da função *</label>
            <input
              v-model="form.nome"
              type="text"
              class="form-control"
              id="nome"
              required
            />
          </div>

          <!-- <div class="mb-3">
            <label for="abrangencia" class="form-label">Abrangência *</label>
            <select
              v-model="form.abrangencia"
              class="form-select"
              id="abrangencia"
              required
            >
              <option value="" disabled selected>Selecione...</option>
              <option value="---">Nenhum</option>
              <option value="Geral">Geral</option>
              <option value="Pedagógico">Pedagógico</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div> -->

          <LoaderBtnGuardar v-if="loaderSave" />
          <button v-else type="submit" class="btn btn-primary">
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
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import Voltar from '@/components/voltar.vue'

export default {
  components: { navbar, sidebar, LoaderBtnGuardar, Voltar },
  data() {
    return {
      form: {
        nome: '',
        // abrangencia: '',
        // escola_id: '1',
      },
      loaderSave: false
    }
  },
  methods: {
    async submitForm() {
      this.loaderSave = true
      try {
        await api.add(`${request.funcoesAdd}`, this.form)
        alert('cadastrado com sucesso!')
        this.loaderSave = false
        this.$router.push('/funcoes')
      } catch (error) {
        // alert('Erro ao cadastrar curso. Verifique os campos.')
        this.loaderSave = false
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
