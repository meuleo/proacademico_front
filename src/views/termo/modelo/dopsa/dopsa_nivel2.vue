<template>
  <div>
    <navbar />
    <sidebar />

    <div class="main-content p-4">
      <!-- Botões de controlo -->
      <div class="mb-4 mt-5 col-8 mx-auto">
        <button class="btn btn-primary me-2" @click="imprimirPDF"><i class="fas fa-print"></i> Imprimir</button>
        <button class="btn btn-warning me-2" @click="editarAluno"><i class="fas fa-user"></i> Atualizar dados do Aluno</button>
        <button class="btn btn-secondary me-2" @click="termosAgrupado"><i class="fas fa-arrow-right"></i> Termos agrupado</button>
        <!-- <button class="btn btn-info me-2" @click="visibleColumnNpp = !visibleColumnNpp">Ativar/Desativar NPP</button>
        <button class="btn btn-info me-2" @click="visibleColumnExame = !visibleColumnExame">Ativar/Desativar Exame</button>
        <button class="btn btn-info me-2" @click="visibleColumnRecurso = !visibleColumnRecurso">Ativar/Desativar Recurso</button> -->
      </div>
      <div class="card p-4 col-8 mx-auto">

        <div id="conteudo-pdf">
          <!-- Cabeçalho -->
          <!-- Cabeçalho oficial -->
          <div class="text-center mb-1">
            <img src="/assets/images/insigbnia.PNG" alt="Logotipo" class="mx-auto" width="62"/>
            <h3 class="text-9">REPÚBLICA DE ANGOLA</h3>
            <h4 class="text-9">MINISTÉRIO DA EDUCAÇÃO</h4>
            <h4 class="text-9">REPARTIÇÃO MUNICIPAL DE EDUCAÇÃO DO LUBANGO</h4>
            <h4 class="text-9">COLÉGIO Nº 811 - 1º DE MAIO</h4>
          </div>

          <!-- Título -->
          <h2 class="text-center font-bold underline mb-1 text-14">
            FICHA DE REGISTOS DE DADOS ACADÉMICOS Nº _____
          </h2>

          <!-- Dados do aluno -->
          <div class="mb-1">
            <p class="text-9 mb-1"><b>Nome:</b> <span class="text-red-600 text-danger text-12"><b>{{ termo?.aluno?.nome_completo ?? "-" }}</b></span> <b>Natural de:</b> {{ termo?.aluno?.naturalidade ?? "-" }} &nbsp;&nbsp; <b>Município:</b> {{ termo?.aluno?.municipio ?? "-" }} &nbsp;&nbsp; <b>Província de:</b> {{ termo?.aluno?.provincia ?? "-" }} <b>Nascido(a) no dia:</b> {{ dia }} &nbsp;&nbsp; <b>do mês de:</b> {{ nomeMes }} &nbsp;&nbsp; <b>de:</b> {{ ano }} <b>Filho (a) de:</b> {{ termo?.aluno?.pai ?? "-" }} &nbsp;&nbsp; <b>e de:</b> {{ termo?.aluno?.mae ?? "-" }}
              <b>Portador do B. Identidade Nº:</b> {{ termo?.aluno?.bi ?? "-" }} &nbsp;&nbsp; 
              <b>emitido em:</b> {{ termo?.aluno?.bi_emissao ?? "-" }}
            </p>
            <p class="text-9 m-0">
              <b>Ano lectivo:</b> {{termo.ano_letivo}} &nbsp;&nbsp; 
              <b>Ciclo:</b> I &nbsp;&nbsp; 
              <b>Classe:</b> {{termo.classe}}ª &nbsp;&nbsp; 
              <b>Turma:</b> _ &nbsp;&nbsp; 
              <b>Nº:</b> {{ termo?.aluno?.matricula?.num_aluno ?? "-" }}
              <!-- Obs: <b>_</b> -->
            </p>
          </div>
          <!-- Tabela -->
          <div class="row">
            <div class="col-8 p-0">
              
              <table v-if="rows.length" class="w-full border-collapse border m-0 text-sm">
                <thead>
                  <tr>
                    <th rowspan="2" class="border px-2 py-1">DISCIPLINAS</th>
                    <th colspan="4" class="border">I Trimestre</th>
                    <th colspan="4" class="border">II Trimestre</th>
                    <th colspan="4" class="border">III Trimestre</th>
                    <th rowspan="2" class="border px-2 py-1">MFD</th>
                    <th v-if="$route.params.classe == 9 || $route.params.classe == 7" rowspan="2" class="border px-2 py-1">E</th>
                    <th v-if="$route.params.classe == 9 || $route.params.classe == 7" rowspan="2" class="border px-2 py-1">MF</th>
                    <th v-if="$route.params.classe == 9 || $route.params.classe == 7" rowspan="2" class="border px-2 py-1">R</th>
                  </tr>
                  <tr>
                    <!-- I trimestre -->
                    <th class="border">MAC</th>
                    <th v-if="visibleColumnNpp" class="border">NPP</th>
                    <th class="border">NPT</th>
                    <th class="border">MT1</th>
                    <!-- II trimestre -->
                    <th class="border">MAC</th>
                    <th v-if="visibleColumnNpp" class="border">NPP</th>
                    <th class="border">NPT</th>
                    <th class="border">MT2</th>
                    <!-- III trimestre -->
                    <th class="border">MAC</th>
                    <th v-if="visibleColumnNpp" class="border">NPP</th>
                    <th class="border">NPT</th>
                    <th class="border">MT3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in rows" :key="row.uid">
                    <td class="border text-start font-bold ps-2">{{ row.disciplina?.nome ?? '---' }}</td>

                    <!-- I trimestre -->
                    <td class="border" :class="getNotaClass(row.mac1)">{{ row.mac1 ?? '-' }}</td>
                    <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp1)">{{ row.npp1 ?? '-' }}</td>
                    <td class="border" :class="getNotaClass(row.npt1)">{{ row.npt1 ?? '-' }}</td>
                    <td class="border" :class="getNotaClass(row.mt1)">{{ row.mt1 ?? '-' }}</td>

                    <!-- II trimestre -->
                    <td class="border" :class="getNotaClass(row.mac2)">{{ row.mac2 ?? '-' }}</td>
                    <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp2)">{{ row.npp2 ?? '-' }}</td>
                    <td class="border" :class="getNotaClass(row.npt2)">{{ row.npt2 ?? '-' }}</td>
                    <td class="border" :class="getNotaClass(row.mt2)">{{ row.mt2 ?? '-' }}</td>

                    <!-- III trimestre -->
                    <td class="border" :class="getNotaClass(row.mac3)">{{ row.mac3 ?? '-' }}</td>
                    <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp3)">{{ row.npp3 ?? '-' }}</td>
                    <td class="border" :class="getNotaClass(row.npt3)">{{ row.npt3 ?? '-' }}</td>
                    <td class="border" :class="getNotaClass(row.mt3)">{{ row.mt3 ?? '-' }}</td>

                    <!-- MFD -->
                    <td class="border font-bold" :class="getNotaClass(row.mfd)">{{ row.mfd ?? '-' }}</td>

                    <!-- E, MF, R -->
                    <td v-if="$route.params.classe == 9 || $route.params.classe == 7" class="border" :class="getNotaClass(row.exame)">{{ row.exame ?? '-' }}</td>
                    <td v-if="$route.params.classe == 9 || $route.params.classe == 7" class="border" :class="getNotaClass(row.mf)">{{ row.mf ?? '-' }}</td>
                    <td v-if="$route.params.classe == 9 || $route.params.classe == 7" class="border" :class="getNotaClass(row.recurso)">{{ row.recurso ?? '-' }}</td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div class="col-4 ps-5">
              <div class="text-center">
                <p class="text-10">OBS: <strong :class="bg_observacao"> {{ observacao }} </strong></p>
                <p class="m-0 text-9 mb-4">Lubango, aos 12 de dezembro de 2026</p>
                <p class="text-10"><strong>CONSELHO DE NOTAS,</strong></p>
                <div>
                  <div class="d-flex justify-content-center text-9">
                    1. <span style="display: inline-block; width: 200px; border-bottom: 1px solid #000;"></span>
                  </div>
                  <div class="d-flex justify-content-center text-9">
                    2. <span style="display: inline-block; width: 200px; border-bottom: 1px solid #000;"></span>
                  </div>
                  <div class="d-flex justify-content-center text-9">
                    3. <span style="display: inline-block; width: 200px; border-bottom: 1px solid #000;"></span>
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
import navbar from "@/components/navbar.vue";
import sidebar from "@/components/sidebar.vue";
import * as api from "@/api/api.js";
import html2pdf from "html2pdf.js";

