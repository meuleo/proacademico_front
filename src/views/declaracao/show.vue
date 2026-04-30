<template>
  <Navbar/>

  <br>
  
  <div class="certificate-wrapper p-3 mt-5">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>
      <div class="mt-2 text-muted">Carregando...</div>
    </div>

    <div v-else>
      <!-- Cabeçalho / Dizeres -->
      <div class="text-center mb-3">
        <p class="mb-0 small">República de Angola</p>
        <p class="mb-0 small">Ministério da Educação</p>
        <p class="fw-bold mb-1">I CICLO DO ENSINO SECUNDÁRIO</p>
        <h3 class="fw-bold mt-2">TERMO DE FREQUÊNCIA</h3>
      </div>

      <div class="mb-3">
        <p>
          <strong>{{ institutionName || 'NOME DA INSTITUIÇÃO' }}</strong>
        </p>
        <p>
          Certifica que <strong class="text-danger">{{ aluno.nome || '—' }}</strong>, Frequentou no ano lectivo <strong>{{ globalInfo.ano_lectivo || '—' }}</strong> o I Ciclo do Ensino Secundário Geral, com as classificações por disciplina abaixo:
        </p>
      </div>

      <!-- Tabela dinâmica -->
      <div class="table-responsive">
        <table class="table table-bordered certificate-table">
          <thead>
            <tr>
              <th>DISCIPLINAS</th>

              <!-- coluna por turma dinamicamente -->
              <th v-for="col in displayColumns" :key="col.turmaKey" class="text-center">
                {{ col.label }}
                <!-- <div class="small text-muted">{{ col.sub }}</div> -->
              </th>

              <!-- <th class="text-center">MÉDIA FINAL</th> -->
              <th class="text-center">MÉDIA POR EXTENSO</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="disc in disciplines" :key="disc.key">
              <td class="text-start">{{ disc.name }}</td>

              <td v-for="col in displayColumns" :key="disc.key + '_' + col.turmaKey" class="text-center">
                <span v-if="values[disc.key] && values[disc.key][col.turmaKey] !== undefined">
                  {{ formatCell(values[disc.key][col.turmaKey]) }}
                </span>
                <span v-else>--</span>
              </td>

              <!-- média final -->
              <!-- <td class="text-center fw-bold">
                {{ formatCell(discAverages[disc.key]) }}
              </td> -->

              <!-- por extenso -->
              <td class="text-center">
                {{ numberToPortugueseExtenso(discAverages[disc.key]) }}
              </td>
            </tr>

            <tr v-if="disciplines.length === 0">
              <td colspan="999" class="text-center py-4 text-muted">Sem disciplinas para mostrar.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- rodapé simples -->
      <div class="mt-4">
        <p class="mb-0">Emitido em: <strong>{{ issuedDate }}</strong></p>
        <p class="mb-0">Diretor: <strong>{{ directorName || '—' }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/navbar.vue';
import * as api from '../../api/api.js';

export default {
  name: 'DynamicCertificatePauta',
  
  components: {
    Navbar
  },

  data() {
    return {
      loading: false,
      aluno: {},
      turmas: [],         // payload.turmas
      disciplines: [],    // [{ key: discId, name }]
      values: {},         // { discKey: { turmaKey: media_finalInteger, ... } }
      discAverages: {},   // { discKey: avgInteger }
      displayColumns: [], // [{ turmaKey, label, sub }]
      globalInfo: { ano_lectivo: null },
      institutionName: null,
      issuedDate: new Date().toLocaleDateString(),
      directorName: null
    };
  },
  created() {
    this.loadFromApi(this.$route.params.id);
  },
  methods: {
    async loadFromApi(alunoId) {
      try {
        this.loading = true;
        const resp = await api.listar(`termos/buscar/aluno/${alunoId}`);
        const payload = resp.data || resp;
        this.processPayload(payload);
      } catch (err) {
        console.error('Erro ao carregar payload', err);
        alert('Erro ao carregar dados. Veja console.');
      } finally {
        this.loading = false;
      }
    },

    // devolve número da classe se possível, senão null
    parseClasseNumber(turma) {
      if (!turma) return null;
      const c = turma.classe;
      if (c === null || c === undefined) return null;
      // tenta extrair somente números (ex.: "10" ou "10A")
      const match = String(c).match(/(\d{1,2})/);
      if (match) return Number(match[1]);
      // se não contém número, retorna null
      return null;
    },

    processPayload(payload) {
      if (!payload) return;

      this.aluno = payload.aluno || {};
      this.turmas = payload.turmas || [];

      // global info e director
      if (this.turmas.length && this.turmas[0].turma) {
        this.globalInfo.ano_lectivo = this.turmas[0].turma.ano_lectivo || this.globalInfo.ano_lectivo;
        this.institutionName = this.turmas[0].turma.nome || this.institutionName;
        this.directorName = this.turmas[0].turma.diretor || this.directorName;
      }

      // ordenar turmas por classe numérica crescente; se não tiver classe usa turma.id
      const turmasSorted = [...this.turmas].sort((a, b) => {
        const ta = a.turma || {};
        const tb = b.turma || {};
        const na = this.parseClasseNumber(ta);
        const nb = this.parseClasseNumber(tb);
        if (na !== null && nb !== null) return na - nb;
        if (na !== null && nb === null) return -1;
        if (na === null && nb !== null) return 1;
        // fallback por turma id
        const ida = ta.id ?? 0;
        const idb = tb.id ?? 0;
        return ida - idb;
      });

      // construir displayColumns a partir das turmas ordenadas
      this.displayColumns = turmasSorted.map((t, idx) => {
        const turma = t.turma || {};
        const turmaKey = `turma_${turma.id ?? idx}`;
        const classeNum = this.parseClasseNumber(turma);
        const label = classeNum !== null ? `${classeNum}ª CLASSE` : (turma.nome ?? `Turma ${turma.id ?? idx+1}`);
        return { turmaKey, label, turmaId: turma.id ?? null, rawTurma: turma };
      });

      // união de disciplinas e valores por disciplina/turma (respeitando ordem das turmasSorted)
      const discMap = new Map();
      const values = {}; // temp storage

      turmasSorted.forEach((t, ti) => {
        const turmaKey = `turma_${(t.turma && t.turma.id) ? t.turma.id : ti}`;
        const pauta = t.pauta || {};
        Object.keys(pauta).forEach(did => {
          const item = pauta[did] || {};
          const discKey = String(did);
          const discName = item.disciplina || `Disciplina ${discKey}`;

          if (!discMap.has(discKey)) discMap.set(discKey, { key: discKey, name: discName });

          // calcular valor a mostrar: preferir media_final, se não houver, calcular a partir dos trimestres
          let value = null;
          if (typeof item.media_final !== 'undefined' && item.media_final !== null) {
            value = Number(item.media_final);
          } else if (Array.isArray(item.trimestres) && item.trimestres.length) {
            const nums = item.trimestres
              .map(tr => (tr && tr.media) ? Number(tr.media) : NaN)
              .filter(n => !isNaN(n));
            if (nums.length) value = nums.reduce((a,b)=>a+b,0)/nums.length;
          }

          // arredonda sempre para inteiro (sem vírgulas)
          const intValue = (value === null || isNaN(value)) ? null : Math.round(Number(value));

          if (!values[discKey]) values[discKey] = {};
          values[discKey][turmaKey] = intValue;
        });

        // também garante colunas para disciplinas que essa turma não tem (manter coerência)
      });

      this.disciplines = Array.from(discMap.values());
      this.values = values;

      // calcular médias por disciplina (média entre colunas não-nulas e arredonda inteiro)
      const discAverages = {};
      this.disciplines.forEach(d => {
        const row = this.values[d.key] || {};
        const vals = Object.values(row)
          .filter(v => v !== null && v !== undefined && !isNaN(Number(v)))
          .map(Number);
        if (vals.length) {
          const avg = vals.reduce((a,b)=>a+b,0) / vals.length;
          discAverages[d.key] = Math.round(avg);
        } else {
          discAverages[d.key] = 0;
        }
      });
      this.discAverages = discAverages;
    },

    // mostra inteiro sem decimais; se null/undefined retorna vazio
    formatCell(v) {
      if (v === null || v === undefined) return '';
      if (isNaN(Number(v))) return '';
      return String(Math.round(Number(v)));
    },

    // transcreve numero inteiro para extenso simples (até 20)
    numberToPortugueseExtenso(value) {
      if (value === null || value === undefined) return '';
      const rounded = Math.round(Number(value));
      const map = {
        0: 'Zero',1:'Um',2:'Dois',3:'Três',4:'Quatro',5:'Cinco',6:'Seis',7:'Sete',8:'Oito',9:'Nove',
        10:'Dez',11:'Onze',12:'Doze',13:'Treze',14:'Catorze',15:'Quinze',16:'Dezasseis',17:'Dezassete',
        18:'Dezoito',19:'Dezanove',20:'Vinte'
      };
      return map[rounded] || String(rounded);
    }
  }
};
</script>

<style scoped>
.certificate-wrapper {
  font-family: "Times New Roman", Georgia, serif;
  color: #111;
}
.certificate-table th, .certificate-table td {
  padding: 0.35rem 0.45rem;
  border: 1px solid #000;
  vertical-align: middle;
  font-size: 0.95rem;
}
.certificate-table thead th {
  background: #f7f7f7;
  font-weight: 700;
}
.small { font-size: 0.85rem; }
</style>
