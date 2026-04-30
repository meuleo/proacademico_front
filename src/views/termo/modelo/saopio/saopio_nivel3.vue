<template>
  <div>
    <navbar />
    <sidebar />

    <div class="main-content p-4">
      <!-- Botões de controlo -->
      <div class="mb-4 mt-5 col-8 mx-auto">
        <button class="btn btn-danger me-2" @click="imprimirPDF"><i class="fas fa-file-pdf"></i> Guardar PDF</button>
        <button class="btn btn-warning me-2" @click="editarAluno"><i class="fas fa-user"></i> Atualizar dados do Aluno</button>
        <!-- button class="btn btn-secondary me-2" @click="termosAgrupado"><i class="fas fa-arrow-right"></i> Termos agrupado</button -->
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
            <h4 class="text-9">Gabinete Provincial da Educação da Huíla</h4>
            <h4 class="text-9">COMPLEXO ESCOLAR PÚBLICO - PRIVADO " SÃO PIO DA PIETRELCINA"</h4>
            <h4 class="text-9">LUBANGO - MAPUNDA</h4>
          </div>

          <!-- Dados do aluno -->
          <div class="mb-1 row" style="text-align: justify;">
            <div class="col-9">
              <p class="text-9 mb-1"><b>Nome:</b> <span class="text-red-600 text-danger text-12"><b>{{ termo?.aluno?.nome_completo ?? "-" }}</b></span> &nbsp;&nbsp; Processo nº &nbsp;&nbsp;&nbsp; Filho (a) de: {{ termo?.aluno?.pai ?? "-" }} &nbsp;&nbsp; e de: {{ termo?.aluno?.mae ?? "-" }},  Nascido(a) aos {{ dia }} &nbsp;&nbsp;  de {{ nomeMes }} &nbsp;&nbsp; de {{ ano }} &nbsp;&nbsp; Natural de {{ termo?.aluno?.naturalidade ?? "-" }} &nbsp;&nbsp; Município {{ termo?.aluno?.municipio ?? "-" }} &nbsp;&nbsp; Província {{ termo?.aluno?.provincia ?? "-" }}, &nbsp;&nbsp;  Encarregado de Educação: &nbsp;&nbsp; Morada: {{ termo?.aluno?.bairro ?? "-" }} &nbsp;&nbsp; Telemovel: &nbsp;&nbsp;
              </p>
              <div style="position: relative; bottom: -50px; left: 50px; font-weight: 700;" class="text-center">
                  <div class="p-0 m-0">
                    Termo de Frequência e Aproveitamento
                  </div>
                  <div style="text-transform: uppercase;">
                    Curso de {{ termo?.aluno?.matricula?.turma?.curso?.nome ?? "-" }}
                  </div>
              </div>
            </div>
            <div class="col-3 d-flex justify-content-end p-0">
              <div style="width: 150px; height: 160px; border: 1px solid #000;">
                <!-- img src="" -->
              </div>
            </div>
          </div>

          <!-- Tabela -->
          <div class="row pt-0 mt-0">
            <div class="col-80 p-0">
            <!-- Tabela principal -->
      <!-- Tabela principal -->
      <table class="sheet w-full border-collapse">
        <thead>
          <tr>
            <td colspan="15" style="text-align: left;">
              <div>Ano Lectivo: {{ termo?.aluno?.matricula?.ano_letivo ?? "-" }}</div>
              <div class="d-flex justify-content-between">
                <div>{{termo.classe || ''}}ª Classe</div>
                <div>Turma: {{termo?.aluno?.matricula?.turma?.serie || ''}}</div>
                <div>Nº: {{termo?.aluno?.matricula?.num_aluno || ''}} </div>
                <div>Periodo: {{termo?.aluno?.matricula?.turma?.turno || ''}}</div>
                <div>Sala nº: {{termo?.aluno?.matricula?.turma?.sala || ''}}</div>
                <div>Língua de Opção:</div>
              </div>
            </td>
          </tr>
          <tr>
            <th rowspan="2" style="min-width:30px;"></th>
            <th rowspan="2" class="disciplina">Disciplinas</th>

            <th colspan="2">Iº Trimestre</th>
            <th colspan="2">IIº Trimestre</th>
            <th colspan="2">IIIº Trimestre</th>

            <th rowspan="2">MFD</th>
            <th rowspan="2">MEC</th>
            <th rowspan="2">MF</th>

            <th v-if="visibleColumnExame || visibleColumnRecurso || 1" colspan="4">Exames/Recurso</th>
          </tr>

          <tr>
            <th>MT</th><th>Fal</th>
            <th>MT</th><th>Fal</th>
            <th>MT</th><th>Fal</th>

            <th v-if="visibleColumnExame || visibleColumnRecurso || 1">Nota</th>
            <th v-if="visibleColumnExame || visibleColumnRecurso || 1">E.p</th>
            <th v-if="visibleColumnExame || visibleColumnRecurso || 1">Ano</th>
            <th v-if="visibleColumnExame || visibleColumnRecurso || 1">Ass. Coord. Curso</th>
          </tr>
        </thead>

        <tbody>
          <!-- renderiza dinamicamente cada categoria existente -->
          <template v-for="(group, key) in disciplinasPorCategoria" :key="key">
            <tr v-for="(row, idx) in group" :key="row.uid">
              <!-- Categoria (aparece só na primeira linha do grupo) -->
              <td
                v-if="idx === 0"
                class="categoria font-bold text-sm px-2"
                :rowspan="group.length"
                style="vertical-align:middle; text-align:center; width:48px;"
              >
                <div v-html="categoriaLabel(key)"></div>
              </td>

              <td class="disciplina px-2">{{ row.disciplina?.nome ?? '---' }}</td>

              <!-- I Trimestre -->
              <td class="text-center" :class="getNotaClass(row.mt1)">{{ formatNota(row.mt1) }}</td>
              <td class="text-center">{{ formatFaltas(row.faltas1) }}</td>

              <!-- II Trimestre -->
              <td class="text-center" :class="getNotaClass(row.mt2)">{{ formatNota(row.mt2) }}</td>
              <td class="text-center">{{ formatFaltas(row.faltas2) }}</td>

              <!-- III Trimestre -->
              <td class="text-center" :class="getNotaClass(row.mt3)">{{ formatNota(row.mt3) }}</td>
              <td class="text-center">{{ formatFaltas(row.faltas3) }}</td>

              <!-- Finais -->
              <td class="text-center font-bold" :class="getNotaClass(row.mfd)">{{ formatNota(row.mfd) }}</td>
              <td class="text-center" :class="getNotaClass(row.mec)">{{ formatNota(row.mec) }}</td>
              <td class="text-center font-bold" :class="getNotaClass(row.mf)">{{ formatNota(row.mf) }}</td>

              <!-- Exame / Recurso -->
              <td v-if="visibleColumnExame || visibleColumnRecurso || 1" class="text-center" :class="getNotaClass(row.recurso ?? row.exame)">
                {{ formatNota(row.recurso ?? row.exame) }}
              </td>
              <td v-if="visibleColumnExame || visibleColumnRecurso || 1" class="text-center" :class="getNotaClass(row.ep)">
                {{ formatNota(row.ep) }}
              </td>
              <td v-if="visibleColumnExame || visibleColumnRecurso || 1" class="text-center">
                <!-- span>{{ termo?.ano_letivo ?? '-' }}</span -->
              </td>
              <td v-if="visibleColumnExame || visibleColumnRecurso || 1" class="text-center">
                {{ row.assinatura ?? '' }}
              </td>
            </tr>
          </template>

          <!-- Rodapé / campos extra -->
          <tr>
            <td colspan="3" style="text-align:left; padding-left:8px;">Comportamento</td>
            <td colspan="12" style="text-align:center;">Média Final da Classe <span :class="getNotaClass(summary?.mediaAtual)">( {{ summary?.mediaAtual !== null ? summary.mediaAtual.toFixed(1) : 'VALORES' }} )</span></td>
          </tr>

          <tr>
            <td colspan="3" style="text-align:left; padding-left:8px;">Situação Final do Aluno</td>
            <td colspan="12" style="text-align:center;">
              <span :class="getNotaClass(summary?.mediaAtual)">{{ summary?.observacao ?? '' }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:left; padding-left:8px;">O (A) Coordenador (a) de Turma</td>
            <td colspan="12" style="text-align:left;"></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:left; padding-left:8px;">O (A) Coordenador (a) do Curso</td>
            <td colspan="12" style="text-align:left;"></td>
          </tr>

          <!-- tr>
            <td colspan="3" style="text-align:left; padding-left:8px;">Média Final da Classe</td>
            <td colspan="12" style="text-align:left;">( {{ summary?.mediaAtual !== null ? summary.mediaAtual.toFixed(1) : 'VALORES' }} )</td>
          </tr -->
        </tbody>
      </table>

            </div>
           
      <div class="py-3 text-center">
        Lubango aos {{hoje.dia}} de {{nomeDoMes(hoje.mes)}} de {{hoje.ano}}
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
      visibleColumnExame: false,
      visibleColumnRecurso: false,
      bg_observacao: '',
      summary: null,
      dia: '',
      mes: '',
      ano: '',
      nomeMes: '',
      hoje: ''
    };
  },
  async created() {
    await this.loadTermo();
    this.hoje = this.dataAtual()
  },
  computed: {
    // mapa de categorias ordenado para render
    disciplinasPorCategoria() {
      // cria buckets
      const buckets = { geral: [], especifica: [], opcao: [], outro: [] };

      (this.rows || []).forEach(r => {
        const dominaRaw = (r.disciplina?.domineo || r.disciplina?.domínio || r.disciplina?.domineo || '').trim();
        const key = this.normalizeCategoria(dominaRaw);
        if (!buckets[key]) buckets[key] = [];
        buckets[key].push(r);
      });

      // ordenar alfabeticamente cada grupo
      Object.keys(buckets).forEach(k => {
        buckets[k].sort((a,b) => (a.disciplina?.nome ?? '').localeCompare(b.disciplina?.nome ?? ''));
      });

      // só retorna grupos que tenham elementos, na ordem desejada
      const ordered = {};
      if (buckets.geral.length) ordered.geral = buckets.geral;
      if (buckets.especifica.length) ordered.especifica = buckets.especifica;
      if (buckets.opcao.length) ordered.opcao = buckets.opcao;
      if (buckets.outro.length) ordered.outro = buckets.outro;
      return ordered;
    }
  },
  methods: {
    termosAgrupado() {
      this.$router.push(`/termos/${this.$route.params.alunoId}/agrupado`)
    },

    editarAluno() {
      this.$router.push('/alunos/edit/' + this.$route.params.alunoId)
    },

    // Normaliza várias formas textuais para as 4 categorias
    normalizeCategoria(domineoRaw) {
      const txt = String(domineoRaw || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      if (txt.includes('geral')) return 'geral';
      if (txt.includes('especific')) return 'especifica';
      if (txt.includes('opcao') || txt.includes('opç') || txt.includes('op')) return 'opcao';
      if (txt.length === 0) return 'outro';
      return 'outro';
    },

    categoriaLabel(key) {
      if (key === 'geral') return 'Formação<br>Geral';
      if (key === 'especifica') return 'Formação<br>Específica';
      if (key === 'opcao') return 'Opção';
      return 'Outro';
    },

    // cores: vermelho (<10), azul (>=10), neutro para ausente/não-numérico
    getNotaClass(valor) {
      if (valor === null || valor === undefined) return 'text-dark';
      const num = Number(valor);
      if (Number.isNaN(num)) return 'text-dark';
      if (num >= 10) return 'text-primary font-bold';
      return 'text-danger font-bold';
    },

    //Traços
    formatNota(v) {
      if (v === null || v === undefined) return '';
      const n = Number(v);
      if (Number.isNaN(n)) return '';
      return n.toFixed(1);
    },

    formatFaltas(v) {
      if (v === null || v === undefined) return '';
      return String(v);
    },

    imprimirPDF() {
      const elemento = document.getElementById("conteudo-pdf")

      const opcoes = {
        margin: [5, 5, 5, 5],
        filename: "Termo_" + this.termo?.aluno?.nome_completo + "_" + this.termo?.classe + "ª Classe" + ".pdf",

        // Evita perda de qualidade
        image: {
          type: "png",      // PNG mantém texto mais nítido que JPEG
          quality: 1
        },

        html2canvas: {
          scale: 4,                 // escala maior = mais nitidez
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape",
          compress: false           // evita compressão interna
        }
      }

      html2pdf()
        .set(opcoes)
        .from(elemento)
        .save()
    },

    // carregamento e transformação dos dados
    async loadTermo() {
      this.termoId = this.$route.params.termo_id;
      try {
        const res = await api.listar(`/termos/aluno/show/${this.termoId}`);
        const termo = res?.data?.termo || res?.termo || res?.data || res;

        if (!termo || !Array.isArray(termo.notas)) {
          this.rows = [];
          this.summary = null;
          this.termo = termo || null;
          return;
        }

        this.termo = termo;
        this.separarData(termo?.aluno?.data_nascimento);

        const rowsByDisc = {};
        let anyExame = false, anyRecurso = false;

        termo.notas.forEach((n) => {
          if (!n) return;
          const did = n.disciplina_id ?? n.disciplina?.id;
          if (!did) return;
          if (!rowsByDisc[did]) {
            rowsByDisc[did] = {
              uid: `${did}-${Math.random().toString(36).slice(2,8)}`,
              disciplina: n.disciplina || { id: did, nome: '---', domineo: 'Outro' },
              mac1:null, npp1:null, npt1:null, mt1:null, faltas1:null,
              mac2:null, npp2:null, npt2:null, mt2:null, faltas2:null,
              mac3:null, npp3:null, npt3:null, mt3:null, faltas3:null,
              mfd:null, exame:null, recurso:null, mf:null,
              mec:null, ep:null, assinatura:null,
              finalBase:null, finalComExame:null, finalComRecurso:null, transita:null
            };
          }

          const r = rowsByDisc[did];
          const tipo = (n.tipo_nota || '').toLowerCase();
          const tri = (n.trimestre === null || n.trimestre === undefined || n.trimestre === '') ? null : Number(n.trimestre);
          const valRaw = (n.valor === null || n.valor === '' || n.valor === undefined) ? null : n.valor;
          const val = (valRaw === null) ? null : Number(valRaw);

          if (tri === 1 || tri === 2 || tri === 3) {
            if (tipo === "mac") r[`mac${tri}`] = val;
            else if (tipo === "npp") r[`npp${tri}`] = val;
            else if (tipo === "npt") r[`npt${tri}`] = val;
            else if (tipo === "mt") r[`mt${tri}`] = val;
            else if (tipo.includes('fal') || tipo.includes('falta')) {
              r[`faltas${tri}`] = (valRaw === null) ? null : valRaw;
            }
          } else {
            // sem trimestre
            if (tipo === "mfd" || tipo === "mfe") r.mfd = val;
            else if (tipo === "exame") { r.exame = val; anyExame = true; }
            else if (tipo === "recurso") { r.recurso = val; anyRecurso = true; }
            else if (tipo === "mec") r.mec = val;
            else if (tipo === "ep" || tipo === "e.p") r.ep = val;
            else if (tipo.includes('ass') || tipo.includes('assin')) r.assinatura = n.valor ?? r.assinatura;
            else if (tipo.includes('fal') || tipo.includes('falta')) {
              // fallback: coloca em faltas1 se nenhum tri
              if (!r.faltas1 && !r.faltas2 && !r.faltas3) r.faltas1 = (valRaw === null) ? null : valRaw;
            }
          }
        });

        // calcular MEC (se não houver valor explícito, usar média dos MTs existentes)
        Object.values(rowsByDisc).forEach(r => {
          const mts = [r.mt1, r.mt2, r.mt3].filter(v => v !== null && v !== undefined && !Number.isNaN(Number(v))).map(Number);
          if (r.mec === null || r.mec === undefined) {
            if (mts.length) {
              const s = mts.reduce((a,b)=>a+b,0);
              r.mec = Math.round((s/mts.length)*10)/10;
            } else {
              r.mec = null;
            }
          } else {
            r.mec = (r.mec === null) ? null : Number(r.mec);
          }
        });

        // cálculo final por disciplina (regra flexível: base = mfd ?? mec ?? null)
        Object.values(rowsByDisc).forEach(r => {
          r.finalBase = (r.mfd !== null && r.mfd !== undefined) ? Number(r.mfd) : ((r.mec !== null && r.mec !== undefined) ? Number(r.mec) : null);

          if (r.exame !== null && r.exame !== undefined) {
            const baseForExam = (r.finalBase !== null) ? r.finalBase : 0;
            r.finalComExame = Math.round(((baseForExam + Number(r.exame)) / 2) * 10) / 10;
          } else {
            r.finalComExame = null;
          }

          if (r.recurso !== null && r.recurso !== undefined) {
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

        const rows = Object.values(rowsByDisc)
          .sort((a,b) => (a.disciplina?.nome ?? '').localeCompare(b.disciplina?.nome ?? ''));

        // resumo / médias
        const _avg = arr => {
          if (!arr || arr.length === 0) return null;
          const nums = arr.map(Number).filter(x => !Number.isNaN(x));
          if (!nums.length) return null;
          const s = nums.reduce((a,b)=>a+b,0);
          return Math.round((s/nums.length)*10)/10;
        };

        const mfdVals = rows.map(r=>r.mfd).filter(v=>v!==null && v!==undefined);
        const exameVals = rows.map(r=>r.exame).filter(v=>v!==null && v!==undefined);
        const recursoVals = rows.map(r=>r.recurso).filter(v=>v!==null && v!==undefined);

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
        parts.push(transita ? "Transita" : "Não transita");

        this.summary = {
          mediaMFD, mediaExame, mediaRecurso,
          mediaComExame, mediaComRecurso,
          mediaAtual, transita,
          observacao: parts.join(" | "),
          obsClass: transita ? "text-primary" : "text-danger",
          disciplinasContadas: rows.length
        };

        // definir flags de colunas exame/recurso
        this.visibleColumnExame = rows.some(r => r.exame !== null && r.exame !== undefined);
        this.visibleColumnRecurso = rows.some(r => r.recurso !== null && r.recurso !== undefined);

        this.rows = rows;
      } catch (err) {
        console.error("Erro no loadTermo:", err);
        this.rows = [];
        this.summary = null;
      }
    },

    separarData(data) {
      if (!data) return;
      const parts = String(data).split('-');
      if (parts.length >= 3) {
        [this.ano, this.mes, this.dia] = parts;
      } else {
        this.ano = data;
      }
      this.nomeMes = this.nomeDoMes(this.mes);
    },

    nomeDoMes(numeroMes) {
      const meses = [
        'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
        'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
      ];
      const index = parseInt(numeroMes, 10) - 1;
      return meses[index] || '';
    },

    dataAtual() {
      const hoje = new Date()

      const meses = [
        'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
        'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
      ]

      return {
        dia: String(hoje.getDate()).padStart(2, '0'),
        mes: String(hoje.getMonth() + 1).padStart(2, '0'),
        nomeMes: meses[hoje.getMonth()],
        ano: hoje.getFullYear()
      }
    }
  },
};
</script>

<style scoped>
table th,
table td {
  text-align: center;
  margin: 0 !important;
  padding: 0 3px !important;
  font-size: 10pt !important;
  border: 1px solid #000 !important;

}
table {
  width: 100%;
  border-collapse:collapse !important;
}
h1,h2,h3,h4,h5 {
  font-size: 16px;
}

.text-9 { font-size: 9pt !important;}
.text-10 { font-size: 10pt !important;}
.text-11 { font-size: 11pt !important;}
.text-12 { font-size: 12pt !important;}
.text-14 { font-size: 14pt !important;}

.sheet {
    width: 100%;
    border-collapse: collapse;
  }
  .sheet th, .sheet td {
    border: var(--border);
    padding: 6px;
    vertical-align: middle;
    text-align: center;
    background: #fff;
  }

  /* Cabeçalhos com várias linhas */
  .sheet thead th {
    background: #f6f6f6;
    font-weight: 700;
  }

  /* Coluna de disciplinas (nome) */
  .disciplina {
    text-align: left;
    /*padding-left: 8px;*/
    width: 180px;
    font-weight: 600;
  }

  /* Cabeçalho vertical da esquerda */
  .categoria {
    width: 28px;
    padding: 0;
  }
  .categoria > div {
    writing-mode: vertical-rl;       /* texto vertical */
    transform: rotate(180deg);      /* inverter para ficar como na imagem */
    text-align: center;
    font-weight: 700;
    padding: 6px 2px;
  }

  /* células vazias com altura maior para preencher como planilha */
  .cell-empty {
    height: 28px;
  }

  /* Linhas finas horizontais (visual de caderno / Excel) */
  .no-top-border th {
    border-top: none;
  }

  /* Nota: ajustar tamanho quando imprimir */
  @media print{
    body { padding: 4mm; }
    .sheet th, .sheet td { font-size: 11px; }
  }
</style> 
