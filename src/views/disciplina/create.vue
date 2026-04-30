<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="page-title mb-0">
          <Voltar/> Direção/Pedagógica/Disciplinas/Nova Disciplina
        </h4>
      </div>

      <!-- Formulário -->
      <div class="card p-4 shadow-sm">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="mb-3 col-md-4">
              <label for="nome" class="form-label">Nome da Disciplina *</label>
              <input
                v-model="form.nome"
                type="text"
                class="form-control"
                id="nome"
                required
              />
            </div>

            <div class="mb-3 col-md-4">
              <label for="nome" class="form-label">Abreviatura *</label>
              <input
                v-model="form.abreviatura"
                type="text"
                class="form-control"
                id="nome"
              />
            </div>

            <div class="mb-3 col-md-4">
              <label for="icon" class="form-label">Ícone *</label>
              <Multiselect
                v-model="form.icon"
                :options="icons"
                placeholder="Selecionar ícone"
                label="label"
                track-by="value"
              >
                <!-- Renderiza as opções -->
                <template #option="{ option }">
                  <span><i :class="option.value" class="me-2"></i>{{ option.label }}</span>
                </template>

                <!-- Renderiza o ícone selecionado -->
                <template #singleLabel="{ option }">
                  <span><i :class="option.value" class="me-2"></i>{{ option.label }}</span>
                </template>
              </Multiselect>
            </div>

            <div class="mb-3 col-4 col-md-3">
              <label for="nivel" class="form-label">Ensino Secundário</label>
              <div> 
                <input type="checkbox" v-model="form.nivel" :true-value="3" :false-value="null"> Sim
              </div>
            </div>

            <div class="mb-3 col-8 col-md-9" v-show="form.nivel === 3">
              <label for="icon" class="form-label">Domínio</label>
              <select v-model="form.domineo" class="form-select">
                <option value="">Selecionar</option>
                <option value="Formação Geral">Formação Geral</option>
                <option value="Formação Específica">Formação Específica</option>
                <option value="Opção">Opção</option>
              </select>
            </div>
          
          </div>

          <LoaderBtnGuardar v-if="loaderSave"/>
          <button v-else type="submit" class="btn btn-primary">
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
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import * as api from '../../api/api.js'
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import Voltar from '@/components/voltar.vue'

export default {
  components: { navbar, sidebar, Multiselect, LoaderBtnGuardar, Voltar },
  data() {
    return {
      form: {
        nome: '',
        abreviatura: '',
        icon: '',
        nivel: '',
        domineo: ''
      },
      icons: [
        { label: 'Agronomia', value: 'fas fa-seedling' },
        { label: 'Artes', value: 'fas fa-palette' },
        { label: 'Biologia', value: 'fas fa-dna' },
        { label: 'Ciência', value: 'fas fa-flask' },
        { label: 'Computação', value: 'fas fa-laptop-code' },
        { label: 'Direito', value: 'fas fa-balance-scale' },
        { label: 'Educação', value: 'fas fa-building-columns' },
        { label: 'Educação Física', value: 'fas fa-running' },
        { label: 'Economia', value: 'fas fa-chart-line' },
        { label: 'Engenharia', value: 'fas fa-cogs' },
        { label: 'Filosofia', value: 'fas fa-brain' },
        { label: 'Física', value: 'fas fa-atom' },
        { label: 'Geografia', value: 'fas fa-globe' },
        { label: 'História', value: 'fas fa-landmark' },
        { label: 'Literatura', value: 'fas fa-book-open' },
        { label: 'Matemática', value: 'fas fa-square-root-alt' },
        { label: 'Medicina', value: 'fas fa-stethoscope' },
        { label: 'Música', value: 'fas fa-music' },
        { label: 'Psicologia', value: 'fas fa-user-injured' },
        { label: 'Química', value: 'fas fa-vial' }
      ],
      loaderSave: false

    }
  },
  methods: {
    async submitForm() {
      this.loaderSave = true
      try {
        await api.add('disciplinas/store', this.form)
        alert('cadastrada com sucesso!')
        this.loaderSave = false
        this.$router.push('/disciplinas')
      } catch (error) {
        // alert('Erro ao cadastrar disciplina. Verifique os campos.')
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
