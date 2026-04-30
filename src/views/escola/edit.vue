<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4 mt-3">
        <div class="d-flex align-items-center">
          <div class="icon-container bg-primary me-3">
            <i class="fas fa-school text-white"></i>
          </div>
          <div>
            <h2 class="mb-0">Configuração da Escola</h2>
            <p class="text-muted mb-0">Gerencie as informações institucionais</p>
          </div>
        </div>
        <!-- <div>
          <div class="btn-group me-2">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-file-import me-2"></i>Importar
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#"><i class="fas fa-user-graduate me-2"></i>Alunos</a></li>
              <li><a class="dropdown-item" href="#"><i class="fas fa-clipboard-list me-2"></i>Pautas</a></li>
            </ul>
          </div>
          
          <div class="btn-group">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-file-export me-2"></i>Exportar
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/exportar?tabela=alunos"><i class="fas fa-user-graduate me-2"></i>Alunos</a></li>
              <li><a class="dropdown-item" href="#"><i class="fas fa-clipboard-list me-2"></i>Pautas</a></li>
            </ul>
          </div>
        </div> -->
      </div>

      <!-- Loading State -->
      <div v-if="resp.length === 0" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2 text-muted">A carregar configurações...</p>
      </div>

      <!-- Formulário -->
      <div v-else class="card shadow border-0">
        <div class="card-header bg-primary text-white py-3">
          <h5 class="mb-0"><i class="fas fa-cog me-2"></i>Informações da Escola</h5>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="submitForm">
            <!-- Informações Básicas -->
            <div class="row mb-4">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3"><i class="fas fa-info-circle me-2 text-primary"></i>Informações Básicas</h6>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome da Escola <span class="text-danger">*</span></label>
                  <input
                    v-model="form.nome"
                    type="text"
                    class="form-control"
                    id="nome"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="nif" class="form-label">NIF <span class="text-danger">*</span></label>
                  <input
                    v-model="form.nif"
                    type="text"
                    class="form-control"
                    id="nif"
                    required
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label for="provincia" class="form-label">Província <span class="text-danger">*</span></label>
                  <input
                    v-model="form.provincia"
                    type="text"
                    class="form-control"
                    id="provincia"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="municipio" class="form-label">Município <span class="text-danger">*</span></label>
                  <input
                    v-model="form.municipio"
                    type="text"
                    class="form-control"
                    id="municipio"
                    required
                  />
                </div>
              </div>
              
              <div class="col-md-6 offset-md-3">
                <div class="mb-3">
                  <label for="bairro" class="form-label">Bairro <span class="text-danger">*</span></label>
                  <input
                    v-model="form.bairro"
                    type="text"
                    class="form-control"
                    id="bairro"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Assinaturas -->
            <div class="row mb-4">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3"><i class="fas fa-signature me-2 text-primary"></i>Assinaturas</h6>
              </div>
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="diretorGeral" class="form-label">Diretor(a) Geral</label>
                  <input
                    v-model="form.diretor_geral"
                    type="text"
                    class="form-control"
                    id="diretorGeral"
                  />
                </div>
                
                <div class="mb-3">
                  <label for="diretorPedagogico" class="form-label">Diretor(a) Pedagógico(a)</label>
                  <input
                    v-model="form.diretor_pedagogico"
                    type="text"
                    class="form-control"
                    id="diretorPedagogico"
                  />
                </div>
                
                <div class="mb-3">
                  <label for="diretorAdministrativo" class="form-label">Diretor(a) Administrativo(a)</label>
                  <input
                    v-model="form.diretor_administrativo"
                    type="text"
                    class="form-control"
                    id="diretorAdministrativo"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label for="secretarioGeral" class="form-label">Secretário(a) Geral</label>
                  <input
                    v-model="form.secretario_geral"
                    type="text"
                    class="form-control"
                    id="secretarioGeral"
                  />
                </div>
                
                <div class="mb-3">
                  <label for="secretarioPedagogico" class="form-label">Secretário(a) Pedagógico(a)</label>
                  <input
                    v-model="form.secretario_pedagogico"
                    type="text"
                    class="form-control"
                    id="secretarioPedagogico"
                  />
                </div>
                
                <div class="mb-3">
                  <label for="secretarioAdministrativo" class="form-label">Secretário(a) Administrativo(a)</label>
                  <input
                    v-model="form.secretario_administrativo"
                    type="text"
                    class="form-control"
                    id="secretarioAdministrativo"
                  />
                </div>
              </div>
            </div>

            <!-- Cabeçalhos -->
            <div class="row mb-4">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3"><i class="fas fa-heading me-2 text-primary"></i>Cabeçalhos</h6>
              </div>
              <div class="col-12">
                <div v-for="(item, index) in form.cabecalhos" :key="index" class="input-group mb-2">
                  <span class="input-group-text">{{ index + 1 }}</span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.cabecalhos[index]"
                    :placeholder="`Texto do cabeçalho ${index + 1}`"
                  />
                  <button type="button" class="btn btn-outline-danger" @click="removeCabecalho(index)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>

                <button type="button" class="btn btn-outline-primary mt-2" @click="addCabecalho">
                  <i class="fas fa-plus me-1"></i> Adicionar Cabeçalho
                </button>
                <p class="text-muted small mt-2">Estes cabeçalhos serão usados em documentos oficiais da escola.</p>
              </div>
            </div>

            <!-- Campos booleanos ocultos -->
            <input type="hidden" v-model="form.nivel_1" />
            <input type="hidden" v-model="form.nivel_2" />
            <input type="hidden" v-model="form.nivel_3" />

            <div class="d-flex justify-content-end border-top pt-4">
              <LoaderBtnGuardar v-if="loaderSave" />
              <button v-else type="submit" class="btn btn-primary px-4">
                <i class="fas fa-save me-2"></i> Guardar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'

export default {
  components: { navbar, sidebar, LoaderBtnGuardar },
  
  data() {
    return {
      form: {
        nome: '',
        nif: '',
        provincia: '',
        municipio: '',
        bairro: '',
        nivel_1: '',
        nivel_2: '',
        nivel_3: '',
        cabecalhos: [],
        user_id: '',

        // 👇 Novos campos do corpo diretivo
        diretor_geral: '',
        diretor_pedagogico: '',
        diretor_administrativo: '',
        secretario_geral: '',
        secretario_pedagogico: '',
        secretario_administrativo: '',
      },
      resp: [],
      loaderSave: false
    }
  },

  async created() {
      try {
        this.resp = await api.getEscola()

        // Garante que cabecalhos seja sempre um array
        if (!Array.isArray(this.resp.cabecalhos)) {
          this.resp.cabecalhos = []
        }

        Object.assign(this.form, this.resp)

      } catch (error) {
        console.log('Erro ao carregar as configurações da escola.')
        console.error(error)
      }
  },

  methods: {
    addCabecalho() {
      this.form.cabecalhos.push('');
    },
    removeCabecalho(index) {
      this.form.cabecalhos.splice(index, 1);
    },

    async submitForm() {
      this.loaderSave = true
      try {
        await api.update(request.escolasUpdate + 1, this.form);
        this.loaderSave = false
        toast.success('Configurações atualizadas com sucesso!')
      } catch (error) {
        this.loaderSave = false
        toast.error('Erro ao atualizar configurações. Verifique os campos.')
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
  overflow: hidden;
}

.icon-container {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-label {
  font-weight: 500;
}

.input-group-text {
  min-width: 40px;
  justify-content: center;
}

.btn-outline-primary:hover {
  transform: translateY(-1px);
}

.card-header {
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
}
</style>