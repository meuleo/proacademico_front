<template>
  <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <!-- Main Content -->
  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>
            <Voltar/>
            Direção/Pedagógica/Turmas/Detalhes
          </h4>
      </div>

      <!-- Formulário de Cadastro -->
      <div class="form-container animate-fadeInUp">
        <form @submit.prevent="submitForm" class="bg-white p-4 rounded shadow-sm">
          <!-- Campos simples -->
          <div class="mb-3" v-for="campo in camposSimples" :key="campo.id">
            <label :for="campo.id" class="form-label">{{ campo.label }}</label>
            <input
              v-model="form[campo.id]"
              :type="campo.type"
              class="form-control"
              :id="campo.id"
              :required="campo.required"
              :step="campo.step || null"
            />
          </div>

          <!-- Gênero -->
          <div class="mb-3">
            <label for="genero" class="form-label">Gênero *</label>
            <select v-model="form.genero" class="form-select" id="genero" required>
              <option disabled value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <hr class="my-4">

          <!-- Cargos -->
          <h4>Função</h4>
          <div class="row mb-3">
            <div class="col-md-3 form-check" v-for="cargo in cargos" :key="cargo.id">
              <input class="form-check-input" type="checkbox" :id="'cargo_' + cargo.id" :value="cargo.id" v-model="form.cargosSelecionados">
              <label class="form-check-label" :for="'cargo_' + cargo.id">{{ cargo.nome }} </label>
            </div>
          </div>

          <!-- Disciplinas -->
          <h4>Disciplinas</h4>
          <div class="row mb-3">
            <div class="col-md-3 form-check" v-for="disciplina in disciplinas" :key="disciplina.id">
              <input class="form-check-input" type="checkbox" :id="'disciplina_' + disciplina.id" :value="disciplina.id" v-model="form.disciplinasSelecionadas">
              <label class="form-check-label" :for="'disciplina_' + disciplina.id">{{ disciplina.nome }}</label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary mt-4">Cadastrar Funcionário</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from  "../../api/api.js"
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import Voltar from '@/components/voltar.vue';

export default {
  components: {
    navbar,
    sidebar,
    Voltar
  },
  data() {
    return {
      form: {
        nome_completo: '',
        genero: '',
        data_nascimento: '',
        bi: '',
        telefone: '',
        bairro: '',
        referencia: '',
        salario: '',
        data_admissao: '',
        data_nomeacao: '',
        situacao: '',
        especialidade: '',
        grau_academico: '',
        email: '',
        cargosSelecionados: [],
        disciplinasSelecionadas: []
      },
      cargos: [],
      disciplinas: [],
      camposSimples: [
        { id: 'nome_completo', label: 'Nome completo *', type: 'text', required: true },
        { id: 'data_nascimento', label: 'Data de nascimento *', type: 'date', required: true },
        { id: 'bi', label: 'B.I *', type: 'text', required: true },
        { id: 'telefone', label: 'Telefone', type: 'text', required: false },
        { id: 'bairro', label: 'Bairro', type: 'text', required: false },
        { id: 'salario', label: 'Salário base', type: 'number', step: '0.01', required: false },
        { id: 'data_admissao', label: 'Data de admissão', type: 'date', required: false },
        { id: 'situacao', label: 'Situação *', type: 'text', required: true },
        { id: 'especialidade', label: 'Especialidade', type: 'text', required: false },
        { id: 'grau_academico', label: 'Grau acadêmico', type: 'text', required: false },
        { id: 'email', label: 'E-mail *', type: 'email', required: true }
      ]
    };
  },
  mounted() {
    this.fetchCargos();
    this.fetchDisciplinas();
  },
  methods: {
    async fetchCargos() {
      const response = await api.listar('cargos');
      this.cargos = response
    },
    async fetchDisciplinas() {
        const response = await api.listar('disciplinas');
        this.disciplinas = response
    },
    async submitForm() {
        const payload = {
          ...this.form,
          cargos: this.form.cargosSelecionados,
          disciplinas: this.form.disciplinasSelecionadas
        };

        await api.add('funcionarios/store', payload);
        
        alert('Funcionário cadastrado com sucesso!');
        this.resetForm();
    },
    resetForm() {
      this.form = {
        nome_completo: '',
        genero: '',
        data_nascimento: '',
        bi: '',
        telefone: '',
        bairro: '',
        referencia: '',
        salario: '',
        data_admissao: '',
        data_nomeacao: '',
        situacao: '',
        especialidade: '',
        grau_academico: '',
        email: '',
        cargosSelecionados: [],
        disciplinasSelecionadas: []
      };
    }
  }
};
</script>

<style scoped>
/* Estilos adicionais opcionais */
</style>
