<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid py-4">
      <!-- Cabeçalho com breadcrumb moderno -->
      <div class="page-header mb-1">
        <div class="d-flex align-items-center mb-0">
          <button class="btn btn-icon btn-outline-secondary me-3" @click="$router.back">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-1">
                <li class="breadcrumb-item"><a href="#">Direção</a></li>
                <li class="breadcrumb-item"><a href="#">Administrativa</a></li>
                <li class="breadcrumb-item"><a href="#">Funcionários</a></li>
                <li class="breadcrumb-item active" aria-current="page">Novo Funcionário</li>
              </ol>
            </nav>
            <h1 class="h2 mb-0 fw-bold text-dark">Novo Funcionário</h1>
            <p class="text-muted mb-0">Preencha os dados abaixo para cadastrar um novo funcionário</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <form @submit.prevent="submitForm">
                
                <!-- Informações Pessoais -->
                <div class="section-card mb-5">
                  <div class="d-flex align-items-center mb-4">
                    <div class="section-icon bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <i class="fas fa-user text-primary"></i>
                    </div>
                    <h5 class="mb-0 fw-semibold">Informações Pessoais</h5>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="nome_completo" class="form-label fw-medium">Nome completo *</label>
                      <input type="text" class="form-control form-control-lg" id="nome_completo" 
                             v-model="form.nome_completo" required placeholder="Digite o nome completo">
                    </div>
                    <div class="col-md-3">
                      <label for="genero" class="form-label fw-medium">Gênero *</label>
                      <select v-model="form.genero" class="form-select form-select-lg" id="genero" required>
                        <option disabled value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                      </select>
                    </div>
                    <div class="col-md-3">
                      <label for="data_nascimento" class="form-label fw-medium">Data de nascimento *</label>
                      <input type="date" class="form-control form-control-lg" id="data_nascimento" 
                             v-model="form.data_nascimento" required>
                    </div>
                    <div class="col-md-4">
                      <label for="bi" class="form-label fw-medium">B.I / Identificação *</label>
                      <input type="text" class="form-control form-control-lg" id="bi" 
                             v-model="form.bi" required placeholder="Número do documento">
                    </div>
                    <div class="col-md-4">
                      <label for="situacao" class="form-label fw-medium">Situação</label>
                      <select v-model="form.situacao" class="form-select form-select-lg" id="situacao">
                        <option disabled value="">Selecione</option>
                        <option value="Efetivo">Efetivo</option>
                        <option value="Colaborador">Colaborador</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Informações de Contato -->
                <div class="section-card mb-5">
                  <div class="d-flex align-items-center mb-4">
                    <div class="section-icon bg-info bg-opacity-10 p-3 rounded-circle me-3">
                      <i class="fas fa-address-book text-info"></i>
                    </div>
                    <h5 class="mb-0 fw-semibold">Informações de Contato</h5>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label for="telefone" class="form-label fw-medium">Telefone</label>
                      <input type="text" class="form-control form-control-lg" id="telefone" 
                             v-model="form.telefone" placeholder="9XX XXX XXX">
                      <div class="form-text">Formato: 9XX XXX XXX</div>
                    </div>
                    <div class="col-md-4">
                      <label for="email" class="form-label fw-medium">E-mail</label>
                      <input type="email" class="form-control form-control-lg" id="email" 
                             v-model="form.email" placeholder="nome@exemplo.com">
                    </div>
                    <div class="col-md-4">
                      <label for="bairro" class="form-label fw-medium">Bairro/Município</label>
                      <input type="text" class="form-control form-control-lg" id="bairro" 
                             v-model="form.bairro" placeholder="Localidade de residência">
                    </div>
                  </div>
                </div>

                <!-- Informações Profissionais -->
                <div class="section-card mb-5">
                  <div class="d-flex align-items-center mb-4">
                    <div class="section-icon bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                      <i class="fas fa-briefcase text-warning"></i>
                    </div>
                    <h5 class="mb-0 fw-semibold">Informações Profissionais</h5>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-3">
                      <label for="salario" class="form-label fw-medium">Salário base</label>
                      <div class="input-group">
                        <span class="input-group-text">Kz</span>
                        <input type="number" class="form-control form-control-lg" id="salario" 
                               v-model="form.salario" step="0.01" placeholder="150000.00">
                      </div>
                    </div>
                    <div class="col-md-3">
                      <label for="data_admissao" class="form-label fw-medium">Data de admissão</label>
                      <input type="date" class="form-control form-control-lg" id="data_admissao" 
                             v-model="form.data_admissao">
                    </div>
                    <div class="col-md-3">
                      <label for="especialidade" class="form-label fw-medium">Especialidade</label>
                      <input type="text" class="form-control form-control-lg" id="especialidade" 
                             v-model="form.especialidade" placeholder="">
                    </div>
                    <div class="col-md-3">
                      <label for="grau_academico" class="form-label fw-medium">Grau acadêmico</label>
                      <select v-model="form.grau_academico" class="form-select form-select-lg" id="grau_academico">
                        <option disabled value="">Selecione</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Ensino médio">Ensino médio</option>
                        <option value="Licenciatura">Licenciatura</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="PHD">PHD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Atribuições -->
                <div class="section-card mb-5">
                  <div class="d-flex align-items-center mb-4">
                    <div class="section-icon bg-success bg-opacity-10 p-3 rounded-circle me-3">
                      <i class="fas fa-tasks text-success"></i>
                    </div>
                    <h5 class="mb-0 fw-semibold">Atribuições</h5>
                  </div>
                  
                  <!-- Funções -->
                  <div class="mb-4">
                    <h6 class="fw-medium mb-3">Funções</h6>
                    <div v-show="loader_funcao" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                      </div>
                      <p class="mt-2 text-muted">A carregar funções...</p>
                    </div>
                    <div v-if="cargos.length === 0 && !loader_funcao" class="alert alert-light border">
                      Nenhuma função disponível
                    </div>
                    <div v-else class="row g-2">
                      <div class="col-md-3" v-for="item in cargos" :key="item.id">
                        <div class="form-check card-check">
                          <input class="form-check-input" type="checkbox" :id="'cargo_' + item.id" 
                                 :value="item.id" v-model="form.cargosSelecionados">
                          <label class="form-check-label" :for="'cargo_' + item.id">
                            {{ item.nome }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Disciplinas -->
                  <div>
                    <h6 class="fw-medium mb-3">Disciplinas</h6>
                    <div v-show="loader_disciplina" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                      </div>
                      <p class="mt-2 text-muted">A carregar disciplinas...</p>
                    </div>
                    <div v-if="disciplinas.length === 0 && !loader_disciplina" class="alert alert-light border">
                      Nenhuma disciplina disponível
                    </div>
                    <div v-else class="row g-2">
                      <div class="col-md-3" v-for="item in disciplinas" :key="item.id">
                        <div class="form-check card-check">
                          <input class="form-check-input" type="checkbox" :id="'disciplina_' + item.id" 
                                 :value="item.id" v-model="form.disciplinasSelecionadas">
                          <label class="form-check-label" :for="'disciplina_' + item.id">
                            {{ item.nome }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Informações Bancárias -->
                <div class="section-card mb-5">
                  <div class="d-flex align-items-center mb-4">
                    <div class="section-icon bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                      <i class="fas fa-university text-danger"></i>
                    </div>
                    <h5 class="mb-0 fw-semibold">Informações Bancárias</h5>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label for="banco" class="form-label fw-medium">Banco</label>
                      <input type="text" class="form-control form-control-lg" id="banco" v-model="form.banco">
                    </div>
                    <div class="col-md-4">
                      <label for="num_conta" class="form-label fw-medium">Número da Conta</label>
                      <input type="text" class="form-control form-control-lg" id="num_conta" v-model="form.num_conta">
                    </div>
                    <div class="col-md-4">
                      <label for="num_iban" class="form-label fw-medium">IBAN</label>
                      <input type="text" class="form-control form-control-lg" id="num_iban" v-model="form.num_iban">
                    </div>
                  </div>
                </div>

                <!-- Autenticação -->
                <div class="section-card mb-5">
                  <div class="d-flex align-items-center mb-4">
                    <div class="section-icon bg-dark bg-opacity-10 p-3 rounded-circle me-3">
                      <i class="fas fa-shield-alt text-dark"></i>
                    </div>
                    <h5 class="mb-0 fw-semibold">Acesso ao Sistema</h5>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <label for="perfil_funcionario" class="form-label fw-medium">Perfil do Funcionário *</label>
                      <select v-model="form.perfil_funcionario" class="form-select form-select-lg" required>
                        <option value="">Selecionar perfil</option>
                        <option value="0">Nenhum Perfil</option>
                        <option v-for="item in regras" :value="item.nome" :key="item.id" v-show="item.nome != 'aluno'">
                          {{ item.nome }}
                        </option>
                      </select>
                      <div class="form-text">Defina as permissões de acesso do funcionário</div>
                    </div>
                  </div>
                </div>

                <!-- Botões de ação -->
                <div class="d-flex justify-content-end gap-3 pt-4 border-top">
                  <button type="button" class="btn btn-outline-secondary btn-lg px-4">
                    <i class="fas fa-times me-2"></i> Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary btn-lg px-4" v-show="!loaderSave">
                    <i class="fas fa-save me-2"></i> Salvar Funcionário
                  </button>
                  <button class="btn btn-primary btn-lg px-4" type="button" disabled v-show="loaderSave">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Salvando...
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from "../../api/api.js"
import * as request from "../../api/request.js"
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import Voltar from '@/components/voltar.vue'

export default {
  components: { navbar, sidebar, LoaderBtnGuardar, Voltar },
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
        num_conta: '',
        num_iban: '',
        banco: '',
        data_admissao: '',
        data_nomeacao: '',
        situacao: '',
        especialidade: '',
        grau_academico: '',
        email: '',
        password: '12345678',
        cargosSelecionados: [],
        disciplinasSelecionadas: [],
        perfil_funcionario: '',
        escola_id: 1,
      },
      cargos: [],
      disciplinas: [],
      loaderSave: false,
      loader_funcao: false,
      loader_disciplina: false,
      regras: []
    };
  },
  async mounted() {
    await this.fetchRegras()
    await this.fetchCargos()
    await this.fetchDisciplinas()
  },
  methods: {
    async fetchRegras() { 
      try {
        const response =  await api.listar("regras");
        this.regras = response

      } catch (error) {
        alert("Ocorreu um erro")
      }
    },
    async fetchCargos() {
      this.loader_funcao = true 
      try {
        const response = await api.listar(request.funcoesListar)
        this.cargos = response.data
        this.loader_funcao = false
      } catch (error) {
        alert("Ocorreu um erro")
        this.loader_funcao = false
      }
    },
    async fetchDisciplinas() {
      this.loader_disciplina = true
      try {
        const response = await api.listar(request.disciplinasListar)
        this.disciplinas = response.data
        this.loader_disciplina = false
      } catch (error) {
        alert("Ocorreu um erro")
        this.loader_disciplina = false
      }
    },
    async submitForm() {
      this.loaderSave = true
      try {
        const payload = {
          ...this.form,
          cargos: this.form.cargosSelecionados,
          disciplinas: this.form.disciplinasSelecionadas
        }
  
        const resp = await api.add(request.funcionariosAdd ,payload)
  
        // alert('Adicionado com sucesso!')
        alert("Cadastrado com sucesso")
        this.loaderSave = false
        this.$router.push('/funcionarios')
      } catch (error) {
        console.error('Erro ao adicionar:', error)
        alert(error.response.data.mensagem);
        this.loaderSave = false
      }
    }
  }
}
</script>

<style scoped>
  /* Estilos para o template modernizado */
.section-card {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #4a90e2;
}

.section-card:hover {
  background: #f1f5f9;
  transition: background 0.3s ease;
}

.section-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-check {
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.card-check:hover {
  border-color: #4a90e2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.1);
}

.form-control-lg, .form-select-lg {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
}

.form-control-lg:focus, .form-select-lg:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.page-header {
  /* background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); */
  padding: 2rem;
  border-radius: 12px;
  color: #000;
}

.page-header .breadcrumb {
  background: transparent;
  padding: 0;
}

.page-header .breadcrumb-item a {
  color: #000 !important;
}

.page-header .breadcrumb-item.active {
  color: white !important;
}

.btn-lg {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
}

.card {
  border: none;
  border-radius: 16px;
  overflow: hidden;
}

.alert-light {
  background: #f8fafc;
  border-radius: 8px;
}

.input-group-text {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

/* Responsividade */
@media (max-width: 768px) {
  .section-card {
    padding: 1rem;
  }
  
  .btn-lg {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .d-flex.justify-content-end.gap-3 {
    flex-direction: column;
  }
}
</style>
