<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <!-- <h2><i class="fas fa-edit me-2"></i>Ver Boletim</h2> -->
        <button class="btn btn-primary" @click="imprimirPDF">
          <i class="fas fa-print"></i> Imprimir
        </button>
      </div>

      <div id="conteudo-pdf">
        <!-- Dados do aluno -->
         <div>
          <h5 class="text-14 text-center">COMPLEXO ESCOLAR PRIVADO DO ENSINO PRIMÁRIO, I E II CICLOS DO ENSINO SECUNDÁRIO</h5>
          <h5 class="text-14 text-center mb-4">«O BOM CONHECIMENTO» LUBANGO</h5>

          <h5 class="text-14 text-center mt-3" style="text-decoration: underline;">TERMO DE APROVEITAMENTO</h5>
         </div>
        <div class="dados">
          <p>Nome do aluno: <span>FRANCISCO XAVIER CHIPIPA</span>
            Natural de: <span>Caconda</span> &nbsp;&nbsp;&nbsp;
            Município de: <span>Caconda</span> &nbsp;&nbsp;&nbsp;
            Província de: <span>Huíla</span>
          
          Nascido(a) no dia <span>24 de Setembro</span> ano de: <span>2004</span>
          Filho(a) de <span>Alberto João Chipipa</span> e de <span>Rosa Wandi</span>
          Portador(a) do BI: <span>023730326HA053</span> emitido em: <span>Lubango</span></p>
        </div>

        <!-- Aqui ficam as tabelas -->
         <!-- Contêiner de Níveis -->
        <div class="nivel-container">

          <!-- Linha 1 -->
          <div class="linha">
            <!-- Nivel 1 - Classe 7ª -->
            <div class="nivel">
              <div class="escola">
                <p>
                  Ano Lectivo: <span>2019/20</span> &nbsp;&nbsp; Classe:
                  <span>7ª</span> &nbsp;&nbsp; Turma: <span>D</span> &nbsp;&nbsp; Nº:
                  <span>14</span> &nbsp;&nbsp; Obs: <span>Transita</span>
                </p>
              </div>
              <div class="tabela">
                <table>
                  <thead>
                    <tr>
                      <th rowspan="2">DISCIPLINAS</th>
                      <th colspan="3">I Trimestre</th>
                      <th colspan="3">II Trimestre</th>
                      <th colspan="3">III Trimestre</th>
                      <th rowspan="2">CAP</th>
                      <th rowspan="2">CPE - CE</th>
                      <th rowspan="2">CF</th>
                    </tr>
                    <tr>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>L. PORTUGUESA</td>
                      <td class="nota">4,0</td><td>9,5</td><td class="nota">6,8</td>
                      <td class="nota">6,0</td><td>12,5</td><td>9,3</td>
                      <td>8,0</td><td>10,8</td><td>9,4</td>
                      <td>8,5</td><td>11,5</td><td>10</td>
                    </tr>
                    <tr>
                      <td>L. ESTRANGEIRA</td>
                      <td>11,0</td><td>8,0</td><td>9,5</td>
                      <td class="nota">5,0</td><td class="nota">6,5</td><td class="nota">5,8</td>
                      <td>8,0</td><td>12,0</td><td>8,0</td>
                      <td>8,4</td><td>11,0</td><td>10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Nivel 2 - Classe 8ª -->
            <div class="nivel">
              <div class="escola">
                <p>
                  Ano Lectivo: <span>2019/20</span> &nbsp;&nbsp; Classe:
                  <span>8ª</span> &nbsp;&nbsp; Turma: <span>D</span> &nbsp;&nbsp; Nº:
                  <span>14</span> &nbsp;&nbsp; Obs: <span>Transita</span>
                </p>
              </div>
              <div class="tabela">
                <table>
                  <thead>
                    <tr>
                      <th rowspan="2">DISCIPLINAS</th>
                      <th colspan="3">I Trimestre</th>
                      <th colspan="3">II Trimestre</th>
                      <th colspan="3">III Trimestre</th>
                      <th rowspan="2">CAP</th>
                      <th rowspan="2">CPE - CE</th>
                      <th rowspan="2">CF</th>
                    </tr>
                    <tr>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>L. PORTUGUESA</td>
                      <td>10,0</td><td>11,0</td><td>12,0</td>
                      <td>9,0</td><td>10,0</td><td>11,0</td>
                      <td>12,0</td><td>13,0</td><td>14,0</td>
                      <td>10,5</td><td>11,0</td><td>11</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Linha 2 -->
          <div class="linha">
            <!-- Nivel 3 - Classe 9ª -->
            <div class="nivel">
              <div class="escola">
                <p>
                  Ano Lectivo: <span>2019/20</span> &nbsp;&nbsp; Classe:
                  <span>9ª</span> &nbsp;&nbsp; Turma: <span>D</span> &nbsp;&nbsp; Nº:
                  <span>14</span> &nbsp;&nbsp; Obs: <span>Transita</span>
                </p>
              </div>
              <div class="tabela">
                <table>
                  <thead>
                    <tr>
                      <th rowspan="2">DISCIPLINAS</th>
                      <th colspan="3">I Trimestre</th>
                      <th colspan="3">II Trimestre</th>
                      <th colspan="3">III Trimestre</th>
                      <th rowspan="2">CAP</th>
                      <th rowspan="2">CPE - CE</th>
                      <th rowspan="2">CF</th>
                    </tr>
                    <tr>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                      <th>MAC</th><th>CPP</th><th>CT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>L. PORTUGUESA</td>
                      <td>13,0</td><td>12,0</td><td>11,0</td>
                      <td>14,0</td><td>13,0</td><td>12,0</td>
                      <td>15,0</td><td>14,0</td><td>13,0</td>
                      <td>12,5</td><td>13,0</td><td>12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Nivel 4 - Tabela vazia -->
            <div class="nivel vazio">
              <div class="as-container">
                <div class="text-center bold mb-2 text-14">
                    OBS: <span class="as-input-line-1"></span>
                </div>
                
                <div class="text-center bold mb-2 text-14">
                    Lubango, aos 22 de Julho de 2024.
                </div>
                
                <div class="text-center bold mb-5 text-14">
                    O CONSELHO DE NOTAS,
                </div>
                
                <div class="as-list text-center text-14 bold">
                    <div class="as-list-item">
                        1.<span class="as-input-line-2"></span>
                    </div>
                    <div class="as-list-item">
                        2.<span class="as-input-line-2"></span>
                    </div>
                    <div class="as-list-item">
                        3.<span class="as-input-line-2"></span>
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
import html2pdf from "html2pdf.js";

