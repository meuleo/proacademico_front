<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Confirmar Matrícula</h2>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <div class="form-container bg-white p-4 rounded shadow-sm animate-fadeInUp">
        <form action="">
          <div class="mb-3 px-2">
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
          <div v-if="alunos.length > 0" class="mt-3 px-2">
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

          <div v-show="loader" class="px-2 mb-3">
            Buscando aluno...
          </div>

          <div v-show="nao_encotrado" class="text-muted0 mb-3 mt-2 px-2">
            Nenhum aluno encontrado.
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
      cursos: [],
      turmas: [],
      turma_id: '',
      form: {
        aluno_id: '',
        curso_id: '',
        turma_id: '',
        ano_letivo: '',
        classe: '',
        escola_id: '1',
      },
      nao_encotrado: false,
      turma_id: "",
      sub_sistema: null,
      curso_id_primario: "",
      ano_letivo_primario: "",
      classe_primario: "",
      loader: false,
      loaderTurmas: false,
      loaderSave: false,
      turmas_ask: false
    };
  },

  created() {
    this.obterAnoLetivoAtual()
  },

  methods: {
    obterAnoLetivoAtual() {
      const anoAtual = new Date().getFullYear();
      const proximoAno = anoAtual + 1;
      this.form.ano_letivo = anoAtual + '/' + proximoAno
      this.ano_letivo_primario = this.form.ano_letivo
    },

    validarAnoLetivo(ano) {
      // Formato esperado: 2020/2021
      const regex = /^\d{4}\/\d{4}$/;
      return regex.test(ano);
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

    async buscarTurmas() {
      this.turmas_ask = true
      if(this.sub_sistema != 3) {
        this.form.curso_id = ""
        this.form.ano_letivo = this.ano_letivo_primario
        this.form.classe = this.classe_primario
        if(this.sub_sistema == 0) {
          this.form.classe = ""
        }

      } else {
        if (this.form.curso_id == "" || this.form.classe == "" || this.form.ano_letivo == "") {
          alert("Preencha todos os campos!")
          return;
        }
      }

      if (!this.validarAnoLetivo(this.form.ano_letivo)) {
        alert('Por favor, digite o Ano Letivo no formato correto: ex. 2020/2021');
        return;
      }

      this.loaderTurmas = true;

      try {
        const resp = await api.listar(`turmas/getTurmas?curso_id=${this.form.curso_id}&classe=${this.form.classe}&ano_letivo=${this.form.ano_letivo}`);
        this.turmas = resp;
      } catch (e) {
        this.turmas = [];
        console.error('Erro ao buscar turmas:', e);
      } finally {
        this.loaderTurmas = false;
      }
    },
   
    getTurmaId(id) {
      this.turma_id = id;
    },

    async submitForm() {

      this.loaderSave = true

      try {
        this.form.turma_id = this.turma_id;

        await api.add(request.confirmacoesAdd, this.form);
        alert('Confirmação Efetuada!');
        
        this.loaderTurmas = false
        
        this.$router.push('/confirmacoes');
      } catch (error) {
        console.error('Erro ao efetuar confirmação:', error);
        this.loaderSave = false
        // alert('Erro ao confirmar matrícula. Verifique os dados.');
      }
    },
  },

  async mounted() {
    const resp = await api.listar(request.cursosListar);
    this.cursos = resp.data;
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