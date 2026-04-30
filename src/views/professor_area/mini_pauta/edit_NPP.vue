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
        <div class="col-12 col-md-8 mb-3 mb-md-0">
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
        <div class="col-12 col-md-4 mb-3">
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
                        <div class="col-3" v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`mobile-1-${tipo}`">
                          <label class="small text-muted mb-1">{{ tipo.toUpperCase() }}</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm nota-mobile"
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
                        <div class="col-3" v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`mobile-2-${tipo}`">
                          <label class="small text-muted mb-1">{{ tipo.toUpperCase() }}</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm nota-mobile"
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
                        <div class="col-3" v-for="tipo in ['mac', 'npp', 'npt', 'mt']" :key="`mobile-3-${tipo}`">
                          <label class="small text-muted mb-1">{{ tipo.toUpperCase() }}</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm nota-mobile"
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
import * as api from '../../../api/api.js'
import * as request from '../../../api/request.js'
import Loader_1 from '@/components/loader_1.vue'

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      search: '',
      trimestres: {
        primeiro: true,
        segundo: false,
        terceiro: false
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

    // garantir que temos um array
    let alunosResp = response && response.alunos ? response.alunos : []
    if (!Array.isArray(alunosResp)) {
      // se veio um object com chaves, transformamos em array (mantendo os valores)
      alunosResp = Object.values(alunosResp)
    }

    // Normalizar cada aluno: garantir estrutura de notas compatível com o template atual
    // (ter tanto as chaves numéricas 1,2,3 quanto as textuais 'primeiro','segundo','terceiro')
    const mapText = { 1: 'primeiro', 2: 'segundo', 3: 'terceiro' }
    const mapNum  = { 'primeiro': 1, 'segundo': 2, 'terceiro': 3 }

    const normalized = alunosResp.map(a => {
      // clonar para evitar mutações inesperadas
      const aluno = JSON.parse(JSON.stringify(a))

      if (!aluno.notas || typeof aluno.notas !== 'object') {
        aluno.notas = {}
      }

      // garantir chaves numéricas e textuais apontando para objetos com os campos esperados
      for (const triNum of [1,2,3]) {
        const triText = mapText[triNum]
        // priorizar valores vindos exatamente com essa chave (string or number)
        const fromNumKey = aluno.notas[triNum] ?? aluno.notas[String(triNum)]
        const fromTextKey = aluno.notas[triText]

        // escolha a fonte de dados (numérica ou textual), preferindo numérica se existir
        const source = fromNumKey ?? fromTextKey ?? { mac: null, npp: null, npt: null, mt: null }

        // garantir números
        const safe = {
          mac: (source.mac === null || source.mac === '' || source.mac === undefined) ? null : Number(source.mac),
          npp: (source.npp === null || source.npp === '' || source.npp === undefined) ? null : Number(source.npp),
          npt: (source.npt === null || source.npt === '' || source.npt === undefined) ? null : Number(source.npt),
          mt:  (source.mt  === null || source.mt  === '' || source.mt  === undefined) ? null : Number(source.mt)
        }

        // setar ambas representações
        aluno.notas[triNum] = safe
        aluno.notas[String(triNum)] = safe
        aluno.notas[triText] = safe
      }

      // garantir mini_pauta_id presente (caso backend não envie)
      aluno.mini_pauta_id = aluno.mini_pauta_id ?? (response.mini_pauta_id ?? null)

      return aluno
    })

    this.alunos = normalized
    this.alunosFiltrados = [...this.alunos]

    console.log('Mini pautas carregadas com sucesso.', this.alunos.length)
  } catch (error) {
    console.error('Erro ao carregar mini pautas:', error)
  } finally {
    // garante que o loader sempre será desligado
    this.loader = false
  }
},

    // utilitário — coloque aqui dentro (dentro de methods)
  _mapTrimestre(trimestre) {
    const map = {
      '1': '1',
      '2': '2',
      '3': '3',
      'primeiro': '1',
      'segundo': '2',
      'terceiro': '3'
    }
    return map[String(trimestre)] || null
  },

    async salvarNota(alunoId, trimestre, tipoNota, valor) {
      // normalizar trimestre (aceita '1','2','3' ou 'primeiro'...'terceiro')
      const t = this._mapTrimestre(trimestre)
      if (!t) {
        console.warn('Trimestre inválido em salvarNota:', trimestre)
        return
      }

      // encontrar aluno
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) {
        console.warn('Aluno não encontrado em salvarNota:', alunoId)
        return
      }

      // garantir estrutura básica de notas (evita TypeError)
      if (!aluno.notas || typeof aluno.notas !== 'object') {
        aluno.notas = {}
      }
      if (!aluno.notas[t] || typeof aluno.notas[t] !== 'object') {
        // inicializa com campos padrão
        aluno.notas[t] = { mac: null, npp: null, npt: null, mt: null }
      }

      // normalizar/validar valor
      let v = (valor === '' || valor === null || valor === undefined) ? null : Number(valor)
      if (v !== null && Number.isNaN(v)) v = null
      if (v !== null) {
        if (v < 0) v = 0
        if (v > 20) v = 20
        v = Math.round(v * 10) / 10
      }

      // atribuir com segurança
      aluno.notas[t][tipoNota] = v

      // recalcular MT se não for o campo MT
      if (tipoNota !== 'mt') {
        this.calcularMediaTrimestre(alunoId, t)
      }

      // preparar payload
      const miniPautaId = aluno.mini_pauta_id ?? null
      const payload = {
        mini_pauta_id: miniPautaId,
        aluno_id: alunoId,
        trimestre: t, // envio usando nome normalizado (ex: 'primeiro')
        tipo: tipoNota,
        valor: v,
        media_trimestre: aluno.notas[t].mt ?? null,
        media_final: this.calcularMediaFinal(aluno)
      }

      try {
        if (miniPautaId) {
          await api.add(`${request.miniPautasInserirNota}${miniPautaId}`, payload)
        } else {
          await api.add(request.miniPautasInserirNota, payload)
        }
      } catch (error) {
        console.error('Erro ao salvar nota (request):', error, payload)
      }
    },

    salvarTudo() {
      console.log("Salvando todas as notas...")
      // alert("Todas as notas foram salvas com sucesso!")
    },

    recarregarDados() {
      // console.log("Recarregando dados...")
      // this.alunosFiltrados = [...this.alunos]
      // this.search = ''
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

.nota-mobile {
  width: 65px !important;
}
</style>