export default {
  components: { navbar, sidebar },
  data() {
    return {
      certificado: [],
    };
  },
  methods: {
    imprimirPDF() {
      const elemento = document.getElementById("conteudo-pdf");
      const opcoes = {
        margin: [5, 5, 5, 5], // margens (top, left, bottom, right)
        filename: "boletim.pdf",
        image: { type: "jpeg", quality: 1 }, // qualidade máxima
        html2canvas: { scale: 2, useCORS: true }, // aumenta a resolução
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }, // <-- landscape
      };
      html2pdf().set(opcoes).from(elemento).save();
    },
  },
};
</script>

<style scoped>
.dados p,
.escola p {
  margin: 3px 0;
  font-size: 12px;
}
span {
  font-weight: bold;
}
.nivel-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.linha {
  display: flex;
  gap: 20px;
}
.nivel {
  flex: 1;
}
table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  font-size: 12px;
}
table th,
table td {
  border: 1px solid #000;
  padding: 4px;
}
table th {
  background: #f2f2f2;
}
.nota {
  color: red;
  font-weight: bold;
}
.vazio table {
  background: #fafafa;
}

/* **** */
.dados p, .escola p {
  margin: 3px 0;
  font-size: 12px;
}
span { font-weight: bold; }
.nivel-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.linha {
  display: flex;
  gap: 20px;
}
.nivel {
  flex: 1;
}
table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  font-size: 12px;
}
table th, table td {
  border: 1px solid #000;
  padding: 4px;
}
table th {
  background: #f2f2f2;
}
.nota {
  color: red;
  font-weight: bold;
}
.vazio table {
  background: #fafafa;
}

/* ** */
.bold {
  font-weight: bold;
}

.as-input-line-1 {
  display: inline-block; border-bottom: 1px solid #000; width: 300px;
}

.as-input-line-2 {
  display: inline-block; border-bottom: 1px solid #000; width: 250px;
}
</style>
