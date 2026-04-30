<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h2 class="mb-1">{{ $route.params.disciplina_nome }}</h2>
          <p class="mb-0 text-muted">
            {{ $route.params.abreviatura }} {{ $route.params.classe }}ª {{ $route.params.serie }}/ {{ $route.params.turno }}
            | Ano Letivo: {{ $route.params.ano_letivo }}
          </p>
        </div>

        <div class="d-flex gap-2">
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
        <div class="col-12 col-md-8 mb-3 mb-md-0 p-0">
          <div class="d-flex flex-wrap align-items-center gap-3">
            <div class="form-check0 form-switch0 mb-0 me-2 d-flex">
              <input class="form-check-input0 me-1" type="checkbox" id="trimestre1" v-model="trimestres.primeiro">
              <label class="form-check-label" for="trimestre1">1º Trim</label>
            </div>

            <div class="form-check0 form-switch0 mb-0 me-2 d-flex">
              <input class="form-check-input0 me-1" type="checkbox" id="trimestre2" v-model="trimestres.segundo">
              <label class="form-check-label" for="trimestre2">2º Trim</label>
            </div> 

            <div class="form-check0 form-switch0 mb-0 me-2 d-flex">
              <input class="form-check-input0 me-1" type="checkbox" id="trimestre3" v-model="trimestres.terceiro">
              <label class="form-check-label" for="trimestre3">3º Trim</label>
            </div>

            <div class="form-check0 form-switch0 mb-0 me-2 d-flex ms-3">
              <input class="form-check-input0 me-1" type="checkbox" id="recursoSwitch" v-model="recursoAtivo">
              <label class="form-check-label" for="recursoSwitch">Ativar Recurso</label>
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
            <button class="btn btn-outline-secondary" type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="loader">
        <Loader_1 />
      </div>

      <div v-else>
        <!-- Desktop table -->
        <div class="table-wrapper d-none d-lg-block">
          <div class="table-responsive-simple">
            <!-- key força re-render quando colunas mudam -->
            <table class="table table-bordered mb-0" :key="tableKey">
              <thead class="table-light">
                <tr>
                  <th style="width:50px" rowspan="2">Nº</th>
                  <!-- adicionada a classe col-nome -->
                  <th class="col-nome" rowspan="2">Nome do Aluno</th>

                  <template v-if="trimestres.primeiro">
                    <th colspan="3" class="text-center">1º Trimestre</th>
                  </template>

                  <template v-if="trimestres.segundo">
                    <th colspan="3" class="text-center">2º Trimestre</th>
                  </template>

                  <template v-if="trimestres.terceiro">
                    <th colspan="3" class="text-center">3º Trimestre</th>
                  </template>

                  <th rowspan="2" style="width:80px" class="text-center">MF</th>

                  <th v-if="recursoAtivo" rowspan="2" style="width:70px" class="text-center">R</th>
                  <th v-if="recursoAtivo" rowspan="2" style="width:90px" class="text-center">MFR</th>
                </tr>

                <tr>
                  <template v-if="trimestres.primeiro">
                    <th class="text-center">MAC</th>
                    <th class="text-center">NPT</th>
                    <th class="text-center">MT</th>
                  </template>

                  <template v-if="trimestres.segundo">
                    <th class="text-center">MAC</th>
                    <th class="text-center">NPT</th>
                    <th class="text-center">MT</th>
                  </template>

                  <template v-if="trimestres.terceiro">
                    <th class="text-center">MAC</th>
                    <th class="text-center">NPT</th>
                    <th class="text-center">MT</th>
                  </template>
                </tr>
              </thead>

              <tbody>
                <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
                  <td class="align-middle">{{ aluno.numero }}</td>
                  <!-- aplica a classe col-nome também no TD -->
                  <td class="col-nome align-middle">{{ aluno.nome }}</td>

                  <!-- 1º Trimestre -->
                  <template v-if="trimestres.primeiro">
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.primeiro.mac"
                        @blur="salvarNota(aluno.id, '1', 'mac', aluno.notas.primeiro.mac)"
                        :class="notaClass(aluno, 'primeiro', 'mac')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.primeiro.npt"
                        @blur="salvarNota(aluno.id, '1', 'npt', aluno.notas.primeiro.npt)"
                        :class="notaClass(aluno, 'primeiro', 'npt')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.primeiro.mt"
                        @blur="salvarNota(aluno.id, '1', 'mt', aluno.notas.primeiro.mt)"
                        :class="notaClass(aluno, 'primeiro', 'mt')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                  </template>

                  <!-- 2º Trimestre -->
                  <template v-if="trimestres.segundo">
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.segundo.mac"
                        @blur="salvarNota(aluno.id, '2', 'mac', aluno.notas.segundo.mac)"
                        :class="notaClass(aluno, 'segundo', 'mac')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.segundo.npt"
                        @blur="salvarNota(aluno.id, '2', 'npt', aluno.notas.segundo.npt)"
                        :class="notaClass(aluno, 'segundo', 'npt')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.segundo.mt"
                        @blur="salvarNota(aluno.id, '2', 'mt', aluno.notas.segundo.mt)"
                        :class="notaClass(aluno, 'segundo', 'mt')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                  </template>

                  <!-- 3º Trimestre -->
                  <template v-if="trimestres.terceiro">
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.terceiro.mac"
                        @blur="salvarNota(aluno.id, '3', 'mac', aluno.notas.terceiro.mac)"
                        :class="notaClass(aluno, 'terceiro', 'mac')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.terceiro.npt"
                        @blur="salvarNota(aluno.id, '3', 'npt', aluno.notas.terceiro.npt)"
                        :class="notaClass(aluno, 'terceiro', 'npt')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control form-control-sm nota-input"
                        v-model="aluno.notas.terceiro.mt"
                        @blur="salvarNota(aluno.id, '3', 'mt', aluno.notas.terceiro.mt)"
                        :class="notaClass(aluno, 'terceiro', 'mt')"
                        min="0" max="20" step="0.1"
                      />
                    </td>
                  </template>

                  <!-- MF -->
                  <td class="align-middle text-center">
                    <input
                      type="text"
                      class="form-control form-control-sm text-center nota-input"
                      :value="calcularMediaFinal(aluno)"
                      readonly
                      :class="{
                        'nota-text-baixa': isMediaBaixa(aluno),
                        'nota-text-alta': isMediaAlta(aluno)
                      }"
                    />
                  </td>

                  <!-- Recurso -->
                  <td v-if="recursoAtivo" class="align-middle">
                    <input
                      type="number"
                      class="form-control form-control-sm nota-input"
                      v-model="aluno.recurso"
                      @blur="salvarRecurso(aluno.id)"
                      :class="{
                        'nota-text-baixa': isValorBaixo(aluno.recurso),
                        'nota-text-alta': isValorAlto(aluno.recurso)
                      }"
                      min="0" max="20" step="0.1"
                    />
                  </td>

                  <!-- MFR (mostra só se recurso preenchido) -->
                  <td v-if="recursoAtivo" class="align-middle text-center">
                    <input
                      type="text"
                      class="form-control form-control-sm text-center nota-input"
                      :value="calcularMFR(aluno)"
                      readonly
                      :class="{
                        'nota-text-baixa': aluno.recurso !== null && aluno.recurso !== '' && isValorBaixo(calcularMFRNumber(aluno)),
                        'nota-text-alta': aluno.recurso !== null && aluno.recurso !== '' && isValorAlto(calcularMFRNumber(aluno))
                      }"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile / accordion -->
        <div class="d-lg-none">
          <div class="accordion" id="accordionAlunos">
            <div class="accordion-item mb-2" v-for="aluno in alunosFiltrados" :key="'mobile-'+aluno.id">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed py-2" type="button"
                        data-bs-toggle="collapse" :data-bs-target="'#collapse'+aluno.id">
                  <span class="badge me-2">{{ aluno.numero }}</span>
                  {{ aluno.nome }}
                  <span class="ms-auto badge" :class="{'nota-text-baixa': isMediaBaixa(aluno),'nota-text-alta': isMediaAlta(aluno)}">
                    {{ calcularMediaFinal(aluno) }}
                  </span>
                </button>
              </h2>
              <div :id="'collapse'+aluno.id" class="accordion-collapse collapse" data-bs-parent="#accordionAlunos">
                <div class="accordion-body p-2">

                  <div v-if="trimestres.primeiro" class="mb-2">
                    <h6 class="mb-1">1º Trimestre</h6>
                    <div class="row g-2">
                      <div class="col-4" v-for="tipo in ['mac','npt','mt']" :key="`m-1-${tipo}`">
                        <label class="small mb-1">{{ tipo.toUpperCase() }}</label>
                        <input
                          type="number"
                          class="form-control form-control-sm"
                          v-model="aluno.notas.primeiro[tipo]"
                          @blur="salvarNota(aluno.id, '1', tipo, aluno.notas.primeiro[tipo])"
                          :class="notaClass(aluno, 'primeiro', tipo)"
                          min="0" max="20" step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  <div v-if="trimestres.segundo" class="mb-2">
                    <h6 class="mb-1">2º Trimestre</h6>
                    <div class="row g-2">
                      <div class="col-4" v-for="tipo in ['mac','npt','mt']" :key="`m-2-${tipo}`">
                        <label class="small mb-1">{{ tipo.toUpperCase() }}</label>
                        <input
                          type="number"
                          class="form-control form-control-sm"
                          v-model="aluno.notas.segundo[tipo]"
                          @blur="salvarNota(aluno.id, '2', tipo, aluno.notas.segundo[tipo])"
                          :class="notaClass(aluno, 'segundo', tipo)"
                          min="0" max="20" step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  <div v-if="trimestres.terceiro" class="mb-2">
                    <h6 class="mb-1">3º Trimestre</h6>
                    <div class="row g-2">
                      <div class="col-4" v-for="tipo in ['mac','npt','mt']" :key="`m-3-${tipo}`">
                        <label class="small mb-1">{{ tipo.toUpperCase() }}</label>
                        <input
                          type="number"
                          class="form-control form-control-sm"
                          v-model="aluno.notas.terceiro[tipo]"
                          @blur="salvarNota(aluno.id, '3', tipo, aluno.notas.terceiro[tipo])"
                          :class="notaClass(aluno, 'terceiro', tipo)"
                          min="0" max="20" step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row g-2 align-items-center mt-2">
                    <!-- <div class="col-6">
                      <label class="small mb-1">MF</label>
                      <input type="text" class="form-control form-control-sm" :value="calcularMediaFinal(aluno)" readonly
                             :class="{'nota-text-baixa': isMediaBaixa(aluno),'nota-text-alta': isMediaAlta(aluno)}" />
                    </div> -->

                    <div v-if="recursoAtivo" class="col-6">
                      <label class="small mb-1">Recurso</label>
                      <input type="number" class="form-control form-control-sm"
                             v-model="aluno.recurso" @blur="salvarRecurso(aluno.id)"
                             :class="{'nota-text-baixa': isValorBaixo(aluno.recurso),'nota-text-alta': isValorAlto(aluno.recurso)}"
                             min="0" max="20" step="0.1" />
                    </div>

                    <div v-if="recursoAtivo" class="col-6 mt-2">
                      <label class="small mb-1">MFR</label>
                      <input type="text" class="form-control form-control-sm" :value="calcularMFR(aluno)" readonly
                             :class="{'nota-text-baixa': aluno.recurso !== null && isValorBaixo(calcularMFRNumber(aluno)),'nota-text-alta': aluno.recurso !== null && isValorAlto(calcularMFRNumber(aluno))}" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div> <!-- fim v-else -->
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import Loader_1 from '@/components/loader_1.vue'
import * as api from '../../../api/api.js'
import * as request from '../../../api/request.js'

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      search: '',
      trimestres: { primeiro: true, segundo: true, terceiro: true },
      recursoAtivo: false,
      alunos: [],
      alunosFiltrados: [],
      loader: false
    }
  },

  computed: {
    // chave para forçar re-render da tabela quando muda colunas
    tableKey() {
      return [
        this.recursoAtivo ? 'R1' : 'R0',
        this.trimestres.primeiro ? 'T1' : 't1',
        this.trimestres.segundo ? 'T2' : 't2',
        this.trimestres.terceiro ? 'T3' : 't3'
      ].join('-')
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
        (aluno.nome || '').toLowerCase().includes(termo) ||
        String(aluno.numero || '').includes(termo)
      )
    },

    async carregarMiniPautas() {
      this.loader = true
      try {
        const anoLetivo = encodeURIComponent(this.$route.params.ano_letivo || '')
        const response = await api.listar(
          `${request.miniPautasListar}/${this.$route.params.turma_id || "nd"}/${this.$route.params.disciplina_id || "nd"}/${anoLetivo || "nd"}`
        )

        let alunosResp = response && response.alunos ? response.alunos : []
        if (!Array.isArray(alunosResp)) alunosResp = Object.values(alunosResp)

        const mapText = { 1: 'primeiro', 2: 'segundo', 3: 'terceiro' }

        const normalized = alunosResp.map(a => {
          const aluno = JSON.parse(JSON.stringify(a))
          if (!aluno.notas || typeof aluno.notas !== 'object') aluno.notas = {}

          for (const triNum of [1,2,3]) {
            const triText = mapText[triNum]
            const fromNumKey = aluno.notas[triNum] ?? aluno.notas[String(triNum)]
            const fromTextKey = aluno.notas[triText]
            const source = fromNumKey ?? fromTextKey ?? { mac: null, npt: null, mt: null }

            const safe = {
              mac: (source.mac === null || source.mac === '' || source.mac === undefined) ? null : Number(source.mac),
              npt: (source.npt === null || source.npt === '' || source.npt === undefined) ? null : Number(source.npt),
              mt:  (source.mt  === null || source.mt  === '' || source.mt  === undefined) ? null : Number(source.mt)
            }

            aluno.notas[triNum] = safe
            aluno.notas[String(triNum)] = safe
            aluno.notas[triText] = safe
          }

          aluno.mini_pauta_id = aluno.mini_pauta_id ?? (response.mini_pauta_id ?? null)
          aluno.recurso = (aluno.recurso === null || aluno.recurso === undefined || aluno.recurso === '') ? null : Number(aluno.recurso)
          return aluno
        })

        this.alunos = normalized
        this.alunosFiltrados = [...this.alunos]
      } catch (err) {
        console.error('Erro ao carregar mini pautas:', err)
      } finally {
        this.loader = false
      }
    },

    _mapTrimestre(trimestre) {
      const map = { '1':'1','2':'2','3':'3','primeiro':'1','segundo':'2','terceiro':'3' }
      return map[String(trimestre)] || null
    },

    _getNotaValue(aluno, trimestre, tipo) {
      if (!aluno || !aluno.notas) return null
      const mapText = { '1':'primeiro','2':'segundo','3':'terceiro','primeiro':'primeiro','segundo':'segundo','terceiro':'terceiro' }
      const triText = mapText[String(trimestre)] || String(trimestre)
      const candidates = [aluno.notas[triText], aluno.notas[String(triText)], aluno.notas[Number(triText)]]
      for (const c of candidates) {
        if (c && Object.prototype.hasOwnProperty.call(c, tipo)) {
          const v = c[tipo]
          if (v === null || v === undefined || v === '') return null
          const num = Number(v)
          if (Number.isNaN(num)) return null
          return num
        }
      }
      return null
    },

    isNotaBaixa(aluno, trimestreText, tipo) {
      const v = this._getNotaValue(aluno, trimestreText, tipo)
      return v !== null && v < 10
    },

    isNotaAlta(aluno, trimestreText, tipo) {
      const v = this._getNotaValue(aluno, trimestreText, tipo)
      return v !== null && v >= 10
    },

    isMediaBaixa(aluno) {
      const m = Number(this.calcularMediaFinal(aluno))
      return !Number.isNaN(m) && m < 10
    },

    isMediaAlta(aluno) {
      const m = Number(this.calcularMediaFinal(aluno))
      return !Number.isNaN(m) && m >= 10
    },

    isValorBaixo(v) {
      if (v === null || v === undefined || v === '') return false
      const n = Number(v)
      return !Number.isNaN(n) && n < 10
    },

    isValorAlto(v) {
      if (v === null || v === undefined || v === '') return false
      const n = Number(v)
      return !Number.isNaN(n) && n >= 10
    },

    notaClass(aluno, trimestreText, tipo) {
      return {
        'nota-text-baixa': this.isNotaBaixa(aluno, trimestreText, tipo),
        'nota-text-alta': this.isNotaAlta(aluno, trimestreText, tipo)
      }
    },

    calcularMFR(aluno) {
      if (aluno.recurso === null || aluno.recurso === undefined || aluno.recurso === '') return ''
      const m = Number(this.calcularMediaFinal(aluno))
      if (Number.isNaN(m)) return ''
      const r = Number(aluno.recurso)
      if (Number.isNaN(r)) return ''
      return ((m + r) / 2).toFixed(1)
    },

    calcularMFRNumber(aluno) {
      if (aluno.recurso === null || aluno.recurso === undefined || aluno.recurso === '') return NaN
      const m = Number(this.calcularMediaFinal(aluno))
      if (Number.isNaN(m)) return NaN
      const r = Number(aluno.recurso)
      if (Number.isNaN(r)) return NaN
      return Math.round(((m + r) / 2) * 10) / 10
    },

    async salvarRecurso(alunoId) {
      // Salvar recurso
      return
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return
      let v = (aluno.recurso === '' || aluno.recurso === null || aluno.recurso === undefined) ? null : Number(aluno.recurso)
      if (v !== null && Number.isNaN(v)) v = null
      if (v !== null) {
        if (v < 0) v = 0
        if (v > 20) v = 20
        v = Math.round(v * 10) / 10
      }
      aluno.recurso = v

      // payload — ajustar conforme backend
      const miniPautaId = aluno.mini_pauta_id ?? null
      const payload = {
        mini_pauta_id: miniPautaId,
        aluno_id: alunoId,
        tipo: 'recurso',
        recurso: aluno.recurso,
        media_final: this.calcularMediaFinal(aluno),
        media_final_recurso: this.calcularMFR(aluno)
      }

      try {
        if (miniPautaId) {
          await api.add(`${request.miniPautasInserirNota}${miniPautaId}`, payload)
        } else {
          await api.add(request.miniPautasInserirNota, payload)
        }
      } catch (err) {
        console.error('Erro ao salvar recurso:', err, payload)
      }
    },

    async salvarNota(alunoId, trimestre, tipoNota, valor) {
      const t = this._mapTrimestre(trimestre)
      if (!t) return
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return
      if (!aluno.notas || typeof aluno.notas !== 'object') aluno.notas = {}
      if (!aluno.notas[t] || typeof aluno.notas[t] !== 'object') aluno.notas[t] = { mac: null, npt: null, mt: null }

      let v = (valor === '' || valor === null || valor === undefined) ? null : Number(valor)
      if (v !== null && Number.isNaN(v)) v = null
      if (v !== null) {
        if (v < 0) v = 0
        if (v > 20) v = 20
        v = Math.round(v * 10) / 10
      }

      aluno.notas[t][tipoNota] = v
      if (tipoNota !== 'mt') this.calcularMediaTrimestre(alunoId, t)

      const miniPautaId = aluno.mini_pauta_id ?? null
      const payload = {
        mini_pauta_id: miniPautaId,
        aluno_id: alunoId,
        trimestre: t,
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
      } catch (err) {
        console.error('Erro ao salvar nota:', err, payload)
      }
    },

    salvarTudo() { console.log('Salvar tudo — implementa conforme necessário') },

    recarregarDados() { /* reimplemente conforme necessário */ },

    calcularMediaTrimestre(alunoId, trimestre) {
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return
      const notas = aluno.notas[trimestre]
      const soma = (notas.mac || 0) + (notas.npt || 0)
      notas.mt = parseFloat((soma / 2).toFixed(1))
    },

    calcularMediaFinal(aluno) {
      const mt1 = aluno.notas.primeiro.mt || 0
      const mt2 = aluno.notas.segundo.mt || 0
      const mt3 = aluno.notas.terceiro.mt || 0
      return ((mt1 + mt2 + mt3) / 3).toFixed(1)
    }

     //** Media com campos vazios */ 
    // calcularMediaTrimestre(alunoId, trimestre) {
    //   const aluno = this.alunos.find(a => a.id === alunoId)
    //   if (!aluno) return
    //   const notas = aluno.notas[trimestre]
    //   const soma = (notas.mac || 0) + (notas.npt || 0)
    //   notas.mt = parseFloat((soma / 2).toFixed(1))
    // },

    // calcularMediaFinal(aluno) {
    //   const mt1 = aluno.notas.primeiro.mt || 0
    //   const mt2 = aluno.notas.segundo.mt || 0
    //   const mt3 = aluno.notas.terceiro.mt || 0
    //   return ((mt1 + mt2 + mt3) / 3).toFixed(1)
    // }
  }


}
</script>

