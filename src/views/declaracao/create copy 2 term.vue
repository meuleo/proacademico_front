<template>
  <div class="certificate-wrapper p-3">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div>
      <div class="mt-2 text-muted">Carregando dados...</div>
    </div>

    <div v-else>
      <!-- Cabeçalho / Dizeres -->
      <div class="text-center mb-3">
        <p class="mb-0 small">República de Angola</p>
        <p class="mb-0 small">Ministério da Educação</p>
        <p class="fw-bold mb-1">I CICLO DO ENSINO SECUNDÁRIO</p>
        <h3 class="fw-bold mt-2">CERTIFICADO</h3>
      </div>

      <div class="mb-3">
        <p>
          <strong>{{ institutionName || 'NOME DA INSTITUIÇÃO' }}</strong>
        </p>
        <p>
          Certifica que <strong>{{ aluno.nome || '—' }}</strong>, concluiu no ano lectivo <strong>{{ globalInfo.ano_lectivo || '—' }}</strong> o I Ciclo do Ensino Secundário Geral, com as classificações por disciplina abaixo:
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
                <div class="small text-muted">{{ col.sub }}</div>
              </th>

              <th class="text-center">MÉDIA FINAL</th>
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
              <td class="text-center fw-bold">
                {{ formatCell(discAverages[disc.key]) }}
              </td>

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
import * as api from '../../api/api.js';

export default {
  name: 'DynamicCertificatePauta',
  props: {
    alunoId: { type: [Number, String], default: null },
    // opcional: se já tiveres o payload localmente podes passá-lo por prop 'payload'
    payload: { type: Object, default: null }
  },
  data() {
    return {
      loading: false,
      aluno: {},
      turmas: [],         // payload.turmas
      disciplines: [],    // [{ key: discId, name }]
      values: {},         // { discKey: { turmaKey: media_finalNumber, ... } }
      discAverages: {},   // { discKey: avgNumber }
      displayColumns: [], // [{ turmaKey, label, sub }]
      globalInfo: { ano_lectivo: null },
      institutionName: null,
      issuedDate: new Date().toLocaleDateString(),
      directorName: null
    };
  },
  created() {
    // se o payload veio por prop, usa-o; senão busca pela API
      // if (this.payload) {
      //   this.processPayload(this.payload);
      // } else {
      //   const id = this.alunoId || (this.$route && this.$route.params && this.$route.params.alunoId);
      //   if (!id) {
      //     console.warn('DynamicCertificatePauta: alunoId não fornecido');
      //     return;
      // }
      this.loadFromApi(35);
    // }
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

    processPayload(payload) {
      // segurança
      if (!payload) return;

      this.aluno = payload.aluno || {};
      this.turmas = payload.turmas || [];
      // global info
      if (this.turmas.length && this.turmas[0].turma) {
        this.globalInfo.ano_lectivo = this.turmas[0].turma.ano_letivo || this.globalInfo.ano_lectivo;
        this.institutionName = this.turmas[0].turma.nome || this.institutionName;
        this.directorName = this.turmas[0].turma.diretor || this.directorName;
      }

      // construir displayColumns (dinâmico, uma coluna por turma)
      this.displayColumns = this.turmas.map((t, idx) => {
        const turma = t.turma || {};
        const turmaKey = `turma_${turma.id ?? idx}`;
        const label = turma.classe ? `${turma.classe}ª CLASSE` : (turma.nome ?? `Turma ${turma.id ?? idx+1}`);
        const sub = (turma.serie ? `Série ${turma.serie}` : '') + (turma.turno ? ` • ${turma.turno}` : '');
        return { turmaKey, label, sub: sub.trim(), turmaId: turma.id ?? null };
      });

      // união de disciplinas e valores por disciplina/turma
      const discMap = new Map();
      const values = {}; // temp storage

      this.turmas.forEach((t, ti) => {
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
              .map(ti => (ti && ti.media) ? Number(ti.media) : NaN)
              .filter(n => !isNaN(n));
            if (nums.length) value = nums.reduce((a,b)=>a+b,0)/nums.length;
          }

          if (!values[discKey]) values[discKey] = {};
          values[discKey][turmaKey] = (value === null || isNaN(value)) ? null : Math.round((value + Number.EPSILON) * 100) / 100;
        });
      });

      this.disciplines = Array.from(discMap.values());
      this.values = values;

      // calcular médias por disciplina (média entre colunas não-nulas)
      const discAverages = {};
      this.disciplines.forEach(d => {
        const row = this.values[d.key] || {};
        const vals = Object.values(row).filter(v => v !== null && v !== undefined && !isNaN(Number(v))).map(Number);
        discAverages[d.key] = vals.length ? Math.round(((vals.reduce((a,b)=>a+b,0)/vals.length) + Number.EPSILON) * 100) / 100 : 0;
      });
      this.discAverages = discAverages;
    },

    formatCell(v) {
      if (v === null || v === undefined || v === 0) {
        return v === 0 ? '0,00' : '';
      }
      return Number(v).toFixed(2).replace('.', ',');
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
