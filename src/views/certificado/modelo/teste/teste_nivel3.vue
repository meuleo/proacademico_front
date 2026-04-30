<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid col-9 mx-auto">
      <div class="certificate-wrapper">
        <div class="header-actions d-flex justify-content-between align-items-center mb-4">
          <button class="btn btn-primary" @click="imprimirPDF">
            <i class="fas fa-print me-2"></i>Imprimir
          </button>
        </div>

        <div class="card p-0">
          <div class="certificate-content" id="conteudo-pdf">
            <!-- <div style="border: 2px solid #000; padding: 3px;">  -->
            <div style="background-image: url('/assets/images/certificado_dopsa.jpg'); background-size: 100% 100%; background-position: center; padding: 40px; background-repeat: no-repeat;"> 
              <!-- <div style="border: 8px solid blue; padding: 1rem;"> -->
              <!-- Logo + Cabeçalho -->
              <div class="certificate-head text-center">
                <img src="/assets/images/insigbnia.PNG" alt="logo" width="60">
                <p class="institution-line">
                  REPÚBLICA DE ANGOLA <br> 
                  MINISTÉRIO DA EDUCAÇÃO <br>
                  II CICLO DO ENSINO SECUNDÁRIO GERAL
                </p>
                <h5 class="mb-2 mt-2" style="font-weight: bold;">CERTIFICADO</h5>
              </div>

              <!-- Texto introdutório -->
              <div class="certificate-body">
                <p class="intro m-0">
                  <b>{{ certificado.director }}</b>, Directora do {{ certificado.colegio }}, 
                  criado sob o Decreto Executivo nº {{ certificado.decreto }}, de {{ certificado.data_decreto }}, 
                  certifica que <span class="aluno-nome">{{ certificado.aluno.nome }}</span>, 
                  filho(a) de {{ certificado.aluno.pai }} e de {{ certificado.aluno.mae }}, 
                  nascido(a) aos {{ certificado.aluno.nascimento }}, natural de {{ certificado.aluno.naturalidade }}, 
                  Município de {{ certificado.aluno.municipio }}, Província de {{ certificado.aluno.provincia }}, 
                  portador do B.I. nº {{ certificado.aluno.bi }}, passado pela Direcção Nacional de Identificação, 
                  aos {{ certificado.aluno.data_bi }}. 
                  Concluiu no Complexo Escolar Privado <b>{{ certificado.escola }}</b> no ano lectivo {{ certificado.ano_lectivo }}, 
                  o Curso do II CICLO DO ENSINO SECUNDÁRIO GERAL, na Área de <b>{{ certificado.curso }}</b>, 
                  conforme o disposto na {{ certificado.base_legal }}, 
                  com a Média Final de {{ certificado.media_final }} valores, 
                  obtida nas seguintes classificações por disciplinas:
                </p>
              </div>

              <!-- Tabela -->
              <div class="table-responsive">
                <table class="certificate-table p-0 mt-3">
                  <thead>
                    <tr>
                      <th>Disciplinas</th>
                      <th>10ª Classe</th>
                      <th>11ª Classe</th>
                      <th>12ª Classe</th>
                      <th>Média Final</th>
                      <th>Média por Extenso</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Grupo: Formação Geral -->
                    <tr>
                      <td colspan="6" class="text-start"><strong><i>Formação Geral</i></strong></td>
                    </tr>
                    <tr v-for="(disc, i) in disciplinas.filter(d => d.dominio === 'Formação Geral')" :key="'fg' + i">
                      <td class="disciplina-header">{{ disc.nome }}</td>
                      <td>{{ disc.classe10 }}</td>
                      <td>{{ disc.classe11 }}</td>
                      <td>{{ disc.classe12 }}</td>
                      <td class="media-final">{{ disc.media }}</td>
                      <td>{{ disc.extenso }}</td>
                    </tr>

                    <!-- Grupo: Formação Específica -->
                    <tr>
                      <td colspan="6" class="text-start"><strong><i>Formação Específica</i></strong></td>
                    </tr>
                    <tr v-for="(disc, i) in disciplinas.filter(d => d.dominio === 'Formação Específica')" :key="'fe' + i">
                      <td class="disciplina-header">{{ disc.nome }}</td>
                      <td>{{ disc.classe10 }}</td>
                      <td>{{ disc.classe11 }}</td>
                      <td>{{ disc.classe12 }}</td>
                      <td class="media-final">{{ disc.media }}</td>
                      <td>{{ disc.extenso }}</td>
                    </tr>

                    <!-- Grupo: Opção -->
                    <tr>
                      <td colspan="6" class="text-start"><strong><i>Opção</i></strong></td>
                    </tr>
                    <tr v-for="(disc, i) in disciplinas.filter(d => d.dominio === 'Opção')" :key="'op' + i">
                      <td class="disciplina-header">{{ disc.nome }}</td>
                      <td>{{ disc.classe10 }}</td>
                      <td>{{ disc.classe11 }}</td>
                      <td>{{ disc.classe12 }}</td>
                      <td class="media-final">{{ disc.media }}</td>
                      <td>{{ disc.extenso }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Rodapé -->
              <div class="rodape pt-2">
                <p>
                  Para efeitos legais lhe é passado o presente CERTIFICADO, que consta no livro de registo nº {{ certificado.livro }}, 
                  folha <!-- {{ certificado.folha }} --> - assinado por mim e autenticado com carimbo a oléo/selo branco em uso neste estabelecimento de ensino.
                </p>
              </div>

              <!-- Data -->
              <div class="assinatura p-0 col-12" style="text-align: center; width: 100%;">
                <span>{{ certificado.colegio }}, aos {{ certificado.data_emissao }}.</span>
              </div>

              <!-- Assinaturas -->
              <div class="assinaturas mt-3 d-flex justify-content-between">
                <div class="assinatura" style="width: 40%;">
                  <strong>O Director do Complexo</strong>
                  <p>{{ certificado.director_complexo }}</p>
                </div>
                <div class="assinatura" style="width: 50%;">
                  <strong>A Directora</strong>
                  <p>{{ certificado.director }}</p>
                </div>
              </div>

              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import html2pdf from "html2pdf.js";

export default {
  components: { navbar, sidebar },
  data() {
    return {
      certificado: {
        director: "MSc. CARLA MARISA CALEQUERA MANUEL",
        director_complexo: 'Domingos Paulino Santos',
        local: 'Lubango',
        data_emissao: '03 de Agosto de 2025',
        colegio: "Liceu Nº 792 - Lubango",
        decreto: "1008/2021",
        data_decreto: "01 de Setembro",
        escola: "O BOM CONHECIMENTO",
        ano_lectivo: "2012",
        curso: "CIÊNCIAS FÍSICAS E BIOLÓGICAS",
        base_legal: "alínea e) do artigo 109º da LBSEE nº 17/16, de 7 de Outubro",
        media_final: 11,
        aluno: {
          nome: "HUNDINGATCHI CONCEIÇÃO MALAMBA BUALE",
          pai: "Mário Buale",
          mae: "Maria Conceição Malamba",
          nascimento: "21 de Junho de 1992",
          naturalidade: "Bibala",
          municipio: "Bibala",
          provincia: "Namibe",
          bi: "004914456NE041",
          data_bi: "19 de Abril de 2024",
        }
      },
      disciplinas: [
        { nome: "Português", classe10: "10", classe11: "10", classe12: "10", media: "10", extenso: "Dez Valores", dominio: "Formação Geral" },
        { nome: "Inglês", classe10: "11", classe11: "10", classe12: "10", media: "10", extenso: "Dez Valores", dominio: "Formação Geral" },
        { nome: "Matemática", classe10: "10", classe11: "10", classe12: "10", media: "10", extenso: "Dez Valores", dominio: "Formação Geral" },
        { nome: "Informática", classe10: "10", classe11: "---", classe12: "---", media: "10", extenso: "Dez Valores", dominio: "Formação Geral" },
        { nome: "Educação Física", classe10: "14", classe11: "13", classe12: "12", media: "13", extenso: "Treze Valores", dominio: "Formação Geral" },
        { nome: "Filosofia", classe10: "---", classe11: "10", classe12: "10", media: "10", extenso: "Dez Valores", dominio: "Formação Geral" },

        { nome: "Física", classe10: "12", classe11: "10", classe12: "10", media: "11", extenso: "Onze Valores", dominio: "Formação Específica" },
        { nome: "Química", classe10: "10", classe11: "11", classe12: "12", media: "11", extenso: "Onze Valores", dominio: "Formação Específica" },
        { nome: "Biologia", classe10: "10", classe11: "12", classe12: "10", media: "11", extenso: "Onze Valores", dominio: "Formação Específica" },
        { nome: "Geografia", classe10: "---", classe11: "12", classe12: "13", media: "13", extenso: "Treze Valores", dominio: "Formação Específica" },

        { nome: "Psicologia", classe10: "---", classe11: "11", classe12: "12", media: "12", extenso: "Doze Valores", dominio: "Opção" }
      ]
    };
  },
  methods: {
    imprimirPDF() {
      const elemento = document.getElementById("conteudo-pdf");
      const opcoes = {
        margin: [2, 2, 2, 2],
        filename: "certificado.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          dpi: 300,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opcoes).from(elemento).save();
    },
  },
};
</script>

<style scoped>
.certificate-wrapper {
  max-width: 920px;
  margin: 0 auto;
  padding: 8px;
}
.certificate-content {
  padding: 15px;
  background: #fff;
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt;
  line-height: 1.4rem;
}
.institution-line { margin: 0; font-size: 12pt; }
.intro { text-align: justify; }
.aluno-nome { color: red; font-weight: 600; }
.certificate-table { width: 100%; border-collapse: collapse; margin-top: 18px; }
.certificate-table th, .certificate-table td {
  border: 1px solid #000;
  padding: 1px 6px;
  text-align: center;
  font-size: 12pt;
}
.disciplina-header { text-align: left; }
.media-final { font-weight: bold; }
.assinaturas { margin-top: 30px; display: flex; justify-content: space-between; }
.assinatura { width: 45%; text-align: center; }
.assinatura p { border-top: 1px solid #000; padding-top: 5px; margin-top: 18px; }
</style>
