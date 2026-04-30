<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="page-title mb-0">
          <Voltar/> Direção/Pedagógica/Cursos/Editar Curso
        </h4>
      </div>

      <div v-if="resp.length === 0" class="p-4 text-center">
        A Carregar...
      </div>

      <!-- Formulário -->
      <div v-else class="card p-4 shadow-sm">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="mb-3 col-md-6">
              <label for="nome" class="form-label">Nome do Curso *</label>
              <input
                v-model="form.nome"
                type="text"
                class="form-control"
                id="nome"
                required
              />
            </div>

            <div class="mb-3 col-md-6">
              <label for="abreviatura" class="form-label">Abreviatura *</label>
              <input
                v-model="form.abreviatura"
                type="text"
                class="form-control"
                id="abreviatura"
                required
              />
            </div>

            <div class="mb-3 col-md-6">
              <label for="abreviatura" class="form-label">Nome do Coordenador *</label>
              <input
                v-model="form.nome_coordenador"
                type="text"
                class="form-control"
                id="abreviatura"
              />
            </div>

            <div class="mb-3 col-md-6">
              <label for="abreviatura" class="form-label">Telefone *</label>
              <input
                v-model="form.telefone"
                type="text"
                class="form-control"
                id="abreviatura"
              />
            </div>

            <div class="mb-4">
              <label for="descricao" class="form-label">Descrição</label>
              <textarea
                v-model="form.descricao"
                class="form-control"
                id="descricao"
                rows="3"
              ></textarea>
            </div>
            <div>
              <LoaderBtnGuardar v-if="loaderSave"/>
              <button v-else type="submit" class="btn btn-primary">
                <i class="fas fa-save me-2"></i> Guardar
              </button>
            </div>
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
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import Voltar from '@/components/voltar.vue'

export default {
  components: { navbar, sidebar, LoaderBtnGuardar, Voltar },
  data() {
    return {
      form: {
        nome: '',
        abreviatura: '',
        nome_coordenador: '',
        telefone: '',
        descricao: '',
      },
      resp: [],
      loaderSave: false
    }
  },
  async created() {
    const id = this.$route.params.id
    try {
      this.resp = await api.show(`${request.cursosShow}${id}`)
      this.form = {
        nome: this.resp.nome,
        abreviatura: this.resp.abreviatura,
        nome_coordenador: this.resp.nome_coordenador,
        telefone: this.resp.telefone,
        escola_id: this.resp.escola_id
      }
    } catch (error) {
      alert('Erro ao carregar dados do curso.')
      console.error(error)
    }
  },
  methods: {
    async submitForm() {
      this.loaderSave = true
      const id = this.$route.params.id
      try {
        await api.update(`${request.cursosUpdate}${id}`, this.form)
        alert('Registo atualizado com sucesso!')
        this.loaderSave = false
        this.$router.push('/cursos')
      } catch (error) {
        // alert('Erro ao atualizar curso. Verifique os campos.')
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
