<template>
    <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <br><br><br><br>
  <br><br><br><br>

  <div class="mb-3 px-3">
    
    <button class="btn btn-outline-secondary me-2" @click="$router.back()">
      Voltar
    </button> 

    <button class="btn btn-outline-danger" @click="gerarPDF">
      <i class="fas fa-file-pdf me-2"></i> Salvar Pdf
    </button>
  </div>

  <div class="px-3">
    <div
      v-for="(aluno, idx) in alunos"
      :key="idx"
      class="animate-fadeInUp mb-5"
    >
      <!-- Cabeçalho fixo -->
      <header class="header-name">
        <p class="mb-1 text-custom">{{ cabecalho.instituicao }}</p>
        <p class="mb-1 text-custom">{{ cabecalho.boletim }}</p>
      </header>

      <!-- Nome do aluno -->
      <p class="mb-0 text-custom">
        <strong>Nº:</strong> {{ aluno.numero }} — {{ aluno.nome }}
      </p>

      <!-- Tabela -->
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>-</th>
              <th v-for="(disc, dIdx) in disciplinas" :key="dIdx">
                {{ disc }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(linha, lIdx) in aluno.notas" :key="lIdx">
              <td class="subject-name">{{ linha.materia }}</td>
              <td v-for="(valor, vIdx) in linha.valores" :key="vIdx">
                {{ valor }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Assinatura -->
      <div class="text-center mt-2">
        <p
          class="mx-auto mb-1"
          style="width: 250px; border-bottom: 1px solid #222; padding-bottom: 18px;"
        >
          {{ assinatura.titulo }}
        </p>
        <p>{{ assinatura.nome }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as api from  "../../api/api.js"

export default {
  components: { navbar, sidebar },

  data() {
    return {
      cabecalho: { instituicao: '', boletim: '' },

      // serão substituídas pelos dados do backend (após transformação)
      disciplinas: [],   // colunas da tabela (ex: ["MATEMÁTICA","GEOGRAFIA"])
      tipos: [],         // sequência dos tipos (ex: ["MAC","NPP","NPT","MT"])
      alunos: [],        // será transformado para o formato esperado pelo front
      assinatura: { titulo: "O DIRETOR(A) DA TURMA", nome: "" },

      apiUrl: 'ver-boletins',
      turmaId: 24,
      trimestre: 'primeiro',
    };
  },

  async mounted() {
    await this.loadBoletim();
  },

  methods: {
    // --- transforma e popula o front com os dados vindos do backend ---
    async loadBoletim() {
      try {
        const turmaId = this.$route.params.id;
        const trimestre = this.$route.params.trimestre;
        const alunosId = this.$route.params.alunos_id; // "12,13,14" ou undefined

        const json = await api.listar(
          `ver-boletins/${turmaId}/${trimestre}?alunos_id=${alunosId || ''}`
        );

        // popula cabeçalho e assinatura
        this.cabecalho = json.cabecalho || this.cabecalho;
        this.assinatura = json.assinatura || this.assinatura;

        // disciplinas (colunas)
        this.disciplinas = (json.disciplinas || []).map(d => String(d));

        // tipos (ordem dos tipos) - já vem do backend (ex: ["MAC","NPT","MT"])
        this.tipos = (json.tipos || []).map(t => String(t).toUpperCase());

        const inferredCount = this.tipos.length || (json.alunos?.[0]?.notas?.[0]?.valores?.length || 0);
        const tiposSequence = this.tipos.length
          ? this.tipos
          : Array.from({ length: inferredCount }, (_, i) => `TIP${i+1}`);

        // reorganiza as notas: queremos linhas por TIPO e colunas por DISCIPLINA
        this.alunos = (json.alunos || []).map(aluno => {
          // cada linha corresponde a um tipo (ex: MAC, NPT, MT)
          const rows = tiposSequence.map(t => ({ materia: t, valores: [] }));

          // Para cada disciplina, localiza os dados no objeto do aluno retornado pelo backend
          for (let d = 0; d < this.disciplinas.length; d++) {
            const discName = this.disciplinas[d];

            // No backend cada entrada em aluno.notas é por disciplina:
            // { materia: "MATEMÁTICA", valores: [...], mt: 10.5 }
            const notaDaDisc = (aluno.notas || []).find(n => {
              return String(n.materia || '').trim().toUpperCase() === String(discName).trim().toUpperCase();
            });

            const valoresDisc = Array.isArray(notaDaDisc?.valores) ? notaDaDisc.valores : [];

            // mt pode ser number ou string ou "—"
            const mtValor = (notaDaDisc && (notaDaDisc.mt !== undefined && notaDaDisc.mt !== null))
              ? notaDaDisc.mt
              : '—';

            for (let i = 0; i < tiposSequence.length; i++) {
              const tipoNome = String(tiposSequence[i] || '').trim().toUpperCase();

              let v = '—';

              // Se o tipo for MT (case-insensitive), pegamos o campo mt da disciplina
              if (tipoNome === 'MT') {
                v = (mtValor === null || mtValor === undefined) ? '—' : String(mtValor);
              } else {
                // senão, obtemos a nota correspondente na posição i (se existir)
                v = (i < valoresDisc.length && valoresDisc[i] !== undefined && valoresDisc[i] !== null)
                      ? valoresDisc[i]
                      : '—';
              }

              rows[i].valores.push(v);
            }
          }

          return {
            numero: aluno.numero,
            nome: aluno.nome,
            notas: rows
          };
        });

      } catch (err) {
        console.error('Erro ao carregar boletim:', err);
      }
    },

    gerarPDF() {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 8;
      const usableW = pageW - margin * 2;
      const usableH = pageH - margin * 2;
      const thirdH = usableH / 3; // 3 boletins por página
      const head = [['-', ...this.disciplinas]];

      this.alunos.forEach((aluno, idx) => {
        // nova página a cada 3 boletins
        if (idx % 3 === 0) {
          if (idx !== 0) doc.addPage();
        }

        const topBase = margin + (idx % 3) * thirdH;
        let y = topBase;

        // Cabeçalho reduzido
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(this.cabecalho.instituicao, pageW / 2, y, { align: 'center' });
        y += 4;
        doc.text(this.cabecalho.boletim, pageW / 2, y, { align: 'center' });
        y += 5;

        // Nome do aluno
        doc.setFontSize(8);
        doc.text(`Nº: ${aluno.numero} — ${aluno.nome}`, margin, y);
        y += 2;

        // Tabela com linhas striped e borda na header
        const body = aluno.notas.map(n => [n.materia, ...n.valores]);

        autoTable(doc, {
          startY: y + 1,
          head,
          body,
          theme: 'grid',
          styles: {
            fontSize: 7,         // texto reduzido
            cellPadding: 0.8,
            halign: 'center',
            valign: 'middle',
            lineColor: [0, 0, 0],
            lineWidth: 0.15,
          },
          headStyles: {
            fillColor: false,    // sem fundo
            textColor: 0,
            fontStyle: 'normal',
            lineColor: [0, 0, 0], // borda da header
            lineWidth: 0.3
          },
          columnStyles: { 0: { cellWidth: 22, halign: 'left', fontStyle: 'bold' } },
          tableWidth: usableW,
          margin: { left: margin, right: margin },
          alternateRowStyles: { fillColor: [245, 245, 245] }, // striped
          pageBreak: 'avoid',
        });

        // posição da linha tracejada (um pouco mais acima do fim do bloco)
        const dashedY = topBase + thirdH - 12; // "um pouquinho mais acima"
        doc.setLineDash([1, 1], 0);
        doc.setDrawColor(0);
        doc.setLineWidth(0.4);
        doc.line(margin, dashedY, pageW - margin, dashedY);
        doc.setLineDash(); // reset

        // Assinatura colocada POR CIMA da linha tracejada (cada boletim tem sua assinatura)
        const lineW = 60;
        // posiciona a assinatura acima da linha tracejada
        const assinaturaBaseY = dashedY - 10; // ajuste: quanto maior o número, mais acima
        doc.setFontSize(7);
        doc.text(this.assinatura.titulo, pageW / 2, assinaturaBaseY, { align: 'center' });
        doc.line((pageW - lineW) / 2, assinaturaBaseY + 4, (pageW + lineW) / 2, assinaturaBaseY + 4);
        doc.text(this.assinatura.nome, pageW / 2, assinaturaBaseY + 8, { align: 'center' });

        // Coloca "proacademico" discretamente à direita abaixo da tabela
        const afterTableY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || (y + 15);
        doc.setFontSize(6);
        doc.setTextColor(120); // cinza discreto
        doc.text("proacademico", pageW - margin - 2, afterTableY + 4, { align: 'right' });
        doc.setTextColor(0); // reset cor
      });

      doc.save('boletins.pdf');
    },
  },
};
</script>

<style scoped>
header {
    text-align: center;
    margin-bottom: 5px;
    padding-bottom: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    min-width: 900px;
}

th, td {
    padding: 2px 3px;
    text-align: center;
    border: 1px solid #ddd;

    /* 👇 Adicionado para enquadrar textos longos */
    white-space: normal;     /* permite quebra de linha */
    word-break: break-word;  /* força quebra em palavras grandes */
    max-width: 120px;        /* limita largura de cada célula */
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}

tr:hover {
    background-color: #f1f1f1;
}

.subject-name {
    font-weight: 600;
    background-color: #e6f7ff;
}

.login-info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 15px;
}

.login-info div {
    margin: 5px 0;
}

@media (max-width: 768px) {
    th, td {
        padding: 2px 0px;
        font-size: 11px;
        max-width: 90px;       /* ajusta para telas menores */
    }

    .login-info {
        flex-direction: column;
    }
}

.text-custom {
  font-size: 11px;
}
</style>
