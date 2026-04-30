<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2 px-3">
        <div>
          <h2 class="mb-1"><i class="fas fa-arrow-left" style="font-size: 18px; position: relative; top: -5px; cursor: pointer;" @click="$router.back"></i> {{ $route.params.disciplina_nome }}</h2>
          <p class="mb-0 text-muted">
            {{ $route.params.abreviatura }} {{ $route.params.classe }}ª {{ $route.params.serie }}/ {{ $route.params.turno }}
            | Ano Letivo: {{ $route.params.ano_letivo }}
          </p>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" @click="recarregarDados">
            <i class="fas fa-sync-alt me-1"></i>Recarregar
          </button>
          <button @click="showMiniPauta" class="btn btn-sm btn-danger d-flex align-items-center">
            <i class="fas fa-file-pdf me-1"></i><span class="d-none d-md-inline">PDF</span>
          </button>
        </div>
      </div>

      <!-- Controles -->
      <div class="row mb-3">
        <div class="col-12 col-md-8 mb-3 mb-md-0 p-0 px-3">
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

            <div v-if="showExameRecurso($route.params.classe)" class="form-check0 form-switch0 mb-0 me-2 d-flex ms-3">
              <input class="form-check-input0 me-1" type="checkbox" id="examSwitch" v-model="examAtivo">
              <label class="form-check-label" for="examSwitch">Ativar Exame</label>
            </div>

            <div v-if="showExameRecurso($route.params.classe)" class="form-check0 form-switch0 mb-0 me-2 d-flex">
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

                  <!-- Exame e MFE -->
                  <th v-if="examAtivo" rowspan="2" style="width:70px" class="text-center">E</th>
                  <th v-if="examAtivo" rowspan="2" style="width:90px" class="text-center">MFE</th>

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
                        :value="formatValue(aluno.notas.primeiro.mt)"
                        readonly
                        :class="{
                          'nota-text-baixa': isNotaBaixa(aluno, 'primeiro', 'mt'),
                          'nota-text-alta': isNotaAlta(aluno, 'primeiro', 'mt')
                        }"
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
                        :value="formatValue(aluno.notas.segundo.mt)"
                        readonly
                        :class="{
                          'nota-text-baixa': isNotaBaixa(aluno, 'segundo', 'mt'),
                          'nota-text-alta': isNotaAlta(aluno, 'segundo', 'mt')
                        }"
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
                        :value="formatValue(aluno.notas.terceiro.mt)"
                        readonly
                        :class="{
                          'nota-text-baixa': isNotaBaixa(aluno, 'terceiro', 'mt'),
                          'nota-text-alta': isNotaAlta(aluno, 'terceiro', 'mt')
                        }"
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

                  <!-- Exame (E) -->
                  <td v-if="examAtivo" class="align-middle">
                    <input
                      type="number"
                      class="form-control form-control-sm nota-input"
                      v-model="aluno.exame"
                      @blur="salvarExame(aluno.id)"
                      :class="{
                        'nota-text-baixa': isValorBaixo(aluno.exame),
                        'nota-text-alta': isValorAlto(aluno.exame)
                      }"
                      min="0" max="20" step="0.1"
                    />
                  </td>

                  <!-- MFE -->
                  <td v-if="examAtivo" class="align-middle text-center">
                    <input
                      type="text"
                      class="form-control form-control-sm text-center nota-input"
                      :value="calcularMFE(aluno)"
                      readonly
                      :class="{
                        'nota-text-baixa': aluno.exame !== null && aluno.exame !== '' && isValorBaixo(calcularMFERNumber(aluno)),
                        'nota-text-alta': aluno.exame !== null && aluno.exame !== '' && isValorAlto(calcularMFERNumber(aluno))
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

                  <!-- MFR -->
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
                  <span class="badge me-2 text-dark">{{ aluno.numero }}</span>
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
                          v-if="tipo !== 'mt'"
                          v-model="aluno.notas.primeiro[tipo]"
                          @blur="salvarNota(aluno.id, '1', tipo, aluno.notas.primeiro[tipo])"
                          :class="notaClass(aluno, 'primeiro', tipo)"
                          min="0" max="20" step="0.1"
                        />
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          v-else
                          :value="formatValue(aluno.notas.primeiro.mt)"
                          readonly
                          :class="{
                            'nota-text-baixa': isNotaBaixa(aluno, 'primeiro', 'mt'),
                            'nota-text-alta': isNotaAlta(aluno, 'primeiro', 'mt')
                          }"
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
                          v-if="tipo !== 'mt'"
                          v-model="aluno.notas.segundo[tipo]"
                          @blur="salvarNota(aluno.id, '2', tipo, aluno.notas.segundo[tipo])"
                          :class="notaClass(aluno, 'segundo', tipo)"
                          min="0" max="20" step="0.1"
                        />
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          v-else
                          :value="formatValue(aluno.notas.segundo.mt)"
                          readonly
                          :class="{
                            'nota-text-baixa': isNotaBaixa(aluno, 'segundo', 'mt'),
                            'nota-text-alta': isNotaAlta(aluno, 'segundo', 'mt')
                          }"
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
                          v-if="tipo !== 'mt'"
                          v-model="aluno.notas.terceiro[tipo]"
                          @blur="salvarNota(aluno.id, '3', tipo, aluno.notas.terceiro[tipo])"
                          :class="notaClass(aluno, 'terceiro', tipo)"
                          min="0" max="20" step="0.1"
                        />
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          v-else
                          :value="formatValue(aluno.notas.terceiro.mt)"
                          readonly
                          :class="{
                            'nota-text-baixa': isNotaBaixa(aluno, 'terceiro', 'mt'),
                            'nota-text-alta': isNotaAlta(aluno, 'terceiro', 'mt')
                          }"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row g-2 align-items-center mt-2">
                    <div class="col-6">
                      <label class="small mb-1">MF</label>
                      <input type="text" class="form-control form-control-sm" :value="calcularMediaFinal(aluno)" readonly
                             :class="{'nota-text-baixa': isMediaBaixa(aluno),'nota-text-alta': isMediaAlta(aluno)}" />
                    </div>

                    <div v-if="examAtivo" class="col-6">
                      <label class="small mb-1">Exame (E)</label>
                      <input type="number" class="form-control form-control-sm"
                             v-model="aluno.exame" @blur="salvarExame(aluno.id)"
                             :class="{'nota-text-baixa': isValorBaixo(aluno.exame),'nota-text-alta': isValorAlto(aluno.exame)}"
                             min="0" max="20" step="0.1" />
                    </div>

                    <div v-if="examAtivo" class="col-6 mt-2">
                      <label class="small mb-1">MFE</label>
                      <input type="text" class="form-control form-control-sm" :value="calcularMFE(aluno)" readonly
                             :class="{'nota-text-baixa': aluno.exame !== null && isValorBaixo(calcularMFERNumber(aluno)),'nota-text-alta': aluno.exame !== null && isValorAlto(calcularMFERNumber(aluno))}" />
                    </div>

                    <div v-if="recursoAtivo" class="col-6 mt-2">
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
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      search: '',
      trimestres: { primeiro: true, segundo: false, terceiro: false },
      recursoAtivo: false,
      examAtivo: false, // flag para Exame (E / MFE)
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
        this.examAtivo ? 'E1' : 'E0',
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
    showExameRecurso(classe) {
      if(classe == "6" || classe == "9" || classe == "12"){
        return true
      }
    },

    formatValue(v) {
      if (v === null || v === undefined || v === '') return (0).toFixed(1)
      const n = Number(v)
      if (Number.isNaN(n)) return (0).toFixed(1)
      return n.toFixed(1)
    },

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
          aluno.exame = (aluno.exame === null || aluno.exame === undefined || aluno.exame === '') ? null : Number(aluno.exame)

          // garante MT calculado se não existir
          for (const t of ['primeiro','segundo','terceiro']) {
            if (!aluno.notas[t]) aluno.notas[t] = { mac: null, npt: null, mt: 0 }
            if (aluno.notas[t].mt === null || aluno.notas[t].mt === undefined) {
              const mac = aluno.notas[t].mac, npt = aluno.notas[t].npt
              const arr = []
              if (mac !== null && mac !== '' && !Number.isNaN(Number(mac))) arr.push(Number(mac))
              if (npt !== null && npt !== '' && !Number.isNaN(Number(npt))) arr.push(Number(npt))
              aluno.notas[t].mt = arr.length ? Math.round((arr.reduce((s,x)=>s+x,0)/arr.length)*10)/10 : 0
            }
          }

          return aluno
        })

        this.alunos = normalized
        this.alunosFiltrados = [...this.alunos]
      } catch (err) {
        console.error('Erro ao carregar mini pautas:', err)
        toast.error('Erro ao carregar mini pautas')
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

    // SALVAR NOTA com envio ao backend
    async salvarNota(alunoId, trimestre, tipo, valor) {
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return

      // converte '1' -> 'primeiro', etc.
      const mapNumToText = { '1': 'primeiro', '2': 'segundo', '3': 'terceiro', 1:'primeiro', 2:'segundo', 3:'terceiro' }
      const triText = mapNumToText[String(trimestre)] || String(trimestre)

      // normaliza valor passado (ou pega do modelo)
      let v = (typeof valor !== 'undefined') ? valor : (aluno.notas?.[triText] && aluno.notas[triText][tipo])
      if (v === '' || v === null || v === undefined) v = null
      else {
        const n = Number(v)
        v = Number.isNaN(n) ? null : Math.round(Math.max(0, Math.min(20, n)) * 10) / 10
      }

      // garante estrutura de notas
      if (!aluno.notas) aluno.notas = {}
      if (!aluno.notas[triText]) aluno.notas[triText] = { mac: null, npt: null, mt: null }

      // atualiza o campo
      aluno.notas[triText][tipo] = v

      // mantém redundância de chaves (1, "1", "primeiro")
      const triNum = { primeiro: '1', segundo: '2', terceiro: '3' }[triText] || null
      if (triNum) {
        aluno.notas[triNum] = aluno.notas[triText]
        aluno.notas[String(triNum)] = aluno.notas[triText]
      }

      // recalcula MT do trimestre (triText aceita 'primeiro' ou '1' — o método lida)
      this.calcularMediaTrimestre(alunoId, triText)

      // prepara payload para o backend
      const miniPautaId = aluno.mini_pauta_id ?? null
      const trimestrePayload = triNum ? Number(triNum) : null
      const media_trimestre = (aluno.notas[triText] && aluno.notas[triText].mt !== null && aluno.notas[triText].mt !== undefined)
        ? Number(aluno.notas[triText].mt)
        : null
      const media_final = (() => {
        const mf = this.calcularMediaFinal(aluno)
        const num = Number(mf)
        return Number.isNaN(num) ? null : num
      })()

      const payload = {
        mini_pauta_id: miniPautaId,
        aluno_id: alunoId,
        tipo: tipo,                   // envia 'mac' | 'npt' | 'mt' | 'exame' | 'recurso'
        trimestre: trimestrePayload,  // número 1|2|3 ou null
        valor: v,
        media_trimestre: media_trimestre,
        media_final: media_final
      }

      try {
        const endpoint = miniPautaId ? `${request.miniPautasInserirNota}${miniPautaId}` : request.miniPautasInserirNota
        console.log('Enviar payload nota:', payload)
        const resp = await api.add(endpoint, payload)
        console.log('Resposta salvarNota:', resp)

        // tenta extrair mensagem de sucesso
        const msg = resp?.data?.message ?? resp?.message ?? 'Nota guardada'
        // if (typeof toast !== 'undefined') toast.success(msg) 

      } catch (err) {
        console.error('Erro ao guardar nota:', err, payload)
        if (typeof toast !== 'undefined') toast.error('Erro ao guardar nota')
      }
    },

    calcularMFR(aluno) {
      if (aluno.recurso === null || aluno.recurso === undefined || aluno.recurso === '') return ''
      let base
      if (this.examAtivo && aluno.exame !== null && aluno.exame !== undefined && aluno.exame !== '') {
        base = Number(this.calcularMFERNumber(aluno))
      } else {
        base = Number(this.calcularMediaFinal(aluno))
      }
      if (Number.isNaN(base)) base = 0
      base = Math.max(0, base)
      const r = Number(aluno.recurso)
      if (Number.isNaN(r)) return ''
      const mfr = ((base + r) / 2)
      return (Math.round(mfr * 10) / 10).toFixed(1)
    },

    calcularMFRNumber(aluno) {
      if (aluno.recurso === null || aluno.recurso === undefined || aluno.recurso === '') return NaN
      let base
      if (this.examAtivo && aluno.exame !== null && aluno.exame !== undefined && aluno.exame !== '') {
        base = Number(this.calcularMFERNumber(aluno))
      } else {
        base = Number(this.calcularMediaFinal(aluno))
      }
      if (Number.isNaN(base)) base = 0
      base = Math.max(0, base)
      const r = Number(aluno.recurso)
      if (Number.isNaN(r)) return NaN
      return Math.round(((base + r) / 2) * 10) / 10
    },

    calcularMFE(aluno) {
      if (aluno.exame === null || aluno.exame === undefined || aluno.exame === '') return ''
      const m = Number(this.calcularMediaFinal(aluno))
      const e = Number(aluno.exame)
      if (Number.isNaN(e)) return ''
      const base = Number.isNaN(m) ? 0 : Math.max(0, m)
      const mfe = ((base + e) / 2)
      return (Math.round(mfe * 10) / 10).toFixed(1)
    },

    calcularMFERNumber(aluno) {
      if (aluno.exame === null || aluno.exame === undefined || aluno.exame === '') return NaN
      const m = Number(this.calcularMediaFinal(aluno))
      const e = Number(aluno.exame)
      if (Number.isNaN(e)) return NaN
      const base = Number.isNaN(m) ? 0 : Math.max(0, m)
      return Math.round(((base + e) / 2) * 10) / 10
    },

    // SALVAR EXAME com envio ao backend
    async salvarExame(alunoId) {
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return

      let v = (aluno.exame === '' || aluno.exame === null || aluno.exame === undefined) ? null : Number(aluno.exame)
      if (v !== null && Number.isNaN(v)) v = null
      if (v !== null) {
        v = Math.max(0, Math.min(20, v))
        v = Math.round(v * 10) / 10
      }
      aluno.exame = v

      const miniPautaId = aluno.mini_pauta_id ?? null
      const payload = {
        mini_pauta_id: miniPautaId,
        aluno_id: alunoId,
        tipo: 'exame',
        valor: aluno.exame,
        media_final: this.calcularMediaFinal(aluno),
        media_final_exame: this.calcularMFE(aluno)
      }

      try {
        const endpoint = miniPautaId ? `${request.miniPautasInserirNota}${miniPautaId}` : request.miniPautasInserirNota
        const resp = await api.add(endpoint, payload)
        const msg = resp?.data?.message ?? resp?.message ?? 'Exame guardado'
        // toast.success(msg)
      } catch (err) {
        console.error('Erro ao salvar exame:', err, payload)
        toast.error('Erro ao salvar exame')
      }
    },

    // SALVAR RECURSO com envio ao backend
    async salvarRecurso(alunoId) {
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return

      let v = (aluno.recurso === '' || aluno.recurso === null || aluno.recurso === undefined) ? null : Number(aluno.recurso)
      if (v !== null && Number.isNaN(v)) v = null
      if (v !== null) {
        v = Math.max(0, Math.min(20, v))
        v = Math.round(v * 10) / 10
      }
      aluno.recurso = v

      const miniPautaId = aluno.mini_pauta_id ?? null
      const payload = {
        mini_pauta_id: miniPautaId,
        aluno_id: alunoId,
        tipo: 'recurso',
        valor: aluno.recurso,
        media_final: this.calcularMediaFinal(aluno),
        media_final_recurso: this.calcularMFR(aluno)
      }

      try {
        const endpoint = miniPautaId ? `${request.miniPautasInserirNota}${miniPautaId}` : request.miniPautasInserirNota
        const resp = await api.add(endpoint, payload)
        const msg = resp?.data?.message ?? resp?.message ?? 'Recurso guardado'
        // toast.success(msg)
      } catch (err) {
        console.error('Erro ao salvar recurso:', err, payload)
        toast.error('Erro ao salvar recurso')
      }
    },

    salvarTudo() { console.log('Salvar tudo — implementa conforme necessário') },

    recarregarDados() { this.carregarMiniPautas() },

    calcularMediaTrimestre(alunoId, trimestre) {
      const aluno = this.alunos.find(a => a.id === alunoId)
      if (!aluno) return
      if (!aluno.notas) aluno.notas = {}

      const mapNumToText = { '1': 'primeiro', '2':'segundo', '3':'terceiro', 1:'primeiro', 2:'segundo', 3:'terceiro' }
      const triText = mapNumToText[String(trimestre)] || String(trimestre)

      if (!aluno.notas[triText]) aluno.notas[triText] = { mac: null, npt: null, mt: null }
      const notas = aluno.notas[triText]

      const valores = []
      const tryPush = (v) => {
        if (v === '' || v === null || v === undefined) return
        const n = Number(v)
        if (!Number.isNaN(n)) valores.push(n)
      }

      tryPush(notas.mac)
      tryPush(notas.npt)

      if (valores.length > 0) {
        const soma = valores.reduce((s, x) => s + x, 0)
        const media = Math.round((soma / valores.length) * 10) / 10
        notas.mt = media
      } else {
        notas.mt = 0
      }

      const triNum = { primeiro: '1', segundo: '2', terceiro: '3' }[triText] || null
      if (triNum) {
        aluno.notas[triNum] = aluno.notas[triText]
        aluno.notas[String(triNum)] = aluno.notas[triText]
      }
    },

    calcularMediaFinal(aluno) {
      if (!aluno || !aluno.notas) return (0).toFixed(1)

      const trimestres = ['primeiro', 'segundo', 'terceiro']
      const mts = []

      for (const t of trimestres) {
        const bloco = aluno.notas[t]
        if (!bloco) continue
        const mtVal = bloco.mt
        if (mtVal === null || mtVal === undefined || mtVal === '') continue
        const n = Number(mtVal)
        if (!Number.isNaN(n)) mts.push(n)
      }

      if (mts.length === 0) {
        return (0).toFixed(1)
      }

      const soma = mts.reduce((s, x) => s + x, 0)
      const media = Math.round((soma / mts.length) * 10) / 10
      return media.toFixed(1)
    },

    showMiniPauta() {
      this.$router.push({
        name: "professor.mini.pauta.show",
        params: {
          disciplina_id: this.$route.params.disciplina_id,
          ano_letivo: this.$route.params?.ano_letivo || "sem Ano letivo",
          nome_curso: this.$route.params?.nome_curso || "nd",
          horario_id: 1,
          abreviatura: this.$route.params?.abreviatura || 'nd',
          turma_id: this.$route.params.turma_id || "nd",
          classe: this.$route.params?.classe || "nd",
          serie: this.$route.params?.serie || "nd",
          sala: this.$route.params?.sala || "sem Sala",
          turno: this.$route.params?.turno || "nd",
          disciplina_nome: this.$route.params?.disciplina_nome || "nd",
          //disciplina_abreviatura: item?.disciplina?.abreviatura || "nd"
          disciplina_abreviatura: this.$route.params?.disciplina_abreviatura || "nd"
        }
      });
    },
  }
}
</script>

<style scoped>
/* wrapper que permite scroll horizontal quando tabela for larga */
.table-responsive-simple {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* max-height: calc(100vh - 220px);
  overflow-y: auto; */
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