<style scoped>
/* wrapper que permite scroll horizontal quando tabela for larga */
.table-responsive-simple {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  /* garante conteúdo alinhado à esquerda */
  text-align: left;
}

/* tabela: auto layout (colunas refluem quando removidas) */
.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  margin: 0;          /* força alinhamento à esquerda do container */
}

/* limita a coluna do NOME para evitar que ela se expanda e empurre as outras */
.col-nome,
.table td.col-nome {
  max-width: 40ch;            /* ajustar se quiseres mais/menos espaço */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* se preferires permitir quebra em várias linhas (alternativa):
.col-nome { white-space: normal; word-break: break-word; max-width: 30%; }
*/

/* inputs de nota com largura fixa (evita esticar a tabela) */
.nota-input {
  width: 70px;
  max-width: 70px;
  padding: .2rem .4rem;
  box-sizing: border-box;
}

/* só altera a cor do texto — vermelho se <10, azul se >=10 */
.nota-text-baixa {
  color: #d9534f !important; /* vermelho */
}
.nota-text-alta {
  color: #0d6efd !important; /* azul bootstrap */
}

/* pequenas melhorias visuais */
.table th, .table td {
  vertical-align: middle;
  padding: .35rem .5rem;
}
.table td input {
  margin: 0 auto !important;
  text-align: center;
 }

/* Mobile tweaks */
@media (max-width: 576px) {
  .main-content { padding: .5rem; }
  .container-fluid { padding: 0; }
}
</style>
