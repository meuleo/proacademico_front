<template>
  <div>
    <navbar />
    <sidebar />

    <div class="main-content p-4">
      <h3> <i class="fas fa-arrow-left me-2" @click="$router.back" style="cursor: pointer; font-size: 16px; position: relative; top: -4px;"></i> Gerar automático</h3>

      <!-- Configurações -->
      <div class="config mb-3">
        <div class="row p-0">
          <div>
            <p class="mb-1"><strong>Aluno: </strong> {{dados?.nome_aluno || ''}}</p>
            <p class="mb-1"><strong>Classe: </strong> {{selectedClasse ?? ''}}ª Classe</p>
            <p class="mb-1"><strong>Curso: </strong> {{dados?.curso?.nome || ''}}</p>
            <p><strong>Ano Lectivo: </strong> {{dados?.ano_letivo || ''}}</p>
          </div>

          <!-- div class="col-md-4 mb-3" v-show="$route.params?.nivel == 3">
            <select name="" id="" class="form-select">
              <option value="">Selecione o curso</option>
              <option v-for="item in cursos" :value="item.id">
                {{ item.nome }}
              </option>
            </select>
          </div -->
          <!-- div class="col-md-3 mb-3">
            <input v-model="anoLetivo" class="form-control" />
          </div -->

          <hr>
        </div>

        <div class="d-flex align-items-center gap-3 mt-3">
          <div>
            <label>Trimestres</label>
            <div>
              <label class="mr-2"><input type="checkbox" v-model="trimestres[1]" @change="onTrimestreToggle" /> 1</label>
              <label class="mr-2"><input type="checkbox" v-model="trimestres[2]" @change="onTrimestreToggle" /> 2</label>
              <label class="mr-2"><input type="checkbox" v-model="trimestres[3]" @change="onTrimestreToggle" /> 3</label>
            </div>
          </div>

          <div>
            <label>Ativar NPP</label>
            <div>
              <label class="switch">
                <input type="checkbox" v-model="ativarNpp" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>

          <div>
            <label>Ativar Exame</label>
            <div>
              <label class="switch">
                <input type="checkbox" v-model="ativarExame" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>

          <div>
            <label>Ativar Recurso</label>
            <div>
              <label class="switch">
                <input type="checkbox" v-model="ativarRecurso" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>

        </div>
      </div>

      <!-- Tabela editável -->
      <div class="table-responsive mb-3">
        <table class="table-edit">
          <thead>
            <tr>
              <th rowspan="2">DISCIPLINAS</th>

              <!-- cabeçalho por trimestre: colspan depende se trimestre ativo e se NPP ativo (3 ou 4 colunas) -->
              <th v-if="trimestres[1]" :colspan="columnsPerTrimester">I Trimestre</th>
              <th v-if="trimestres[2]" :colspan="columnsPerTrimester">II Trimestre</th>
              <th v-if="trimestres[3]" :colspan="columnsPerTrimester">III Trimestre</th>

              <th rowspan="2">MFD</th>

              <!-- Exame / MFE -->
              <th rowspan="2" v-if="ativarExame">E</th>
              <th rowspan="2" v-if="ativarExame">MFE</th>

              <!-- Recurso / MFR -->
              <th rowspan="2" v-if="ativarRecurso">R</th>
              <th rowspan="2" v-if="ativarRecurso">MFR</th>

              <th rowspan="2">Ações</th>
            </tr>

            <tr>
              <!-- segunda linha do cabeçalho: sempre renderiza as colunas conforme ativarNpp -->
              <template v-if="trimestres[1]">
                <th>MAC</th>
                <th v-if="ativarNpp">NPP</th>
                <th v-if="!ativarNpp">NPT</th>
                <th v-if="ativarNpp">NPT</th>
                <th v-if="!ativarNpp">MT1</th>
                <th v-if="ativarNpp">MT1</th>
              </template>

              <template v-if="trimestres[2]">
                <th>MAC</th>
                <th v-if="ativarNpp">NPP</th>
                <th v-if="!ativarNpp">NPT</th>
                <th v-if="ativarNpp">NPT</th>
                <th v-if="!ativarNpp">MT2</th>
                <th v-if="ativarNpp">MT2</th>
              </template>

              <template v-if="trimestres[3]">
                <th>MAC</th>
                <th v-if="ativarNpp">NPP</th>
                <th v-if="!ativarNpp">NPT</th>
                <th v-if="ativarNpp">NPT</th>
                <th v-if="!ativarNpp">MT3</th>
                <th v-if="ativarNpp">MT3</th>
              </template>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, idx) in rows" :key="row.uid">
              <!-- Disciplina select -->
              <td class="disciplinas">
                <select v-model.number="row.disciplina_id" class="form-control">
                  <option :value="null" disabled>-- Selecionar disciplina --</option>
                  <option v-for="d in disciplinas" :key="d.id" :value="d.id">{{ d.nome }}</option>
                </select>
              </td>

              <!-- Trimestre 1 -->
              <template v-if="trimestres[1]">
                <td>
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.mac1" @input="onNotaChange(row,1)"
                         :class="notaClass(row.mac1)" />
                </td>

                <!-- se ativarNpp: NPP cell, senão não existe -->
                <td v-if="ativarNpp">
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.npp1" @input="onNotaChange(row,1)"
                         :class="notaClass(row.npp1)" />
                </td>

                <!-- NPT cell (position changes based on NPP presence) -->
                <td>
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.npt1" @input="onNotaChange(row,1)"
                         :class="notaClass(row.npt1)" />
                </td>

                <td>
                  <input type="text" class="form-control input-sm input-termo" :value="format(row.mt1)" readonly
                         :class="notaClass(row.mt1)" />
                </td>
              </template>

              <!-- Trimestre 2 -->
              <template v-if="trimestres[2]">
                <td>
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.mac2" @input="onNotaChange(row,2)"
                         :class="notaClass(row.mac2)" />
                </td>

                <td v-if="ativarNpp">
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.npp2" @input="onNotaChange(row,2)"
                         :class="notaClass(row.npp2)" />
                </td>

                <td>
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.npt2" @input="onNotaChange(row,2)"
                         :class="notaClass(row.npt2)" />
                </td>

                <td>
                  <input type="text" class="form-control input-sm input-termo" :value="format(row.mt2)" readonly
                         :class="notaClass(row.mt2)" />
                </td>
              </template>

              <!-- Trimestre 3 -->
              <template v-if="trimestres[3]">
                <td>
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.mac3" @input="onNotaChange(row,3)"
                         :class="notaClass(row.mac3)" />
                </td>

                <td v-if="ativarNpp">
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.npp3" @input="onNotaChange(row,3)"
                         :class="notaClass(row.npp3)" />
                </td>

                <td>
                  <input type="number" step="0.01" class="form-control input-sm input-termo"
                         v-model.number="row.npt3" @input="onNotaChange(row,3)"
                         :class="notaClass(row.npt3)" />
                </td>

                <td>
                  <input type="text" class="form-control input-sm input-termo" :value="format(row.mt3)" readonly
                         :class="notaClass(row.mt3)" />
                </td>
              </template>

              <!-- MFD -->
              <td><input type="text" class="form-control input-sm input-termo" :value="format(row.mfd)" readonly
                         :class="notaClass(row.mfd)" /></td>

              <!-- Exame / MFE -->
              <td v-if="ativarExame">
                <input type="number" step="0.01" class="form-control input-sm input-termo"
                       v-model.number="row.exame" @input="onNotaChange(row, null)"
                       :class="notaClass(row.exame)" />
              </td>
              <td v-if="ativarExame">
                <input type="text" class="form-control input-sm input-termo" :value="format(row.mfe)" readonly
                       :class="notaClass(row.mfe)" />
              </td>

              <!-- Recurso / MFR -->
              <td v-if="ativarRecurso">
                <input type="number" step="0.01" class="form-control input-sm input-termo"
                       v-model.number="row.recurso" @input="onNotaChange(row, null)"
                       :class="notaClass(row.recurso)" />
              </td>
              <td v-if="ativarRecurso">
                <input type="text" class="form-control input-sm input-termo" :value="format(row.mfr)" readonly
                       :class="notaClass(row.mfr)" />
              </td>

              <!-- Ações -->
              <td>
                <button class="btn btn-sm btn-danger" @click="removeRow(idx)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex gap-2 mb-3">
        <button class="btn btn-warning" @click="addRow"><i class="fas fa-plus me-2"></i>Inserir linha</button>
        <LoaderBtnGuardar v-if="loaderSave"/>
        <button v-else type="button" @click="saveTerm" class="btn btn-primary">
          <i class="fas fa-save me-2"></i>Guardar
        </button>
        <!-- <button class="btn btn-info" @click="onVisualizar">
          <i class="fas fa-eye me-2"></i>Visualizar
        </button> -->
      </div>

      <!-- debug -->
      <pre v-if="debug">{{ JSON.stringify(payloadPreview(), null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue';
import * as api from '@/api/api.js';
import * as request from '@/api/request.js';

export default {
  components: { navbar, sidebar, LoaderBtnGuardar },
  data() {
    return {
      // configuração
      nivel: 3,
      classesPorNivel: { 1: [2,3,4], 2: [7,8,9], 3: [10,11,12,13] },
      selectedClasse: '',
      anoLetivo: '',
      alunoId: '',
      escolaId: '',
      trimestres: { 1: true, 2: true, 3: true },
      ativarNpp: true,
      ativarExame: false,
      ativarRecurso: false,

      // dados
      disciplinas: [],
      cursos: [],
      rows: [],
      debug: false,

      // caso venham para edição
      termoId: null,
      loaderSave: false,
      dados: []
    };
  },

  computed: {
    classesOptions() {
      return this.classesPorNivel[this.nivel] || [];
    },
    // número de colunas por trimestre (3 sem NPP, 4 com NPP)
    columnsPerTrimester() {
      return this.ativarNpp ? 4 : 3;
    }
  },

  watch: {
    nivel() {
      const opts = this.classesOptions;
      if (opts && opts.length) this.selectedClasse = opts[0];
    },
    ativarNpp(newVal) {
      // quando desativar, limpar todos os npp existentes; quando ativar, recalc
      if (!newVal) {
        this.rows.forEach(r => { r.npp1 = r.npp2 = r.npp3 = null; this.calcAllMts(r); });
      } else {
        this.rows.forEach(r => this.calcAllMts(r));
      }
    },
    ativarExame(newVal) {
      if (!newVal) {
        // limpar exame/mfe
        this.rows.forEach(r => { r.exame = null; r.mfe = null; this.calcMfr(r); });
      } else {
        // recalcula MFE/MFR com base no que já existe
        this.rows.forEach(r => { this.calcMfe(r); this.calcMfr(r); });
      }
    },
    ativarRecurso(newVal) {
      if (!newVal) {
        // limpar recurso/mfr
        this.rows.forEach(r => { r.recurso = null; r.mfr = null; });
      } else {
        this.rows.forEach(r => this.calcMfr(r));
      }
    }
  },

  created() {
    // se rota traz termo_id, carrega (para edição)
    this.fetchDisciplinas()
    this.fetchCursos()

    this.loadTermo();
    // this.termoId = this.$route.params.termo_id || this.$route.query.termo_id;
    // if (this.termoId) {
    // } else {
    //   // criação: duas linhas vazias por padrão
    //   this.addRow(); this.addRow();
    // }
  },

  methods: {
    async fetchDisciplinas() {
      const resp = await api.listar(request.disciplinasListar)
      this.disciplinas = resp.data
    },
    async fetchCursos() {
      const resp = await api.listar(request.cursosListar)
      this.cursos = resp.data
    },

    onNivelChange() {
      const opts = this.classesOptions;
      if (opts && opts.length) this.selectedClasse = opts[0];
    },
    onTrimestreToggle() {
      // manter integridade: recalcula mts por mudança de trimestres
      this.rows.forEach(r => this.calcAllMts(r));
    },

    /* ---------------------------
       loadTermo: robusto e tolerante
       --------------------------- */
   async loadTermo() {
  try {
    console.log('[loadTermo] solicitando termo id:', this.termoId);
    const alunoParam = this.$route.params.alunoId;
    const nivelParam = this.$route.params.nivel;

    const res = await api.listar(`/termos/buscar/aluno/${alunoParam}/${nivelParam}`);
    console.log('[loadTermo] resposta raw:', res);

    // espera o formato: { termo: { ..., notas: [...] } }
    const termo = res && res.data && res.data.termo ? res.data.termo : (res && res.termo) || (res && res.data) || res;
    if (!termo) {
      console.warn('[loadTermo] termo não encontrado em res:', res);
      alert('Termo inválido ou resposta inesperada da API.');
      return;
    }

    this.dados = termo

    const notas = Array.isArray(termo.notas) ? termo.notas : [];
    if (!notas.length) {
      console.warn('[loadTermo] termo sem notas:', termo);
      alert('Termo inválido ou sem notas.');
      return;
    }

    // campos básicos
    this.nome_completo = termo.aluno?.nome_completo || '';
    this.selectedClasse = termo.classe ? Number(termo.classe) : this.selectedClasse;
    this.anoLetivo = termo.ano_letivo || this.anoLetivo;
    this.alunoId = termo.aluno_id ? String(termo.aluno_id) : (termo.aluno?.id ? String(termo.aluno.id) : this.alunoId);
    this.escolaId = termo.escola_id ? String(termo.escola_id) : (termo.escola?.id ? String(termo.escola.id) : this.escolaId);

    // extrai disciplinas únicas (garante id numérico e nome)
    const discMap = new Map();
    notas.forEach(n => {
      const didRaw = n.disciplina_id ?? n.disciplina?.id;
      if (didRaw == null) return;
      const idNum = Number(didRaw);
      if (Number.isNaN(idNum)) return;
      if (!discMap.has(idNum)) {
        const nome = n.disciplina?.nome ?? n.disciplina_nome ?? (`Disc ${idNum}`);
        discMap.set(idNum, { id: idNum, nome });
      }
    });
    this.disciplinas = Array.from(discMap.values());

    // flags: detecta presença por tipo_nota (tolerante a case)
    const tipoLower = s => String(s || '').toLowerCase();
    this.ativarNpp = notas.some(n => tipoLower(n.tipo_nota) === 'npp');
    this.ativarExame = notas.some(n => ['exame', 'mfe'].includes(tipoLower(n.tipo_nota)));
    this.ativarRecurso = notas.some(n => ['recurso', 'mfr'].includes(tipoLower(n.tipo_nota)));

    // agrupa notas por disciplina, normalizando valores e trimestres
    const rowsByDisc = {};
    notas.forEach(n => {
      if (!n) return;

      const didRaw = n.disciplina_id ?? n.disciplina?.id;
      if (didRaw == null) return;
      const did = Number(didRaw);
      if (Number.isNaN(did)) return;

      if (!rowsByDisc[did]) {
        rowsByDisc[did] = {
          uid: Date.now() + Math.random(),
          disciplina_id: did,
          mac1: null, npp1: null, npt1: null, mt1: null,
          mac2: null, npp2: null, npt2: null, mt2: null,
          mac3: null, npp3: null, npt3: null, mt3: null,
          mfd: null,
          exame: null, mfe: null,
          recurso: null, mfr: null
        };
      }

      const target = rowsByDisc[did];

      // trimestre: pode vir como "1" ou null/""; normaliza para Number ou null
      const tRaw = (n.trimestre === '' ? null : n.trimestre);
      const t = (tRaw === null || tRaw === undefined || tRaw === '') ? null : Number(tRaw);

      // valor: string "10.00" => number 10
      let val = null;
      if (n.valor !== null && n.valor !== undefined && n.valor !== '') {
        const parsed = parseFloat(n.valor);
        val = Number.isFinite(parsed) ? parsed : null;
      }

      const tipo = tipoLower(n.tipo_nota);

      if (['mac', 'npp', 'npt', 'mt'].includes(tipo) && (t === 1 || t === 2 || t === 3)) {
        if (tipo === 'mac') target[`mac${t}`] = val;
        if (tipo === 'npp') target[`npp${t}`] = val;
        if (tipo === 'npt') target[`npt${t}`] = val;
        if (tipo === 'mt')  target[`mt${t}`]  = val;
      } else {
        // notas sem trimestre (mfd / exame / mfe / recurso / mfr)
        if (tipo === 'mfd') target.mfd = val;
        if (tipo === 'exame') target.exame = val;
        if (tipo === 'mfe') target.mfe = val;
        if (tipo === 'recurso') target.recurso = val;
        if (tipo === 'mfr') target.mfr = val;
      }
    });

    // transforma em array e força disciplina_id como Number (compatível com v-model.number)
    this.rows = Object.values(rowsByDisc).map(r => ({ ...r, disciplina_id: Number(r.disciplina_id) }));

    // recalcula MTs/MFDs/MFE/MFR para consistência e classes visuais
    this.rows.forEach(r => this.calcAllMts(r));

    console.log('[loadTermo] linhas montadas:', this.rows, 'disciplinas:', this.disciplinas);
  } catch (err) {
    console.error('Erro no loadTermo (catch):', err);
    if (err && err.response) console.error('err.response:', err.response);
    alert('Erro ao carregar termo. Verifica console.');
  }
},

    addRow() {
      const uid = Date.now() + Math.random();
      this.rows.push({
        uid,
        disciplina_id: null,
        mac1: null, npp1: null, npt1: null, mt1: null,
        mac2: null, npp2: null, npt2: null, mt2: null,
        mac3: null, npp3: null, npt3: null, mt3: null,
        mfd: null,
        exame: null, mfe: null,
        recurso: null, mfr: null
      });
    },
    removeRow(index) { this.rows.splice(index,1); },

    // chamada quando qualquer nota muda; trimestre = 1/2/3 para recalcular MT, ou null quando alterou exame/recurso
    onNotaChange(row, trimestre) {
      if (trimestre) {
        this.calcMt(row, trimestre);
        this.calcMfd(row);
      } else {
        // alteração de exame/recurso: MFD não muda, mas MFE/MFR podem mudar
        // ainda assim recalcula MFD para garantir consistência
        this.calcMfd(row);
      }
      // sempre recalcula MFE e MFR (se aplicáveis)
      this.calcMfe(row);
      this.calcMfr(row);
    },

    calcMt(row, trimestre) {
      const mac = this.safeNum(row[`mac${trimestre}`]);
      const npp = this.ativarNpp ? this.safeNum(row[`npp${trimestre}`]) : null;
      const npt = this.safeNum(row[`npt${trimestre}`]);

      const values = [];
      if (mac !== null) values.push(mac);
      if (this.ativarNpp && npp !== null) values.push(npp);
      if (npt !== null) values.push(npt);

      if (values.length === 0) { row[`mt${trimestre}`] = null; return; }

      const sum = values.reduce((s,v) => s+v, 0);
      row[`mt${trimestre}`] = this.round(sum / values.length, 2);
    },

    calcAllMts(row) {
      [1,2,3].forEach(t => { if (this.trimestres[t]) this.calcMt(row,t); else row[`mt${t}`] = null; });
      this.calcMfd(row);
      this.calcMfe(row);
      this.calcMfr(row);
    },

    calcMfd(row) {
      const mts = [];
      [1,2,3].forEach(t => {
        if (this.trimestres[t]) {
          const v = row[`mt${t}`];
          if (v !== null && v !== undefined && v !== '') mts.push(Number(v));
        }
      });
      if (mts.length === 0) { row.mfd = null; return; }
      row.mfd = this.round(mts.reduce((a,b)=>a+b,0) / mts.length, 2);
    },

    // MFE = média entre MFD e Exame (apenas se exame preenchido e ativarExame)
    calcMfe(row) {
      if (!this.ativarExame) { row.mfe = null; return; }
      const e = this.safeNum(row.exame);
      if (e === null) { row.mfe = null; return; }
      const base = this.safeNum(row.mfd) === null ? 0 : this.safeNum(row.mfd);
      row.mfe = this.round((base + e) / 2, 2);
    },

    // MFR = média entre base e recurso; base = MFE (se ativarExame e mfe presente) else MFD
    calcMfr(row) {
      if (!this.ativarRecurso) { row.mfr = null; return; }
      const r = this.safeNum(row.recurso);
      if (r === null) { row.mfr = null; return; }
      let base = null;
      if (this.ativarExame && this.safeNum(row.mfe) !== null) base = this.safeNum(row.mfe);
      else base = this.safeNum(row.mfd) === null ? 0 : this.safeNum(row.mfd);
      row.mfr = this.round((base + r) / 2, 2);
    },

    safeNum(v) {
      if (v === null || v === undefined || v === '') return null;
      const n = Number(v);
      return isNaN(n) ? null : n;
    },

    round(val, decimals=2) {
      if (val === null || val === undefined || isNaN(val)) return null;
      const p = Math.pow(10, decimals);
      return Math.round((Number(val) + Number.EPSILON) * p) / p;
    },

    format(val) {
      if (val === null || val === undefined) return '';
      return this.round(val,2).toFixed(2);
    },

    // CSS class para nota: <10 => red, >=10 => blue, null => ''
    notaClass(value) {
      const n = this.safeNum(value);
      if (n === null) return '';
      return n < 10 ? 'nota-red' : 'nota-blue';
    },

    payloadPreview() {
      // garante recalculos antes de montar payload
      this.rows.forEach(r => this.calcAllMts(r));

      const notas = [];
      this.rows.forEach(row => {
        if (!row.disciplina_id) return;

        [1,2,3].forEach(t => {
          if (!this.trimestres[t]) return;

          if (this.safeNum(row[`mac${t}`]) !== null) notas.push({
            disciplina_id: row.disciplina_id, tipo_nota: 'mac', trimestre: t, valor: this.round(row[`mac${t}`],2)
          });

          if (this.ativarNpp && this.safeNum(row[`npp${t}`]) !== null) notas.push({
            disciplina_id: row.disciplina_id, tipo_nota: 'npp', trimestre: t, valor: this.round(row[`npp${t}`],2)
          });

          if (this.safeNum(row[`npt${t}`]) !== null) notas.push({
            disciplina_id: row.disciplina_id, tipo_nota: 'npt', trimestre: t, valor: this.round(row[`npt${t}`],2)
          });

          if (this.safeNum(row[`mt${t}`]) !== null) notas.push({
            disciplina_id: row.disciplina_id, tipo_nota: 'mt', trimestre: t, valor: this.round(row[`mt${t}`],2)
          });
        });

        // MFD
        if (this.safeNum(row.mfd) !== null) notas.push({
          disciplina_id: row.disciplina_id, tipo_nota: 'mfd', trimestre: null, valor: this.round(row.mfd,2)
        });

        // Exame / MFE se ativados e presentes
        if (this.ativarExame && this.safeNum(row.exame) !== null) notas.push({
          disciplina_id: row.disciplina_id, tipo_nota: 'exame', trimestre: null, valor: this.round(row.exame,2)
        });
        if (this.ativarExame && this.safeNum(row.mfe) !== null) notas.push({
          disciplina_id: row.disciplina_id, tipo_nota: 'mfe', trimestre: null, valor: this.round(row.mfe,2)
        });

        // Recurso / MFR se ativados e presentes
        if (this.ativarRecurso && this.safeNum(row.recurso) !== null) notas.push({
          disciplina_id: row.disciplina_id, tipo_nota: 'recurso', trimestre: null, valor: this.round(row.recurso,2)
        });
        if (this.ativarRecurso && this.safeNum(row.mfr) !== null) notas.push({
          disciplina_id: row.disciplina_id, tipo_nota: 'mfr', trimestre: null, valor: this.round(row.mfr,2)
        });
      });

      return {
        aluno_id: this.alunoId,
        classe: String(this.selectedClasse),
        ano_letivo: this.anoLetivo,
        escola_id: this.escolaId,
        curso_id: null,
        notas
      };
    },

    async saveTerm() {
      this.rows.forEach(r => this.calcAllMts(r));
      const payload = this.payloadPreview();
      if (!payload.notas.length) { alert('Adicione pelo menos uma linha com disciplina e notas antes de salvar.'); return; }

      this.loaderSave = true
      try {
        const res = await api.add('/termos/aluno/store', payload);
        this.loaderSave = false
        this.$router.push('/termos')
        alert(res.data?.message || 'Termo salvo com sucesso');
      } catch (err) {
        console.error('Erro ao salvar termo:', err);
        this.loaderSave = false
        // alert('Erro ao salvar termo. Verifica console.');
      }
    },

    onVisualizar() { this.$router.push({ path: '/termo/view' }); }
  }
};
</script>

<style scoped>
body { font-family: Arial, sans-serif; font-size: 12px; }
.main-content { padding: 1rem; }

/* tabela */
.table-responsive { overflow-x: auto; }
.table-edit { border-collapse: collapse; width: 100%; min-width: 900px; }
.table-edit th, .table-edit td { border: 1px solid #000; padding: 6px; text-align: center; }
.table-edit th { background: #f2f2f2; }
.red { color: red; font-weight: bold; }
.disciplinas { text-align: left; font-weight: bold; padding-left: 8px; }
.input-sm { padding: 4px; font-size: 12px; }

/* toggle switch */
.switch { position: relative; display:inline-block; width:46px; height:24px; }
.switch input { display:none; }
.slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:#ccc; transition:.4s; border-radius:24px; }
.slider:before { position:absolute; content:""; height:18px; width:18px; left:3px; bottom:3px; background:white; transition:.4s; border-radius:50%; }
input:checked + .slider { background: #4caf50; }
input:checked + .slider:before { transform: translateX(22px); }

/* nota color classes */
.nota-red { color: #d32f2f !important; font-weight: 700; }
.nota-blue { color: #1565c0 !important; font-weight: 700; }

/* responsive tweaks */
@media (max-width: 900px) { .table-edit { min-width: 700px; } }

.input-termo {
  width: 75px !important;
}
</style>

<!-- 8.00	0.00	0.00	2.67	0.00	1.34	0.00	0.67	2.67	11.00	11.00	11.00	11.00	0.00	5.50	0.00	2.75	11.00	10.00	0.00	0.00	3.33	0.00	1.67	0.00	0.84	3.33	5.00	0.00	0.00	1.67	0.00	0.84	0.00	0.42	1.67 -->