export default {
  components: { navbar, sidebar },
  data() {
    return {
      termoId: '',
      termo: null,
      rows: [],
      visibleColumnNpp: true,
      visibleColumnExame: true,
      visibleColumnRecurso: true,
      bg_observacao: '',
      summary: null, // resumo igual ao do outro componente
      dia: '',
      mes: '',
      ano: '',
      nomeMes: ''
    };
  },
  async created() {
    await this.loadTermo();
  },
  computed: {
    observacao() {
      if (!this.summary) return "-";
      this.bg_observacao = this.summary.obsClass;
      return this.summary.observacao;
    }
  },
  methods: {
    termosAgrupado() {
      this.$router.push(`/termos/${this.$route.params.alunoId}/agrupado`)
    },

    editarAluno() {
      this.$router.push('/alunos/edit/' + this.$route.params.alunoId)
    },
    getNotaClass(valor) {
      if (valor === null || valor === undefined || valor === '-') return 'text-dark';
      if (valor >= 10) return 'text-primary font-bold';
      return 'text-danger font-bold';
    },
    imprimirPDF() {
      const elemento = document.getElementById("conteudo-pdf");
      const opcoes = {
        margin: [5, 5, 5, 5],
        filename: "termo.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true, dpi: 300, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };
      html2pdf().set(opcoes).from(elemento).save();
    },
    async loadTermo() {
      this.termoId = this.$route.params.termo_id;
      try {
        const res = await api.listar(`/termos/aluno/show/${this.termoId}`);
        const termo = res?.data?.termo || res?.termo || res?.data || res;
        if (!termo || !Array.isArray(termo.notas)) {
          this.rows = [];
          this.summary = null;
          return;
        }

        this.termo = termo;

        this.separarData(termo?.aluno?.data_nascimento)

        const rowsByDisc = {};
        termo.notas.forEach((n) => {
          if (!n) return;
          const did = n.disciplina_id ?? n.disciplina?.id;
          if (!did) return;
          if (!rowsByDisc[did]) {
            rowsByDisc[did] = {
              uid: `${did}-${Math.random().toString(36).slice(2,8)}`,
              disciplina: n.disciplina || { id: did, nome: '---' },
              mac1:null, npp1:null, npt1:null, mt1:null,
              mac2:null, npp2:null, npt2:null, mt2:null,
              mac3:null, npp3:null, npt3:null, mt3:null,
              mfd:null, exame:null, recurso:null, mf:null,
              finalBase:null, finalComExame:null, finalComRecurso:null, transita:null
            };
          }
          const r = rowsByDisc[did];
          const tipo = (n.tipo_nota || '').toLowerCase();
          const tri = (n.trimestre === null || n.trimestre === undefined || n.trimestre === '') ? null : Number(n.trimestre);
          const val = (n.valor === null || n.valor === '' || n.valor === undefined) ? null : Number(n.valor);

          if (tri === 1 || tri === 2 || tri === 3) {
            if (tipo === "mac") r[`mac${tri}`] = val;
            if (tipo === "npp") r[`npp${tri}`] = val;
            if (tipo === "npt") r[`npt${tri}`] = val;
            if (tipo === "mt") r[`mt${tri}`] = val;
          } else {
            if (tipo === "mfd" || tipo === "mfe") r.mfd = val;
            if (tipo === "exame") r.exame = val;
            if (tipo === "recurso") r.recurso = val;
          }
        });

        // cálculo final por disciplina (igual ao primeiro código)
        Object.values(rowsByDisc).forEach(r => {
          r.finalBase = (r.mfd !== null) ? Number(r.mfd) : null;

          if (r.exame !== null) {
            const baseForExam = (r.finalBase !== null) ? r.finalBase : 0;
            r.finalComExame = Math.round(((baseForExam + Number(r.exame)) / 2) * 10) / 10;
          } else {
            r.finalComExame = null;
          }

          if (r.recurso !== null) {
            const base = (r.finalComExame !== null) ? r.finalComExame : ((r.finalBase !== null) ? r.finalBase : 0);
            r.finalComRecurso = Math.round(((base + Number(r.recurso)) / 2) * 10) / 10;
          } else {
            r.finalComRecurso = null;
          }

          if (r.finalComRecurso !== null) r.mf = Number(r.finalComRecurso.toFixed(1));
          else if (r.finalComExame !== null) r.mf = Number(r.finalComExame.toFixed(1));
          else if (r.finalBase !== null) r.mf = Number(r.finalBase.toFixed(1));
          else r.mf = null;

          r.transita = (r.mf !== null && r.mf >= 10);
        });

        const rows = Object.values(rowsByDisc).sort((a,b) => (a.disciplina?.nome ?? '').localeCompare(b.disciplina?.nome ?? ''));

        // resumo (igual ao primeiro código)
        const _avg = arr => {
          if (!arr || arr.length === 0) return null;
          const nums = arr.map(Number).filter(x => !Number.isNaN(x));
          if (!nums.length) return null;
          const s = nums.reduce((a,b)=>a+b,0);
          return Math.round((s/nums.length)*10)/10;
        };

        const mfdVals = rows.map(r=>r.mfd).filter(v=>v!==null);
        const exameVals = rows.map(r=>r.exame).filter(v=>v!==null);
        const recursoVals = rows.map(r=>r.recurso).filter(v=>v!==null);

        const mediaMFD = _avg(mfdVals);
        const mediaExame = _avg(exameVals);
        const mediaRecurso = _avg(recursoVals);

        let mediaComExame = null;
        if (mediaExame !== null && mediaMFD !== null) {
          mediaComExame = Math.round(((mediaMFD + mediaExame)/2)*10)/10;
        } else if (mediaExame !== null && mediaMFD === null) {
          mediaComExame = Math.round((( (mediaMFD ?? 0) + mediaExame)/2)*10)/10;
        }

        let mediaComRecurso = null;
        if (mediaRecurso !== null) {
          const base = (mediaComExame !== null) ? mediaComExame : (mediaMFD ?? 0);
          mediaComRecurso = Math.round(((base + mediaRecurso)/2)*10)/10;
        }

        let mediaAtual = null;
        if (mediaComRecurso !== null) mediaAtual = mediaComRecurso;
        else if (mediaComExame !== null) mediaAtual = mediaComExame;
        else mediaAtual = mediaMFD;

        const transita = (mediaAtual !== null && mediaAtual >= 10);

        const parts = [];
        // Retorna medias
        // parts.push(`Média MFD: ${mediaMFD !== null ? mediaMFD.toFixed(1) : '-'}`);
        // if (mediaExame !== null) parts.push(`Média Exames: ${mediaExame.toFixed(1)}`);
        // if (mediaComExame !== null) parts.push(`Média c/ Exames: ${mediaComExame.toFixed(1)}`);
        // if (mediaRecurso !== null) parts.push(`Média Recursos: ${mediaRecurso.toFixed(1)}`);
        // if (mediaComRecurso !== null) parts.push(`Média c/ Recursos: ${mediaComRecurso.toFixed(1)}`);
        parts.push(transita ? "Transita" : "Não transita");

        this.summary = {
          mediaMFD, mediaExame, mediaRecurso,
          mediaComExame, mediaComRecurso,
          mediaAtual, transita,
          observacao: parts.join(" | "),
          obsClass: transita ? "text-primary" : "text-danger",
          disciplinasContadas: rows.length
        };

        this.rows = rows;

      } catch (err) {
        console.error("Erro no loadTermo:", err);
        this.rows = [];
        this.summary = null;
      }
    },
    separarData(data) {
      if (!data) return;

      [this.ano, this.mes, this.dia] = data.split('-');

      this.nomeMes = this.nomeDoMes(this.mes);
    },
    nomeDoMes(numeroMes) {
      const meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
      ];

      const index = parseInt(numeroMes, 10) - 1;

      return meses[index] || '';
    }
  },
};
</script>


<style scoped>
table th,
table td {
  text-align: center;
  margin: 0;
  padding: 0;
  font-size: 10pt !important;
}
table {
  width: 100%;
}
h1,h2,h3,h4,h5 {
  font-size: 16px;
}

.text-9 { font-size: 9pt !important;}
.text-10 { font-size: 10pt !important;}
.text-11 { font-size: 11pt !important;}
.text-12 { font-size: 12pt !important;}
.text-14 { font-size: 14pt !important;}
</style> 
