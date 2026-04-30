<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid col-9 mx-auto">
       <div v-show="loader" class="text-center p-4">
          Carregando certificado...
        </div>

        <div v-show="!loader && certificado.ano_lectivo == ''" class="text-center p-4">
          Nenhum certificado encontrado 
        </div>

      <div class="certificate-wrapper" v-show="!loader && certificado.ano_lectivo != ''">
        <div class="header-actions d-flex justify-content-between align-items-center mb-4">
          <button class="btn btn-primary" @click="imprimirPDF">
            <i class="fas fa-print me-2"></i>Imprimir
          </button>
        </div>

        <div class="card p-4">
          <div class="certificate-content" id="conteudo-pdf">
            <div class="certificate-head text-center">
              <img src="/assets/images/insigbnia.PNG" alt="" width="60">
              <p class="institution-line">
                República de Angola <br> 
                Ministério da Educação <br>
                I CICLO DO ENSINO SECUNDÁRIO
              </p>
              <h5 class="mb-3 mt-3" style="font-weight: bold;">CERTIFICADO</h5>
            </div>

            <div class="certificate-body">
              <p class="intro">
                <span class="indent">{{ toUpper(certificado.director) }}</span>,
                Director do {{ certificado.colegio }}, criado sob Decreto Executivo nº 558/15,
                certifica que <span class="aluno-nome">{{ toUpper(certificado.aluno.nome) }}</span>, filho de
                {{ certificado.aluno.pai }} e de {{ certificado.aluno.mae }}, nascido aos
                {{ certificado.aluno.nascimento }}, natural de {{ certificado.aluno.naturalidade }},
                Município de {{ certificado.aluno.municipio }}, Província do(a) {{ certificado.aluno.provincia }},
                portador do B.I {{ certificado.aluno.bi }}, concluiu no ano lectivo {{ certificado.ano_lectivo }}
                o I CICLO DO ENSINO SECUNDÁRIO GERAL, com a Média Final de
                {{ certificado.media_final }} valores obtida nas seguintes classificações:
              </p>
            </div>

            <!-- wrapper responsivo da tabela evita overflow -->
            <div class="table-responsive">
              <table class="certificate-table" style=" border-collapse: separate !important;">
  <colgroup>
    <col style="width:18%"> <!-- disciplinas -->
    <col style="width:18%"> <!-- 7ª -->
    <col style="width:18%"> <!-- 8ª -->
    <col style="width:18%"> <!-- 9ª -->
    <col style="width:18%"> <!-- média final -->
    <col style="width:30% !important;"> <!-- média extenso -->
  </colgroup>

  <thead>
    <tr>
      <th style="text-align:left; padding-left:8px;">DISCIPLINAS</th>
      <th>7ª CLASSE</th>
      <th>8ª CLASSE</th>
      <th>9ª CLASSE</th>
      <th>MÉDIA FINAL</th>
      <th>MÉDIA POR EXTENSO</th>
    </tr>
  </thead>

  <tbody>
    <tr v-for="(disc, i) in certificado.disciplinas" :key="i">
      <td style="text-align:left; padding-left:8px; overflow-wrap: break-word; word-break: break-word;">
        {{ disc.nome }}
      </td>
      <td :class="{'nota-vermelha': parseInt(disc.classe7) < 10}">{{ disc.classe7 }}</td>
      <td :class="{'nota-vermelha': parseInt(disc.classe8) < 10}">{{ disc.classe8 }}</td>
      <td :class="{'nota-vermelha': parseInt(disc.classe9) < 10}">{{ disc.classe9 }}</td>
      <td>{{ disc.media }}</td>
      <td class="extenso">{{ disc.extenso }}</td>
    </tr>
  </tbody>
