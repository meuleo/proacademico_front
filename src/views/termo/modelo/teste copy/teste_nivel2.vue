<template>
  <div>
    <navbar />
    <sidebar />

    <div class="main-content p-4">
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
            <p class="text-9 mb-1"><b>Nome:</b> <span class="text-red-600 text-danger text-12"><b>{{ termo?.aluno?.nome_completo ?? "GENEROSA NDOMBOILA" }}</b></span> <b>Natural de:</b> Lubango &nbsp;&nbsp; <b>Município:</b> Lubango &nbsp;&nbsp; <b>Província de:</b> Huila <b>Nascido(a) no dia:</b> 12 &nbsp;&nbsp; <b>do mês de:</b> Março &nbsp;&nbsp; <b>de:</b> 2009 <b>Filho (a) de:</b> António Domingos &nbsp;&nbsp; <b>e de:</b> Maria João
              <b>Portador do B. Identidade Nº:</b> 004914456NE041 &nbsp;&nbsp; 
              <b>emitido em:</b> 2022
            </p>
            <p class="text-9 m-0">
              <b>Ano lectivo:</b> {{termo.ano_letivo}} &nbsp;&nbsp; 
              <b>Ciclo:</b> I &nbsp;&nbsp; 
              <b>Classe:</b> {{termo.classe}}ª &nbsp;&nbsp; 
              <b>Turma:</b> _ &nbsp;&nbsp; 
              <b>Nº:</b> _
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

      <!-- Botões de controlo -->
      <div class="mb-4 mt-5 col-8 mx-auto">
        <button class="btn btn-primary me-2" @click="imprimirPDF"><i class="fas fa-print"></i> Imprimir</button>
        <button class="btn btn-warning me-2" @click="editarAluno"><i class="fas fa-user"></i> Atualizar dados do Aluno</button>
        <!-- <button class="btn btn-info me-2" @click="visibleColumnNpp = !visibleColumnNpp">Ativar/Desativar NPP</button>
        <button class="btn btn-info me-2" @click="visibleColumnExame = !visibleColumnExame">Ativar/Desativar Exame</button>
        <button class="btn btn-info me-2" @click="visibleColumnRecurso = !visibleColumnRecurso">Ativar/Desativar Recurso</button> -->
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
      observacao: '',
      bg_observacao: ''
    };
  },
  async created() {
    await this.loadTermo();
  },
  computed: {
    observacao() {
      // percorre todas as disciplinas e decide se o aluno transita
      if (!this.rows.length) return "-";

      let todasDisciplinasTransitam = true;

      this.rows.forEach(r => {
        let final = r.mfd;

        if (r.exame !== null) {
          final = (Number(r.mfd) + Number(r.exame)) / 2;
        }
        if (r.recurso !== null) {
          const base = (r.mfd !== null && r.exame !== null)
            ? (Number(r.mfd) + Number(r.exame)) / 2
            : r.mfd;
          final = (Number(base) + Number(r.recurso)) / 2;
        }

        if (final < 10) {
          todasDisciplinasTransitam = false;
        }
      });

      this.bg_observacao = todasDisciplinasTransitam ? "text-primary" : "text-danger";
      
      return todasDisciplinasTransitam ? "Transita" : "Não transita";
    }
  },
  methods: {
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
        if (!termo || !Array.isArray(termo.notas)) return;
        this.termo = termo;

        const rowsByDisc = {};
        termo.notas.forEach((n) => {
          if (!n || !n.disciplina_id) return;
          const did = n.disciplina_id;
          if (!rowsByDisc[did]) {
            rowsByDisc[did] = {
              uid: Date.now() + Math.random(),
              disciplina: n.disciplina,
              mac1: null, npp1: null, npt1: null, mt1: null,
              mac2: null, npp2: null, npt2: null, mt2: null,
              mac3: null, npp3: null, npt3: null, mt3: null,
              mfd: null, exame: null, recurso: null, mf: null,
            };
          }
          const target = rowsByDisc[did];
          const t = n.trimestre;
          const val = parseFloat(n.valor);

          if (n.tipo_nota === "mac") target[`mac${t}`] = val;
          if (n.tipo_nota === "npp") target[`npp${t}`] = val;
          if (n.tipo_nota === "npt") target[`npt${t}`] = val;
          if (n.tipo_nota === "mt") target[`mt${t}`] = val;
          if (n.tipo_nota === "mfd") target.mfd = val;
          if (n.tipo_nota === "exame") target.exame = val;
          if (n.tipo_nota === "recurso") target.recurso = val;
        });

        // calcula MF (média entre MFD e Exame, se existir)
        Object.values(rowsByDisc).forEach(r => {
          if (r.mfd !== null && r.exame !== null) {
            r.mf = ((r.mfd + r.exame) / 2).toFixed(1);
          }
        });

        this.rows = Object.values(rowsByDisc);
      } catch (err) {
        console.error("Erro no loadTermo:", err);
      }
    },
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
