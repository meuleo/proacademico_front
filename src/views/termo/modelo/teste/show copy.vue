<template>
  <div>
    <navbar />
    <sidebar />

    <div class="main-content p-4">
      <h3>Criar termo</h3>

      <!-- Configurações -->
      <div class="config mb-3">
        <div class="row p-0">
          <div>
            <p class="mb-1"><strong>Aluno: </strong> aluno</p>
            <p><strong>Classe: </strong> {{selectedClasse ?? ''}}ª Classe</p> 
          </div>
          <div class="col-md-4 mb-3" v-show="$route.params?.nivel == 3">
            <!-- <label>Curso</label> --> 
            <select name="" id="" class="form-select">
              <option value="">Selecione o curso</option>
              <option v-for="item in cursos" :value="item.id"> 
                {{ item.nome }}
              </option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <input v-model="anoLetivo" class="form-control" />
          </div>

          <hr>

          <!-- <div class="col">
            <label>Aluno ID</label>
            <input v-model.number="alunoId" type="number" class="form-control" />
          </div> -->
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

          <!-- <div>
            <label>Escola (fixo)</label>
            <div><strong>{{ escolaId }}</strong></div>
          </div> -->
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
              <th rowspan="2">Ações</th>
            </tr>

            <tr>
              <!-- segunda linha do cabeçalho: sempre renderiza as colunas conforme ativarNpp -->
              <template v-if="trimestres[1]">
                <th>MAC</th>
                <th v-if="ativarNpp">NPP</th>
                <th v-if="!ativarNpp">NPT</th> <!-- quando NPP desativado, shift: mostra NPT em 2º posição -->
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

              <!-- Ações -->
              <td>
                <button class="btn btn-sm btn-danger" @click="removeRow(idx)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex gap-2 mb-3">
        <button class="btn btn-warning" @click="addRow">Inserir linha</button>
        <button class="btn btn-primary" @click="saveTerm">Salvar termo</button>
        <button class="btn btn-secondary" @click="onVisualizar">Visualizar</button>
      </div>

      <!-- debug -->
      <pre v-if="debug">{{ JSON.stringify(payloadPreview(), null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import * as api from '@/api/api.js';
import * as request from '@/api/request.js'; 

export default {
  components: { navbar, sidebar },
  data() {
    return {
      // configuração
      nivel: 2,
      classesPorNivel: { 1: [2,3,4], 2: [7,8,9], 3: [10,11,12,13] },
      selectedClasse: '',
      anoLetivo: '2025/2026',
      alunoId: '',
      escolaId: '',
      trimestres: { 1: true, 2: true, 3: true },
      ativarNpp: true,

      // dados
      disciplinas: [],
      cursos: [],
      rows: [],
      debug: false,

      // caso venham para edição
      termoId: null
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
    }
  },

  created() {
    // se rota traz termo_id, carrega (para edição)
    this.fetchDisciplinas()
    this.fetchCursos()

    this.termoId = this.$route.params.termo_id || this.$route.query.termo_id;
    if (true) {
      this.loadTermo();
    } else {
      // criação: duas linhas vazias por padrão
      this.addRow(); this.addRow();
    }
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
        // console.log('[loadTermo] solicitando termo id:', this.termoId);
        const res = await api.listar(`/termos/buscar/aluno/${this.$route.params.alunoId}`);

        console.log('[loadTermo] resposta raw:', res);

        // Normaliza o objeto termo (suporta vários formatos de resposta)
        const termo = (res && res.data && res.data.termo)
          || (res && res.termo)
          || (res && res.data && res.data)
          || res;

        if (!termo || !Array.isArray(termo.notas)) {
          console.warn('[loadTermo] formato inesperado:', termo);
          alert('Termo inválido ou sem notas.');
          return;
        }

        // preenche campos básicos
        this.selectedClasse = Number(termo.classe);
        this.anoLetivo = termo.ano_letivo;
        this.alunoId = termo.aluno_id;
        this.escolaId = termo.escola_id;

        // alert("alu " + this.alunoId + " escola " + this.escolaId + " classe " + this.selectedClasse)

        // disciplinas únicas vindas das notas
        const disciplinasUnicas = termo.notas
          .map(n => n.disciplina)
          .filter((d, i, arr) => d && arr.findIndex(x => x.id === d.id) === i);
        // se encontramos disciplinas nas notas, sobrescreve a lista local
        if (disciplinasUnicas.length) this.disciplinas = disciplinasUnicas;

        // ativa NPP se houver pelo menos uma nota do tipo npp
        this.ativarNpp = termo.notas.some(n => n.tipo_nota === 'npp');

        // agrupa notas por disciplina
        const rowsByDisc = {};
        termo.notas.forEach(n => {
          if (!n || typeof n.disciplina_id === 'undefined') return;
          const did = n.disciplina_id;
          if (!rowsByDisc[did]) {
            rowsByDisc[did] = {
              uid: Date.now() + Math.random(),
              disciplina_id: did,
              mac1: null, npp1: null, npt1: null, mt1: null,
              mac2: null, npp2: null, npt2: null, mt2: null,
              mac3: null, npp3: null, npt3: null, mt3: null,
              mfd: null
            };
          }

          const target = rowsByDisc[did];
          const t = n.trimestre; // pode ser null (mfd)

          // parse seguro do valor
          let val = null;
          if (n.valor !== null && n.valor !== undefined && n.valor !== '') {
            const parsed = parseFloat(n.valor);
            val = Number.isFinite(parsed) ? parsed : null;
          }

          if (n.tipo_nota === 'mac' && (t === 1 || t === 2 || t === 3)) target[`mac${t}`] = val;
          if (n.tipo_nota === 'npp' && (t === 1 || t === 2 || t === 3)) target[`npp${t}`] = val;
          if (n.tipo_nota === 'npt' && (t === 1 || t === 2 || t === 3)) target[`npt${t}`] = val;
          if (n.tipo_nota === 'mt'  && (t === 1 || t === 2 || t === 3)) target[`mt${t}`]  = val;
          if (n.tipo_nota === 'mfd') target.mfd = val;
        });

        this.rows = Object.values(rowsByDisc);
        // recalcula MTs/MFDs para consistência
        this.rows.forEach(r => this.calcAllMts(r));

        console.log('[loadTermo] linhas montadas:', this.rows);
      } catch (err) {
        console.error('Erro no loadTermo (catch):', err);
        if (err && err.response) console.error('err.response:', err.response);
        // alert('Erro ao carregar termo.');
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
        mfd: null
      });
    },
    removeRow(index) { this.rows.splice(index,1); },

    onNotaChange(row, trimestre) {
      this.calcMt(row, trimestre);
      this.calcMfd(row);
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

        if (this.safeNum(row.mfd) !== null) notas.push({
          disciplina_id: row.disciplina_id, tipo_nota: 'mfd', trimestre: null, valor: this.round(row.mfd,2)
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

      try {
        const res = await api.add('/termos/aluno/store', payload);
        alert(res.data?.message || 'Termo salvo com sucesso');
        // opcional: redirecionar para visualização
        // this.$router.push({ path: '/termo/view', query: { termo_id: res.data?.termo_id } });
      } catch (err) {
        console.error('Erro ao salvar termo:', err);
        alert('Erro ao salvar termo.');
      }
    },

    onVisualizar() { this.$router.push({ path: '/termo/view' }); }
  }
};
</script>

<style>
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
</style>
