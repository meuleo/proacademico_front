<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-arrow-left me-2" @click="$router.back" style="cursor: pointer; font-size: 16px; position: relative; top: -4px;"></i> Emitir Termo</h2>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <div class="form-container bg-white p-4 px-0 rounded shadow-sm animate-fadeInUp">
        <form action="">
          <div class="mb-3 row"> 
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
            <div class="row">
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
            <label for="" class="form-label">Classe</label>
            <input
                class="form-control"
                type="text"
                v-model="form.classe"
                @keyup="getNivelEnsino"
              />
          </div>

          <div class="px-3 mb-3">
            <hr>
          </div>

          <div class="col-md-6 mb-3">
            <button class="col-12 btn btn-primary" @click="criarTermo">
              Criar novo
            </button>
          </div>
          <div class="col-md-6 mb-3"  @click="emitirTermo">
            <button class="col-12 btn btn-warning">
              Gerar automático
            </button>
          </div>
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
      classes: [1,2,3,4,5,6,7,8,9,10,11,12,13],
      form: {
        aluno_id: '',
        nivelEnsino: '',
        classe: '',
      },
    };
  },

  created() {
  
  },

  methods: {
    getNivelEnsino() {
      const classe = this.form.classe;

      if (['10', '11', '12', '13'].includes(classe)) {
        this.form.nivelEnsino = 3; // Ensino Secundário

      } else if (['7', '8', '9'].includes(classe)) {
        this.form.nivelEnsino = 2; // Ensino I Ciclo

      } else if (['1','2','3','4','5','6'].includes(classe)) {
        this.form.nivelEnsino = 1; // Ensino Primário

      } else {
        if(this.form.nivelEnsino != null) {
          this.form.nivelEnsino = ""; // Caso não encontre
          alert("A classe deve estar entre 1ª a 13ª")
          return
        }
      }
    },

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

    emitirTermo() {
      if(!this.form.aluno_id) {
        alert("Selecione o Aluno")
        return
      }
      if(!this.form.nivelEnsino) {
        alert("Informe uma classe válida")
        return
      }
      if(!this.form.classe) {
        alert("Selecione a classe")
        return
      }

      // if(this.$store.state.modelo != "") {
      if(true) {
        // alert(this.$store.state.modelo)

        // this.$router.push('/termos/'+ this.form.aluno_id +'/' + this.$store.state.modelo + '/' + this.form.nivelEnsino + '/' + this.form.classe + '/show')
        this.$router.push('/termos/'+ this.form.aluno_id +'/' + this.form.nivelEnsino + '/' + 'auto' + '/' + this.form.classe)
      
      } else {
        alert("Nenhum modelo de Termo registado!")
      }

    },

    criarTermo() {
      if(!this.form.aluno_id) {
        alert("Selecione o Aluno")
        return
      }
      if(!this.form.nivelEnsino) {
        alert("Informe uma classe válida")
        return
      }
      if(!this.form.classe) {
        alert("Selecione a classe")
        return
      }
      
      this.$router.push('/termos/criar-termo/' + this.form.aluno_id + '/' + this.form.nivelEnsino + '/' + this.form.classe)
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