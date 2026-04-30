<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
    
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-edit me-2"></i>Ver Certificado</h2>
      </div>

      <div class="co">
        <div style="width: 60%; margin: 0 auto; padding: 30px 10px;">
          <div style="text-align: center;">
            <img src="/assets/images/insigbnia.PNG" alt="">
            <p style="line-height: 1.5rem;">
              República de Angola <br>
              Ministério da Educação <br>
              I CICLO DO ENSINO SECUNDÁRIO
            </p>
            <h3>CERTIFICADO</h3>
          </div>

          <div>
            <p style="text-align: justify; line-height: 1.5rem;">
              <span style="margin-left: 3rem;">{{ certificado.director }}</span>, 
              Director do {{ certificado.colegio }}, criado sob Decreto Executivo nº 558/15, 
              certifica que <span style="color: red;">{{ certificado.aluno.nome }}</span>, filho de 
              {{ certificado.aluno.pai }} e de {{ certificado.aluno.mae }}, nascido aos 
              {{ certificado.aluno.nascimento }}, natural do {{ certificado.aluno.naturalidade }}, Município do 
              {{ certificado.aluno.municipio }}, Província da {{ certificado.aluno.provincia }}, 
              portador do B.I {{ certificado.aluno.bi }}, concluiu no ano lectivo {{ certificado.ano_lectivo }} 
              o I CICLO DO ENSINO SECUNDÁRIO GERAL, com a Média Final de 
              {{ certificado.media_final }} valores obtida nas seguintes classificações:
            </p>
          </div>

          <table class="w-full border-collapse border mt-6 text-sm">
            <thead>
              <tr>
                <th>DISCIPLINAS</th>
                <th>7ª CLASSE</th>
                <th>8ª CLASSE</th>
                <th>9ª CLASSE</th>
                <th>MÉDIA FINAL</th>
                <th>MÉDIA POR EXTENSO</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(disc, i) in certificado.disciplinas" :key="i">
                <td>{{ disc.nome }}</td>
                <td :class="{'nota-vermelha': parseInt(disc.classe7) < 10}">{{ disc.classe7 }}</td>
                <td :class="{'nota-vermelha': parseInt(disc.classe8) < 10}">{{ disc.classe8 }}</td>
                <td :class="{'nota-vermelha': parseInt(disc.classe9) < 10}">{{ disc.classe9 }}</td>
                <td>{{ disc.media }}</td>
                <td>{{ disc.extenso }}</td>
              </tr>
            </tbody>
          </table>

          <div class="rodape">
            <p>a) Sem elementos de classificação.</p>
            <p>
              Para efeitos legais, lhe é passado o presente CERTIFICADO, que consta no Livro de Registo nº *** folha***, 
              assinado e autenticado com carimbo a óleo em uso neste Estabelecimento de Ensino.
            </p>
          </div>

          <div class="assinatura">
            <p>{{ certificado.colegio }} em Lubango, aos {{ certificado.data_emissao }}.</p>
          </div>

          <div class="row">
            <div class="col-6">
              <p style="width: 250px; text-align: center; padding-bottom: 20px; border-bottom: 1px solid #000;">
                Conferido por
              </p>
            </div>
            <div class="col-6" style="display: flex; justify-content: end; text-align: center;">
              <div>
                <p style="width: 250px; padding-bottom: 20px; border-bottom: 1px solid #000;">
                  Conferido por
                </p>
                <p>{{ certificado.director }}</p>
              </div>
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

export default {
  components: { navbar, sidebar },
  data() {
    return {
      certificado: {
        director: "PACIÊNCIA MONTEIRO JORGE",
        colegio: 'COLÉGIO Nº 811 - "1º MAIO"',
        aluno: {
          nome: "JOÃO PANA MONTEIRO FRANCISCO",
          pai: "Silva António Francisco",
          mae: "Albina Tuluka Monteiro",
          nascimento: "15 de Setembro de 2006",
          naturalidade: "Lubango",
          municipio: "Lubango",
          provincia: "Huíla",
          bi: "Nº021452275HA055, passado pela Direcção Nacional de Identificação, aos 01/02/2021",
        },
        ano_lectivo: "2022/2023",
        media_final: 12,
        data_emissao: "08 de Janeiro de 2024",
        disciplinas: [
          { nome: "PORTUGUÊS", classe7: "11", classe8: "11", classe9: "11", media: "12", extenso: "Doze" },
          { nome: "INGLÊS", classe7: "11", classe8: "12", classe9: "11", media: "11", extenso: "Onze" },
          { nome: "MATEMÁTICA", classe7: "11", classe8: "11", classe9: "11", media: "12", extenso: "Doze" },
          { nome: "BIOLOGIA", classe7: "11", classe8: "11", classe9: "11", media: "11", extenso: "Dez" },
          { nome: "FÍSICA", classe7: "11", classe8: "12", classe9: "12", media: "11", extenso: "Onze" },
          { nome: "QUÍMICA", classe7: "11", classe8: "11", classe9: "11", media: "12", extenso: "Doze" },
          { nome: "GEOGRAFIA", classe7: "09", classe8: "11", classe9: "12", media: "11", extenso: "Dez" },
          { nome: "HISTÓRIA", classe7: "11", classe8: "12", classe9: "11", media: "11", extenso: "Onze" },
          { nome: "ED. FÍSICA", classe7: "11", classe8: "11", classe9: "11", media: "11", extenso: "Onze" },
          { nome: "E.M.C", classe7: "14", classe8: "12", classe9: "12", media: "11", extenso: "Treze" },
          { nome: "E.V.P", classe7: "15", classe8: "11", classe9: "15", media: "11", extenso: "Treze" },
          { nome: "EDUC. LABORAL", classe7: "11", classe8: "08", classe9: "17", media: "12", extenso: "Doze" },
          { nome: "EMPREENDEDORISMO", classe7: "a)", classe8: "a)", classe9: "a)", media: "a)", extenso: "a)" },
        ],
      },
    };
  },
};
</script>

<style>
table {
  width: 100%;
  margin: auto;
}
th, td {
  border: 1px solid black;
  text-align: center;
  padding: 5px;
}
.nota-vermelha {
  color: red;
  font-weight: bold;
}
.rodape {
  margin-top: 20px;
  text-align: justify;
  line-height: 1.5rem;
}
.assinatura {
  text-align: center;
  margin-top: 30px;
  line-height: 1.5rem;
}
.row {
  display: flex;
}
.col-6 {
  width: 50%;
}
</style>
