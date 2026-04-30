<template>
  <!-- navbar -->
  <navbar />

  <!-- sidebar -->
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h2 class="mb-1">{{ $route.params.disciplina_nome }}</h2>
          <p class="mb-0 text-muted">{{ $route.params.abreviatura }} {{ $route.params.classe }}ª {{ $route.params.serie }}/ {{ $route.params.turno }} | Ano Letivo: {{ $route.params.ano_letivo }}</p>
        </div>
        <div class="d-flex gap-2">
          <!-- <button class="btn btn-sm btn-primary d-flex align-items-center">
            <i class="fas fa-save me-1"></i><span class="d-none d-md-inline">Salvar</span>
          </button> -->
          <button class="btn btn-outline-secondary btn-sm" @click="recarregarDados">
            <i class="fas fa-sync-alt me-1"></i>Recarregar
          </button>
          <button class="btn btn-sm btn-danger d-flex align-items-center">
            <i class="fas fa-file-pdf me-1"></i><span class="d-none d-md-inline">PDF</span>
          </button>
        </div>
      </div>

      <!-- Controles -->
      <div class="row mb-3">
        <div class="col-12 col-md-8 mb-2 mb-md-0">
          <div class="d-flex flex-wrap align-items-center gap-2">
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="trimestre1" v-model="trimestres.primeiro" checked>
              <label class="form-check-label" for="trimestre1">1º Trim</label>
            </div>
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="trimestre2" v-model="trimestres.segundo" checked>
              <label class="form-check-label" for="trimestre2">2º Trim</label>
            </div>
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="trimestre3" v-model="trimestres.terceiro" checked>
              <label class="form-check-label" for="trimestre3">3º Trim</label>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="input-group input-group-sm">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Pesquisar aluno..."
              @input="filtrarAlunos"
            />
            <button class="btn btn-outline-secondary">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="loader">
        <Loader_1/>
      </div>

      <div v-else>
        <!-- Versão Desktop -->
        <div class="d-none d-lg-block">
          <div class="table-responsive">
            <table class="table table-bordered table-hover mb-0">
              <thead class="table-light sticky-top">
                <tr>
                  <th rowspan="2" class="align-middle" style="width: 50px;">Nº</th>
                  <th rowspan="2" class="align-middle">Nome do Aluno</th>
                  
                  <template v-if="trimestres.primeiro">
                    <th colspan="4" class="text-center bg-primary text-white">1º Trimestre</th>
                  </template>
                  
                  <template v-if="trimestres.segundo">
                    <th colspan="4" class="text-center bg-success text-white">2º Trimestre</th>
                  </template>
                  
                  <template v-if="trimestres.terceiro">
                    <th colspan="4" class="text-center bg-info text-white">3º Trimestre</th>
                  </template>
                  
                  <th rowspan="2" class="align-middle text-center bg-warning" style="width: 80px;">MF</th>
                </tr>
                <tr>
                  <template v-if="trimestres.primeiro">
                    <th class="text-center" style="width: 70px;">MAC</th>
                    <th class="text-center" style="width: 70px;">NPP</th>
                    <th class="text-center" style="width: 70px;">NPT</th>
                    <th class="text-center" style="width: 70px;">MT</th>
                  </template>
                  
                  <template v-if="trimestres.segundo">
                    <th class="text-center" style="width: 70px;">MAC</th>
                    <th class="text-center" style="width: 70px;">NPP</th>
                    <th class="text-center" style="width: 70px;">NPT</th>
                    <th class="text-center" style="width: 70px;">MT</th>
                  </template>
                  
                  <template v-if="trimestres.terceiro">
                    <th class="text-center" style="width: 70px;">MAC</th>
                    <th class="text-center" style="width: 70px;">NPP</th>
                    <th class="text-center" style="width: 70px;">NPT</th>
                    <th class="text-center" style="width: 70px;">MT</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
                  <td>{{ aluno.numero }}</td>
                  <td>{{ aluno.nome }}</td>
                  
                  <!-- 1º Trimestre -->
                  <template v-if="trimestres.primeiro">
                    <td v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`1-${tipo}`">
                      <input 
                        type="number" 
                        class="form-control form-control-sm text-center input-nota"
                        v-model="aluno.notas.primeiro[tipo]"
                        @blur="salvarNota(aluno.id, '1', tipo, aluno.notas.primeiro[tipo])"
                        min="0"
                        max="20"
                        step="0.1"
                      >
                    </td>
                  </template>
                  
                  <!-- 2º Trimestre -->
                  <template v-if="trimestres.segundo">
                    <td v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`2-${tipo}`">
                      <input 
                        type="number" 
                        class="form-control form-control-sm text-center input-nota"
                        v-model="aluno.notas.segundo[tipo]"
                        @blur="salvarNota(aluno.id, '2', tipo, aluno.notas.segundo[tipo])"
                        min="0"
                        max="20"
                        step="0.1"
                      >
                    </td>
                  </template>
                  
                  <!-- 3º Trimestre -->
                  <template v-if="trimestres.terceiro">
                    <td v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`3-${tipo}`">
                      <input 
                        type="number" 
                        class="form-control form-control-sm text-center input-nota"
                        v-model="aluno.notas.terceiro[tipo]"
                        @blur="salvarNota(aluno.id, '3', tipo, aluno.notas.terceiro[tipo])"
                        min="0"
                        max="20"
                        step="0.1"
                      >
                    </td>
                  </template>
                  
                  <td>
                    <input 
                      type="text" 
                      class="form-control form-control-sm text-center bg-light"
                      :value="calcularMediaFinal(aluno)"
                      readonly
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Versão Mobile -->
        <div class="d-lg-none">
          <div class="accordion" id="accordionAlunos">
            <div class="accordion-item mb-2" v-for="aluno in alunosFiltrados" :key="'mobile-'+aluno.id">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+aluno.id" style="font-weight: bold;">
                  <span class="badge bg-secondary me-2">{{ aluno.numero }}</span>
                  {{ aluno.nome }}
                  <span class="ms-auto badge bg-warning text-dark">{{ calcularMediaFinal(aluno) }}</span>
                </button>
              </h2>
              <div :id="'collapse'+aluno.id" class="accordion-collapse collapse" data-bs-parent="#accordionAlunos">
                <div class="accordion-body p-2">
                  <div v-if="trimestres.primeiro" class="mb-3">
                    <h6 class="bg-primary text-white p-2 rounded-top mb-0">1º Trimestre</h6>
                    <div class="border p-2 rounded-bottom">
                      <div class="row g-2">
                        <div class="col-6" v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`mobile-1-${tipo}`">
                          <label class="small text-muted mb-1">{{ tipo.toUpperCase() }}</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm"
                            v-model="aluno.notas.primeiro[tipo]"
                            @blur="salvarNota(aluno.id, '1', tipo, aluno.notas.primeiro[tipo])"
                            min="0"
                            max="20"
                            step="0.1"
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="trimestres.segundo" class="mb-3">
                    <h6 class="bg-success text-white p-2 rounded-top mb-0">2º Trimestre</h6>
                    <div class="border p-2 rounded-bottom">
                      <div class="row g-2">
                        <div class="col-6" v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`mobile-2-${tipo}`">
                          <label class="small text-muted mb-1">{{ tipo.toUpperCase() }}</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm"
                            v-model="aluno.notas.segundo[tipo]"
                            @blur="salvarNota(aluno.id, '2', tipo, aluno.notas.segundo[tipo])"
                            min="0"
                            max="20"
                            step="0.1"
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="trimestres.terceiro">
                    <h6 class="bg-info text-white p-2 rounded-top mb-0">3º Trimestre</h6>
                    <div class="border p-2 rounded-bottom">
                      <div class="row g-2">
                        <div class="col-6" v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`mobile-3-${tipo}`">
                          <label class="small text-muted mb-1">{{ tipo.toUpperCase() }}</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm"
                            v-model="aluno.notas.terceiro[tipo]"
                            @blur="salvarNota(aluno.id, '3', tipo, aluno.notas.terceiro[tipo])"
                            min="0"
                            max="20"
                            step="0.1"
                          >
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


      <!-- <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-outline-secondary btn-sm" @click="recarregarDados">
          <i class="fas fa-sync-alt me-1"></i>Recarregar
        </button>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm" @click="salvarTudo">
            <i class="fas fa-save me-1"></i>Salvar Tudo
          </button>
          <button class="btn btn-danger btn-sm">
            <i class="fas fa-file-pdf me-1"></i>PDF
          </button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import Loader_1 from '@/components/loader_1.vue'

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      search: '',
      trimestres: {
        primeiro: true,
        segundo: true,
        terceiro: true
      },
      alunos: [/* ... seus dados simulados ... */],
      alunosFiltrados: [],
      loader: false
    }
  },

  created() {
    this.carregarMiniPautas()
    this.alunosFiltrados = [...this.alunos]
  },

  methods: {
    filtrarAlunos() {
      if (!this.search) {
        this.alunosFiltrados = [...this.alunos]
        return
      }

      const termo = this.search.toLowerCase()
      this.alunosFiltrados = this.alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.numero.toString().includes(termo)
      )
    },

    async carregarMiniPautas() {
      this.loader = true

      try {
        const anoLetivo = encodeURIComponent(this.$route.params.ano_letivo);

        const response = await api.listar(
          `${request.miniPautasListar}/${this.$route.params.turma_id || "nd"}/${this.$route.params.disciplina_id || "nd"}/${anoLetivo || "nd"}`
        );

        this.alunos = response.alunos || []  // ou a estrutura correta retornada
        this.alunosFiltrados = [...this.alunos]

        this.loader = false
        console.log('Mini pautas carregadas com sucesso.')
      } catch (error) {
        console.error('Erro ao carregar mini pautas:', error)
      }
    },

    async salvarNota(alunoId, trimestre, tipoNota, valor) {
      if (valor < 0) valor = 0
      if (valor > 20) valor = 20

      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return

      aluno.notas[trimestre][tipoNota] = parseFloat(valor)

      if (tipoNota !== 'mt') {
        this.calcularMediaTrimestre(alunoId, trimestre)
      }

      const miniPautaId = aluno.mini_pauta_id

      const payload = {
        mini_pauta_id: this.$route.params.id,
        aluno_id: alunoId,
        trimestre,
        tipo: tipoNota,
        valor: parseFloat(valor),
        media_trimestre: aluno.notas[trimestre].mt ?? null,
        media_final: this.calcularMediaFinal(aluno)
      }

      try {
        await api.add(`${request.miniPautasInserirNota}${2}`, payload)
        console.log(`Nota enviada: mini_pauta_id=${miniPautaId}, aluno ${alunoId}, ${trimestre}, ${tipoNota} = ${valor}`)
      } catch (error) {
        console.error('Erro ao salvar nota:', error)
      }
    },

    salvarTudo() {
      console.log("Salvando todas as notas...")
      alert("Todas as notas foram salvas com sucesso!")
    },

    recarregarDados() {
      console.log("Recarregando dados...")
      this.alunosFiltrados = [...this.alunos]
      this.search = ''
    },

    calcularMediaTrimestre(alunoId, trimestre) {
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return

      const notas = aluno.notas[trimestre]
      const soma = (notas.mac || 0) + (notas.npp || 0) + (notas.npt || 0)
      notas.mt = parseFloat((soma / 3).toFixed(1))
    },

    calcularMediaFinal(aluno) {
      const mt1 = aluno.notas.primeiro.mt || 0
      const mt2 = aluno.notas.segundo.mt || 0
      const mt3 = aluno.notas.terceiro.mt || 0
      return ((mt1 + mt2 + mt3) / 3).toFixed(1)
    }
  }

}
</script>

<style scoped>
/* Estilos para desktop */
.table th {
  white-space: nowrap;
  position: sticky;
  top: 0;
}

.input-nota {
  max-width: 70px;
  margin: 0 auto;
  padding: 0.25rem;
}

.bg-primary, .bg-success, .bg-info, .bg-warning {
  opacity: 0.9;
}

.form-switch .form-check-input {
  width: 2.5em;
  height: 1.5em;
}

.table-responsive {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

/* Estilos para mobile */
.accordion-button {
  font-size: 0.9rem;
}

.accordion-body {
  padding: 0.5rem;
}

.accordion-item {
  border-radius: 0.5rem !important;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Estilos gerais */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

@media (max-width: 576px) {
  .main-content {
    padding: 0.5rem;
  }
  
  .container-fluid {
    padding: 0;
  }
}
</style>