</table>

            </div>

            <div class="rodape">
              <p>a) Sem elementos de classificação.</p>
              <p class="mt-2">
                Para efeitos legais, lhe é passado o presente CERTIFICADO, que consta no Livro de Registo nº *** folha***,
                assinado e autenticado com carimbo a óleo em uso neste Estabelecimento de Ensino.
              </p>
            </div>

            <div class="assinatura py-2">
              <p>{{ certificado.colegio }} em Lubango, aos {{ certificado.data_emissao }}.</p>
            </div>

            <div class="row">
              <div class="col-6">
                <p class="assinatura-box text-center pb-3" style="border-bottom: 1px solid #000; width: 200px;">
                  Conferido por
                </p>
              </div>
              <div class="col-6">
                <div class="assinatura-diretor text-center d-flex justify-content-end">
                  <div>
                    <p class="assinatura-box mx-auto pb-3" style="border-bottom: 1px solid #000; width: 200px;">
                      O Director
                    </p>
                    <p class="diretor-nome">{{ certificado.director }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div> <!-- .certificate-content -->
        </div>
        
      </div> <!-- .certificate-wrapper -->
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import * as api from "@/api/api.js";
import html2pdf from "html2pdf.js";

export default {
  components: { navbar, sidebar },
  data() {
    return {
      // Variáveis dinâmicas que pediste
      alunoId: '',           // podes alterar dinamicamente antes de chamar carregarCertificado
      classes: [],    // podes alterar dinamicamente antes de chamar carregarCertificado

      // Mantive o teu objeto inicial exatamente como fornecido
      certificado: {
        director: "",
        colegio: '',
        aluno: {
          nome: "",
          pai: "",
          mae: "",
          nascimento: "",
          naturalidade: "",
          municipio: "",
          provincia: "",
          bi: "Nº021452275HA055, passado pela Direcção Nacional de Identificação, aos 01/02/2021",
        },
        ano_lectivo: "",
        media_final: '',
        data_emissao: "08 de Janeiro de 2024",
        disciplinas: [],
      },
      loader: false
    };
  },

  methods: {
    toUpper(value) {
      if (value === null || value === undefined) return '';
      return String(value).toLocaleUpperCase('pt-AO');
    },

    async carregarCertificado() {

      if(this.$route.params.nivel == 1) {
        this.classes = [2,4,6]
      
      } else if (this.$route.params.nivel == 2) {
        this.classes = [7,8,9]
      
      } else if (this.$route.params.nivel == 3) {
        this.classes = [10,11,12]
      
      } else {
        this.classes = [10,11,12,13]
      }

      this.alunoId = this.$route.params.alunoId
      
      this.loader = true

      try {
        const classesStr = this.classes.join(","); // "7,8,9"
        // uso api.listar conforme referiste (módulo que já trata o data)
        const resp = await api.listar(`/certificados/aluno/${this.alunoId}/${classesStr}`);
        // atribuição direta (suporta resp = { certificado: {...} } ou resp já ser o certificado)
        this.certificado = resp?.certificado ?? resp ?? this.certificado;
        console.log('Certificado carregado:', this.certificado);
        this.loader = false
      } catch (err) {
        console.error("Erro ao carregar certificado:", err);
        this.loader = false
      }
    },

    imprimirPDF() {
      const elemento = document.getElementById("conteudo-pdf");
      const opcoes = {
        margin: [5, 5, 5, 5], // margens (top, left, bottom, right)
        filename: "certificado.pdf",
        image: { type: "jpeg", quality: 1 }, // máxima qualidade de imagem
        html2canvas: {
          scale: 3,           // aumenta a resolução (2 padrão, 3~4 mais nítido)
          useCORS: true,      // permite imagens externas
          dpi: 300,           // qualidade de impressão
          letterRendering: true, // renderiza melhor texto pequeno
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, 
      };

      html2pdf().set(opcoes).from(elemento).save();
    },
  },

  mounted() {
    // carrega automaticamente usando as variáveis dinamicas
    this.carregarCertificado();
  }
};
</script>

<style scoped>
/* wrapper central e limite de largura para evitar que conteúdo estoure */
.certificate-wrapper {
  max-width: 920px;
  margin: 0 auto;
  padding: 8px;
  box-sizing: border-box;
}

/* content */
.certificate-content {
  padding: 15px;
  background: #fff;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt; /* tamanho real do Word */
  line-height: 1.4rem;
}

/* cabeçalho do certificado */
.certificate-head img {
  display: block;
  margin: 0 auto 0px auto;
}
.institution-line {
  margin: 0 0 0px 0;
  line-height: 1.4rem;
  font-size: 12pt;
}
h5 { 
  margin: 0 0 0px 0; 
  font-size: 12pt;
  font-family: 'Times New Roman', Times, serif;
}

/* parágrafos */
.intro, .rodape p {
  margin: 0 0 0px 0;
  text-align: justify;
  line-height: 1.4rem;
  font-size: 12pt;
}

/* recuo no início do parágrafo */
.indent { margin-left: 3rem; }
.aluno-nome { color: red; font-weight: 600; }

/* wrapper responsivo da tabela */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: 18px;
}

/* tabela */
.certificate-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt; /* tamanho Word */
}
.certificate-table th, 
.certificate-table td {
  border: 1px solid #000;
  padding: 2px 8px !important;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
  white-space: normal;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt !important;
}

/* Coluna de disciplina mais larga */
.certificate-table th:first-child,
.certificate-table td.disc-name {
  width: 36%;
  text-align: left;
  padding-left: 12px;
}

/* outras colunas: distribuir igualmente */
.certificate-table th:nth-child(n+2) {
  width: calc(64% / 5);
}

/* notas vermelhas */
.nota-vermelha {
  color: red;
  font-weight: bold;
}

/* rodapé e assinatura */
.rodape { margin-top: 5px; font-size: 12pt; }
.assinatura { text-align: center; margin-top: 8px; font-size: 12pt; }

/* linha de assinaturas responsiva */ 
.row.assinatura-row {
  display: flex; 
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}
.col-6 {
  flex: 1 1 50%;
  min-width: 220px;
}
.col-6.left { display: flex; justify-content: flex-start; }
.col-6.right { display: flex; justify-content: flex-end; }

.assinatura-box {
  width: 250px;
  text-align: center;
  padding-bottom: 4px;
  border-bottom: 1px solid #000;
  margin: 0 0 4px 0;
  font-size: 12pt;
}
.assinatura-diretor .diretor-nome {
  text-align: center;
  margin: 4px 0 0 0;
  font-size: 12pt;
}

/* tipografia global */
/* h1,h2,h3,h4,h5,p,th,td,span,div {
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt !important;
} */

/* ajustes para impressão */
@media print {
  .certificate-wrapper { max-width: 100%; padding: 0; }
  .header-actions { display: none; } /* remove botão imprimir */
  .certificate-table th, .certificate-table td { font-size: 12pt !important; }
}

</style>
