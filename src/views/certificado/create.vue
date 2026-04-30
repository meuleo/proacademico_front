<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Emitir Certificado</h2>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <div class="form-container bg-white p-4 rounded shadow-sm animate-fadeInUp">
        <form action="">
          <div class="mb-3 ">
            <label for="search" class="form-label">Buscar Aluno</label>
            <div class="input-group">
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Nome ou nº do BI"
              />
              <button class="btn btn-outline-primary" @click.prevent="buscarAlunos">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </form>

          <form @submit.prevent="submitForm">
          <!-- Resultados da busca -->
          <div v-if="alunos.length > 0" class="mb-3 ">
            <p class="form-label"><strong>Selecione o Aluno</strong></p>
            <div
              class="form-check"
              v-for="aluno in alunos"
              :key="aluno.id"
            >
              <input
                class="form-check-input"
                type="radio"
                :id="'aluno_' + aluno.id"
                :value="aluno.id"
                v-model="form.aluno_id"
              />
              <label class="form-check-label" :for="'aluno_' + aluno.id">
                {{ aluno.nome_completo }} - {{ aluno.bi }}
              </label>
            </div>
          </div>

          <div v-show="loader" class=" mb-3">
            Buscando aluno...
          </div>

          <div v-show="nao_encotrado" class="text-muted0 mb-3 mt-2">
            Nenhum aluno encontrado.
          </div>

          <div class="mb-3" v-show="alunos.length > 0 && !loader">
            <label for="" class="form-label">Nivel de Ensino</label>
            <select v-model="form.nivelEnsino" name="" id="" class="form-select">
              <option value="">Selecionar</option>
              <option value="1">Primário (Iniciação à 6º)</option>
              <option value="2">I Ciclo (7ª à 9ª)</option>
              <option value="3">Secundário (10ª à 13ª)</option>
            </select>
          </div>

          <hr>
          <div class="mb-3"  @click="emitirCertificado">
            <button class="col-12 btn btn-warning">
              Emitir Certificado
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import * as api from '../../api/api.js';
import * as request from '../../api/request.js';
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue';

export default {
  components: { navbar, sidebar, LoaderBtnGuardar },
  data() {
    return {
      search: '',
      alunos: [],
      nao_encotrado: false,
      loaderSave: false,
      form: {
        aluno_id: '',
        nivelEnsino: ''
      },
    };
  },

  created() {
  
  },

  methods: {
    async buscarAlunos() {
      this.loader = true
      this.nao_encotrado = false
      this.alunos = [];

      if (!this.search) return;
      try {
        const resp = await api.listar(`alunos/search?query=${this.search}`);
        this.alunos = resp;

        if(resp) {
          this.loader = false

          if(this.alunos == 0) {
            this.nao_encotrado = true
          } 
        } 
        
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        this.alunos = [];
      }
    },

    emitirCertificado() {
      if(!this.form.aluno_id) {
        alert("Selecione o Aluno")
        return
      }
      if(!this.form.nivelEnsino) {
        alert("Selecione o Nivel de ensino")
        return
      }

      // this.$router.push('/certificados/show/dopsa/n1/' + this.form.aluno_id + '/' + this.form.nivelEnsino)
      this.$router.push(`/Certificados/${this.form.aluno_id}/teste/${this.form.nivelEnsino}/show`)
    },

    emitirCriarNovo() {

    },
  },
};
</script>

<style scoped>
.turmas {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
  cursor: pointer;
}

.turmas:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

.turma-ativa {
  border: 2px solid #0f0;
}
</style>