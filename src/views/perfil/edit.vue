<template>
  <div>
    <navbar />
    <sidebar />

    <div class="main-content" id="mainContent">
      <div class="container-fluid">
        <!-- Cabeçalho da Página -->
        <div class="d-flex justify-content-between align-items-center mb-4 mt-3">
          <div class="d-flex align-items-center">
            <!-- div class="icon-container bg-primary me-3 shadow-sm">
              <i class="fas fa-user text-white"></i>
            </div -->
            <div>
              <h2 class="mb-0">Meu Perfil</h2>
              <p class="text-muted mb-0">Gerencie suas informações e credenciais de segurança.</p>
            </div>
          </div>

          <div>
            <button class="btn btn-outline-secondary me-2" @click="load" :disabled="loading">
              <i class="fas fa-sync-alt me-2"></i> Recarregar
            </button>
          </div>
        </div>

        <!-- Indicador de Carregamento -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-2 text-muted">A carregar dados...</p>
        </div>

        <!-- Conteúdo Principal com Cartão e Abas -->
        <div v-else class="card shadow-lg border-0">
          <div class="card-body p-4">
            <div class="row">
              
              <!-- Coluna 1: Avatar / Info Resumida -->
              <div class="col-md-3 text-center mb-4 border-end">
                <div class="avatar rounded-circle mx-auto d-flex align-items-center justify-content-center shadow-sm">
                  <span class="avatar-initials">{{ initials }}</span>
                </div>
                <h5 class="mt-3 mb-1">{{ displayName }}</h5>
                <p class="text-primary small mb-0 fw-semibold">
                {{ formatarNome(perfilFuncionario) || 'Função não definida' }}</p>
                <p class="text-muted small mb-0">{{ formUser.email || 'Não informado' }}</p>
                <!-- p class="text-muted small mt-2">ID Funcionário: {{ form.id ?? '—' }}</p -->
              </div>

              <!-- Coluna 2: Abas de Detalhes e Segurança -->
              <div class="col-md-9">
                
                <!-- Mensagens de Alerta -->
                <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                  {{ errorMessage }}
                  <button type="button" class="btn-close" @click="errorMessage = ''"></button>
                </div>
                <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                  {{ successMessage }}
                  <button type="button" class="btn-close" @click="successMessage = ''"></button>
                </div>

                <!-- Navegação por Abas (Tabs) -->
                <ul class="nav nav-pills mb-4" id="profileTab" role="tablist">
                  <li class="nav-item mb-2" role="presentation">
                    <button class="nav-link bg-secondary text-white active mx-md-2" id="details-tab" data-bs-toggle="pill" data-bs-target="#details" type="button" role="tab" aria-controls="details" aria-selected="true">
                      <i class="fas fa-info-circle me-2"></i> Dados Detalhados
                    </button>
                  </li>
                  <li class="nav-item mb-2" role="presentation">
                    <button class="nav-link bg-secondary text-white" id="security-tab" data-bs-toggle="pill" data-bs-target="#security" type="button" role="tab" aria-controls="security" aria-selected="false">
                      <i class="fas fa-lock me-2"></i> Segurança
                    </button>
                  </li>
                </ul>

                <!-- Conteúdo das Abas -->
                <div class="tab-content" id="profileTabContent">
                  
                  <!-- Aba 1: Dados Detalhados (Leitura) -->
                  <div class="tab-pane fade show active" id="details" role="tabpanel" aria-labelledby="details-tab">
                    
                    <h6 class="border-bottom pb-2 mb-3"><i class="fas fa-id-card me-2 text-primary"></i> Informações do Funcionário</h6>
                    
                    <div class="row mb-3">
                      <!-- Detalhes à Esquerda -->
                      <div class="col-md-6">
                        <div class="detail-group">
                            <label class="detail-label">Nome Completo:</label>
                            <p class="detail-value">{{ form.nome_completo || 'Não informado' }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">Gênero:</label>
                            <p class="detail-value">{{ form.genero || 'Não informado' }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">Data de Nascimento:</label>
                            <p class="detail-value">{{ formatDate(form.data_nascimento) }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">BI:</label>
                            <p class="detail-value">{{ form.bi || 'Não informado' }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">Telefone:</label>
                            <p class="detail-value">{{ form.telefone || 'Não informado' }}</p>
                        </div>
                      </div>

                      <!-- Detalhes à Direita -->
                      <div class="col-md-6">
                        <div class="detail-group">
                            <label class="detail-label">Salário (Base):</label>
                            <p class="detail-value">{{ formatMoney(form.salario) }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">Data de Admissão:</label>
                            <p class="detail-value">{{ formatDate(form.data_admissao) }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">Grau Acadêmico:</label>
                            <p class="detail-value">{{ form.grau_academico || 'Não informado' }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">Especialidade:</label>
                            <p class="detail-value">{{ form.especialidade || 'Não informado' }}</p>
                        </div>
                        <div class="detail-group">
                            <label class="detail-label">Situação:</label>
                            <p class="detail-value">{{ form.situacao || 'Não informado' }}</p>
                        </div>
                      </div>
                    </div>

                    <h6 class="border-bottom pb-2 mt-4 mb-3"><i class="fas fa-briefcase me-2 text-primary"></i> Cargos e Disciplinas Atuais</h6>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Cargos:</label>
                            <div class="mb-3">
                              <span v-if="selectedCargoNames.length" v-for="(cname, idx) in selectedCargoNames" :key="idx" class="badge bg-primary text-white me-1 mb-1">{{ cname }}</span>
                              <p v-else class="form-control-plaintext">—</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Disciplinas:</label>
                            <div class="mb-3">
                              <span v-if="selectedDisciplinaNames.length" v-for="(dname, idx) in selectedDisciplinaNames" :key="idx" class="badge bg-info text-dark me-1 mb-1">{{ dname }}</span>
                              <p v-else class="form-control-plaintext">—</p>
                            </div>
                        </div>
                    </div>

                  </div>
                  
                  <!-- Aba 2: Segurança (Alterar Senha) -->
                  <div class="tab-pane fade" id="security" role="tabpanel" aria-labelledby="security-tab">
                    
                    <h6 class="border-bottom pb-2 mb-4"><i class="fas fa-key me-2 text-danger"></i> Alterar Senha de Acesso</h6>
                    
                    <div class="col-md-8 offset-md-2">
                      <p class="text-muted small mb-3">Para alterar sua senha, preencha todos os campos abaixo, incluindo a sua senha atual para confirmação de segurança.</p>

                      <!-- Senha Atual -->
                      <div class="mb-3">
                        <label for="current-password" class="form-label fw-semibold">Senha Atual <span class="text-danger">*</span></label>
                        <input v-model="currentPassword" id="current-password" type="password" class="form-control" placeholder="Digite sua senha atual" :disabled="saving" />
                      </div>

                      <!-- Nova Senha -->
                      <div class="mb-3">
                        <label for="new-password" class="form-label fw-semibold">Nova Senha <span class="text-danger">*</span></label>
                        <input v-model="newPassword" id="new-password" type="password" class="form-control" placeholder="Mínimo 6 caracteres" :disabled="saving" />
                      </div>

                      <!-- Confirmar Nova Senha -->
                      <div class="mb-3">
                        <label for="confirm-password" class="form-label fw-semibold">Confirmar Nova Senha <span class="text-danger">*</span></label>
                        <input v-model="confirmNewPassword" id="confirm-password" type="password" class="form-control" placeholder="Confirme a nova senha" :disabled="saving" />
                        <div v-if="passwordMismatch" class="text-danger mt-1 small">A nova senha e a confirmação não coincidem.</div>
                      </div>

                      <!-- Botão de Submissão de Senha -->
                      <div class="d-grid mt-4">
                        <button
                          class="btn btn-success btn-lg"
                          :disabled="saving || !isPasswordFormValid"
                          @click="submitPasswordChange"
                        >
                          <i class="fas fa-lock me-2"></i>
                          <span v-if="saving">Salvando...</span>
                          <span v-else>Salvar Nova Senha</span>
                        </button>
                      </div>

                      <div v-if="!isPasswordFormValid && newPassword.length > 0" class="text-warning mt-3 small text-center">
                        <i class="fas fa-exclamation-triangle me-1"></i> Preencha todos os campos de senha e garanta que as novas senhas coincidam.
                      </div>
                    </div>

                  </div>

                </div>

              </div>
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
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import * as api from '@/api/api.js'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  components: { navbar, sidebar, LoaderBtnGuardar },
  data() {
    return {
      loading: true,
      saving: false,
      errorMessage: '',
      successMessage: '',

      // objeto principal (parte funcionario)
      form: {
        id: null,
        escola_id: null,
        user_id: null,
        nome_completo: '',
        genero: '',
        data_nascimento: '',
        telefone: '',
        bairro: '',
        referencia: '',
        bi: '',
        salario: null,
        data_admissao: '',
        situacao: '',
        grau_academico: '',
        especialidade: '',
        data_nomeacao: ''
      },

      // user separadamente
      formUser: {
        id: null,
        name: '',
        email: ''
      },

      // senhas (UI) - editáveis
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',

      // cargos/disciplinas selecionados (IDs) vindos do perfil
      selectedCargoIds: [],
      selectedDisciplinaIds: [],

      // opções carregadas (tenta buscar /funcoes e /disciplinas; se falhar, usa os atuais)
      cargosOptions: [],
      disciplinasOptions: [],
      regrasOptions: [],

      perfilFuncionario: '' // regra a aplicar (nome)
    }
  },
  computed: {
    initials() {
      const name = (this.form.nome_completo || this.formUser.name || '').trim()
      if (!name) return 'US'
      const parts = name.split(' ').filter(p => p.length > 0)
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return parts[0][0].toUpperCase()
    },
    displayName() {
      return this.form.nome_completo || this.formUser.name || 'Usuário'
    },
    // Verifica apenas se as senhas nova/confirmação batem
    passwordMismatch() {
      // Verifica se a nova senha foi digitada
      if (!this.newPassword) return false
      // Se digitada, verifica se a confirmação é diferente
      return this.newPassword !== this.confirmNewPassword
    },
    // Validação completa para o formulário de senha
    isPasswordFormValid() {
      // 1. Senha atual não pode ser vazia
      if (!this.currentPassword) return false
      // 2. Nova senha não pode ser vazia e deve ter um tamanho mínimo (ex: 6)
      // Nota: 6 é um valor de exemplo. Ajuste conforme a política de senha do seu backend.
      if (!this.newPassword || this.newPassword.length < 6) return false 
      // 3. Novas senhas devem ser iguais
      if (this.passwordMismatch) return false

      return true
    },
    selectedCargoNames() {
      return this.selectedCargoIds
        .map(id => (this.cargosOptions.find(c => c.id === id) || {}).nome)
        .filter(Boolean)
    },
    selectedDisciplinaNames() {
      return this.selectedDisciplinaIds
        .map(id => (this.disciplinasOptions.find(d => d.id === id) || {}).nome)
        .filter(Boolean)
    }
  },
  async created() {
    await this.load()
  },
  methods: {
    formatarNome(nome) {
      if (!nome) return "";

      return nome
        .replace(/_/g, " ")               // troca _ por espaço
        .toLowerCase()                    // tudo minúsculo
        .replace(/\b\w/g, c => c.toUpperCase()); // primeira letra maiúscula
    },

    formatDate(val) {
      if (!val) return '—'
      try {
        // Tentativa de formatar no formato brasileiro/português
        const d = new Date(val)
        // Usando toLocaleDateString para garantir formatação regional amigável
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      } catch {
        return val
      }
    },
    formatMoney(val) {
      if (val === null || val === undefined || val === '') return '—'
      try {
        return Number(val).toLocaleString('pt-PT', { 
            style: 'currency', 
            currency: 'AOA', // Assumindo Kwanza Angolano (AOA) como exemplo
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })
      } catch {
        return val
      }
    },

    async load() {
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const res = await api.listar('perfil-funcionario')
        const data = res || {}

        // popula form
        const flds = [
          'id','escola_id','user_id','nome_completo','genero','data_nascimento',
          'telefone','bairro','referencia','bi','salario','data_admissao',
          'situacao','grau_academico','especialidade','data_nomeacao'
        ]
        for (const k of flds) {
          if (data[k] !== undefined) this.form[k] = data[k]
        }

        // user
        if (data.user) {
          this.formUser.id = data.user.id || null
          this.formUser.name = data.user.name || ''
          this.formUser.email = data.user.email || ''
          if (Array.isArray(data.user.regra) && data.user.regra.length) {
            this.perfilFuncionario = data.user.regra[0]?.regra?.nome || ''
          }
        }

        // cargos atuais -> selectedCargoIds and prepare cargosOptions fallback
        if (Array.isArray(data.funcionario_cargos) && data.funcionario_cargos.length) {
          this.selectedCargoIds = data.funcionario_cargos.map(fc => fc.cargo_id)
          this.cargosOptions = data.funcionario_cargos.map(fc => ({
            id: fc.cargo?.id,
            nome: fc.cargo?.nome || (`cargo ${fc.cargo_id}`)
          }))
        }

        // disciplinas atuais
        if (Array.isArray(data.funcionario_disciplinas) && data.funcionario_disciplinas.length) {
          this.selectedDisciplinaIds = data.funcionario_disciplinas.map(fd => fd.disciplina_id)
          this.disciplinasOptions = data.funcionario_disciplinas.map(fd => ({
            id: fd.disciplina?.id,
            nome: fd.disciplina?.nome || (`disciplina ${fd.disciplina_id}`)
          }))
        }

        // tentar carregar listas globais (não obrigatório)
        this.loadOptions()
      } catch (err) {
        console.error('Erro ao carregar /perfil-funcionario:', err)
        this.errorMessage = 'Erro ao carregar dados do perfil.'
        // toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    async loadOptions() {
      try {
        const [cRes, dRes, rRes] = await Promise.allSettled([
          api.listar('funcoes'),
          api.listar('disciplinas'),
          api.listar('regras')
        ])

        if (cRes.status === 'fulfilled' && Array.isArray(cRes.value)) {
            // Combina as opções globais com as opções atuais para garantir que os nomes sejam exibidos corretamente
            const currentCargos = this.cargosOptions.filter(c => !cRes.value.some(r => r.id === c.id));
            this.cargosOptions = [...cRes.value, ...currentCargos];
        }
        if (dRes.status === 'fulfilled' && Array.isArray(dRes.value)) {
             const currentDisciplinas = this.disciplinasOptions.filter(d => !dRes.value.some(r => r.id === d.id));
             this.disciplinasOptions = [...dRes.value, ...currentDisciplinas];
        }
        if (rRes.status === 'fulfilled' && Array.isArray(rRes.value)) this.regrasOptions = rRes.value
      } catch (err) {
        console.warn('Não foi possível carregar opções globais (cargos/disciplinas/regras).', err)
      }
    },

    // Função dedicada para submeter a alteração de senha (inclui senha atual)
    async submitPasswordChange() {
        if (!this.isPasswordFormValid) {
            this.errorMessage = 'Por favor, preencha a senha atual, a nova senha e confirme corretamente.';
            return;
        }

        this.saving = true;
        this.errorMessage = '';
        this.successMessage = '';

        try {
            // Payload contendo a senha atual e a nova senha, conforme solicitado
            const payload = {
                current_password: this.currentPassword,
                password: this.newPassword,
                password_confirmation: this.confirmNewPassword,
            };

            // Endpoint sugerido para uma ação específica de mudança de senha
            let updateUrl = 'perfil-funcionario/update-password'; 

            await api.update(updateUrl, payload);

            this.successMessage = 'Senha alterada com sucesso! Você será desconectado em breve.';
            toast.success(this.successMessage);

            // Limpar senhas na UI após o sucesso
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmNewPassword = '';

        } catch (err) {
            console.error('Erro ao salvar nova senha:', err);
            const msg = err?.response?.data?.message || 'Erro ao salvar nova senha. Senha atual incorreta ou erro no servidor.';
            this.errorMessage = typeof msg === 'string' ? msg : 'Erro ao salvar nova senha.';
            // toast.error(this.errorMessage);
        } finally {
            this.saving = false;
        }
    },
    
    // Função existente, mantida para outros dados (embora o botão esteja ausente no layout atual)
    async submitForm() {
        this.errorMessage = 'Funcionalidade de atualização de dados pessoais temporariamente desativada. Use a aba Segurança para alterar a senha.';
        toast.warning(this.errorMessage);
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}

.icon-container {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #4f46e5, #06b6d4); /* Cores mais vibrantes */
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff; /* Borda branca */
}

.avatar-initials {
  font-size: 32px;
}

/* Estilo para agrupamento de detalhes (substituindo a antiga dl) */
.detail-group {
    margin-bottom: 0.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px dotted #e0e0e0;
}
.detail-label {
    font-weight: 500;
    color: #6c757d;
    display: block;
    font-size: 0.85rem;
    margin-bottom: 0;
}
.detail-value {
    margin-bottom: 0;
    font-weight: 600;
    color: #343a40;
}

/* Melhorias na navegação de abas */
.nav-pills .nav-link.active {
    background-color: #4f46e5 !important;
}

/* Pequenas melhorias visuais para badges */
.badge {
  font-size: 0.85em;
  padding: 0.45em 0.6em;
}
</style>