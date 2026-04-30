<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <Voltar/>
          Direção/Administrativa/Funções/Editar Função
        </h4>
      </div>

      <!-- Formulário -->
      <div class="card p-4 shadow-sm" v-if="form.id">
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
              <option value="" disabled>Selecione...</option>
              <option value="---">Nenhum</option>
              <option value="Geral">Geral</option>
              <option value="Pedagógico">Pedagógico</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div> -->

          <button v-if="!loaderSave" type="submit" class="btn btn-primary">
            <i class="fas fa-save me-2"></i> Guardar
          </button>
          <LoaderBtnGuardar v-else/>
        </form>
      </div>
      <div v-else>
        <p>A Carregar...</p>
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
        id: null,
        nome: '',
      },
      resp: [],
      loaderSave: false
    }
  },
  async created() {
    const id = this.$route.params.id
    try {
      this.resp = await api.show(`${request.funcoesShow}${id}`)
      this.form = {
        ...this.resp,
        id: this.resp.id
      }
    } catch (error) {
      alert('Erro ao carregar os dados da função.')
      console.error(error)
    }
  },
  methods: {
    async submitForm() {
      this.loaderSave = true
      try {
        await api.update(`${request.funcoesUpdate}${this.form.id}`, this.form)
        alert('Registo atualizado com sucesso!')
        this.loaderSave = false
        this.$router.push('/funcoes')
      } catch (error) {
        // alert('Erro ao atualizar função.')
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
