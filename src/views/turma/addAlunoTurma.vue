<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Adicionar alunos a Turma</h2>
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

            <!-- Campo oculto para enviar turma_id corretamente -->
            <input type="hidden" name="turma_id" :value="turma_id"/>

            <!-- Botão -->
            <div v-if="loaderSave" class="px-3 mt-2">
              <LoaderBtnGuardar/>
            </div>
            <div v-show="guardar" v-else class="px-3 mt-2">
              <button type="submit" class="btn btn-primary mt-3">Guardar</button>
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
      loader: false,
      loaderSave: false,
      guardar: false
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
      this.guardar = false

      if (!this.search) return;
      try {
        const resp = await api.listar(`alunos/search?query=${this.search}`);
        this.alunos = resp;

        if(resp) {
          this.loader = false

          if(this.alunos == 0) {
            this.nao_encotrado = true

          } else {
            this.guardar = true
          }
        } 
        
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        this.alunos = [];
      }
    },

    async submitForm() {

      this.loaderSave = true

      try {
        this.form.turma_id = this.$route.params.id;

        await api.add(request.confirmacoesAdd, this.form);
        alert('Aluno adicionado!');
        
        // this.$router.push('/confirmacoes');
        this.alunos = [];
        this.search = ''
        this.loaderSave = false
      } catch (error) {
        console.error('Erro ao efetuar confirmação:', error);
        this.loaderSave = false
        // alert('Erro ao confirmar matrícula. Verifique os dados.');
      }
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