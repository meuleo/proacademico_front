<template>
  <div>
    <navbar />
    <sidebar />

    <div class="main-content">
      <div class="container-fluid">

        <!-- Cabeçalho -->
        <div class="mb-4 mt-5">
          <button class="btn btn-primary me-2" @click="imprimirPDF"><i class="fas fa-print"></i> Imprimir</button>
          <button class="btn btn-warning me-2" @click="editarAluno"><i class="fas fa-user"></i> Atualizar dados do Aluno</button>
          <button class="btn btn-secondary me-2" @click="$router.back()"><i class="fas fa-arrow-left"></i> Termo simples</button>
          <!-- <button class="btn btn-info me-2" @click="visibleColumnNpp = !visibleColumnNpp">Ativar/Desativar NPP</button>
          <button class="btn btn-info me-2" @click="visibleColumnExame = !visibleColumnExame">Ativar/Desativar Exame</button>
          <button class="btn btn-info me-2" @click="visibleColumnRecurso = !visibleColumnRecurso">Ativar/Desativar Recurso</button> -->
        </div>

        <div id="conteudo-pdf">
          <!-- Dados do aluno -->
           <div>
            <h5 class="text-10 text-center">COMPLEXO ESCOLAR PRIVADO DO ENSINO PRIMÁRIO, I E II CICLOS DO ENSINO SECUNDÁRIO</h5>
            <h5 class="text-10 text-center mb-4">Escola Teste</h5>

            <h5 class="text-11 text-center mt-3" style="text-decoration: underline;">TERMO DE APROVEITAMENTO</h5>
           </div>

          <div class="dados">
            <p>
              Nome do aluno: <span class="text-danger"><b>{{ certificado.aluno?.nome_completo ?? '—' }}</b></span>
              Natural de: <span>{{ certificado.aluno?.naturalidade ?? '—' }}</span> &nbsp;&nbsp;&nbsp;
              Município de: <span>{{ certificado.aluno?.municipio ?? '—' }}</span> &nbsp;&nbsp;&nbsp;
              Província de: <span>{{ certificado.aluno?.provincia ?? '—' }}</span>
              <br>
              Nascido(a) no dia <span>{{ formatDataNascimento(certificado.aluno?.data_nascimento) }}</span> ano de: <span>{{ formatAno(certificado.aluno?.data_nascimento) }}</span>
              <br>
              Filho(a) de <span>{{ certificado.aluno?.pai ?? '—' }}</span> e de <span>{{ certificado.aluno?.mae ?? '—' }}</span>
              <br>
              Portador(a) do BI: <span>{{ certificado.aluno?.bi ?? '—' }}</span> emitido em: <span>{{ certificado.aluno?.bi_emissao ?? '—' }}</span>
            </p>
          </div>

          <!-- Conteiner com 2 linhas (cada linha com 2 blocos) -->
          <div class="nivel-container">

            <!-- Linha 1 -->
            <div class="linha">
              <!-- Tabela - Classe 0 -->
              <div class="nivel">
                <div class="escola">
                  <p>
                    Ano Lectivo: <span>{{ anoLetivoParaClasse(classes[0]) }}</span> &nbsp;&nbsp; Classe:
                    <span>{{ classes[0] ?? '-' }}ª</span> &nbsp;&nbsp; Turma: <span>{{ turmaParaClasse(classes[0]) }}</span> &nbsp;&nbsp; Nº:
                    <span>{{ numeroAluno }}</span> &nbsp;&nbsp; Obs: <span :class="obsClass(classes[0])"><b>{{ termObservation(classes[0]) }}</b></span>
                  </p>
                </div>
                <div class="tabela">
                  <table v-if="(termTables[classes[0]]?.rows || []).length" class="w-full border-collapse border m-0 text-sm">
                    <thead>
                      <tr>
                        <th rowspan="2" class="border px-2 py-1">DISCIPLINAS</th>
                        <th colspan="4" class="border">I Trimestre</th>
                        <th colspan="4" class="border">II Trimestre</th>
                        <th colspan="4" class="border">III Trimestre</th>
                        <th rowspan="2" class="border px-2 py-1">MFD</th>
                        <th v-if="Number(classes[0]) === 9" rowspan="2" class="border px-2 py-1">E</th>
                        <th v-if="Number(classes[0]) === 9" rowspan="2" class="border px-2 py-1">MF</th>
                        <th v-if="Number(classes[0]) === 9" rowspan="2" class="border px-2 py-1">R</th>
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
                      <tr v-for="row in termTables[classes[0]].rows" :key="row.uid">
                        <td class="border text-start font-bold ps-2">{{ row.disciplina?.nome ?? '---' }}</td>

                        <!-- I trimestre -->
                        <td class="border" :class="getNotaClass(row.mac1)">{{ displayVal(row.mac1) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp1)">{{ displayVal(row.npp1) }}</td>
                        <td class="border" :class="getNotaClass(row.npt1)">{{ displayVal(row.npt1) }}</td>
                        <td class="border" :class="getNotaClass(row.mt1)">{{ displayVal(row.mt1) }}</td>

                        <!-- II trimestre -->
                        <td class="border" :class="getNotaClass(row.mac2)">{{ displayVal(row.mac2) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp2)">{{ displayVal(row.npp2) }}</td>
                        <td class="border" :class="getNotaClass(row.npt2)">{{ displayVal(row.npt2) }}</td>
                        <td class="border" :class="getNotaClass(row.mt2)">{{ displayVal(row.mt2) }}</td>

                        <!-- III trimestre -->
                        <td class="border" :class="getNotaClass(row.mac3)">{{ displayVal(row.mac3) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp3)">{{ displayVal(row.npp3) }}</td>
                        <td class="border" :class="getNotaClass(row.npt3)">{{ displayVal(row.npt3) }}</td>
                        <td class="border" :class="getNotaClass(row.mt3)">{{ displayVal(row.mt3) }}</td>

                        <!-- MFD -->
                        <td class="border font-bold" :class="getNotaClass(row.mfd)">{{ displayVal(row.mfd) }}</td>

                        <!-- E, MF, R (apenas para classe 9) -->
                        <td v-if="Number(classes[0]) === 9" class="border" :class="getNotaClass(row.exame)">{{ displayVal(row.exame) }}</td>
                        <td v-if="Number(classes[0]) === 9" class="border" :class="getNotaClass(row.mf)">{{ displayVal(row.mf) }}</td>
                        <td v-if="Number(classes[0]) === 9" class="border" :class="getNotaClass(row.recurso)">{{ displayVal(row.recurso) }}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div v-else class="p-2 text-center small">Sem notas para esta classe</div>
                </div>
              </div>

              <!-- Tabela - Classe 1 -->
              <div class="nivel">
                <div class="escola">
                  <p>
                    Ano Lectivo: <span>{{ anoLetivoParaClasse(classes[1]) }}</span> &nbsp;&nbsp; Classe:
                    <span>{{ classes[1] ?? '-' }}ª</span> &nbsp;&nbsp; Turma: <span>{{ turmaParaClasse(classes[1]) }}</span> &nbsp;&nbsp; Nº:
                    <span>{{ numeroAluno }}</span> &nbsp;&nbsp; Obs: <span :class="obsClass(classes[1])"><b>{{ termObservation(classes[1]) }}</b></span>
                  </p>
                </div>
                <div class="tabela">
                  <table v-if="(termTables[classes[1]]?.rows || []).length" class="w-full border-collapse border m-0 text-sm">
                    <thead>
                      <tr>
                        <th rowspan="2" class="border px-2 py-1">DISCIPLINAS</th>
                        <th colspan="4" class="border">I Trimestre</th>
                        <th colspan="4" class="border">II Trimestre</th>
                        <th colspan="4" class="border">III Trimestre</th>
                        <th rowspan="2" class="border px-2 py-1">MFD</th>
                        <th v-if="Number(classes[1]) === 9" rowspan="2" class="border px-2 py-1">E</th>
                        <th v-if="Number(classes[1]) === 9" rowspan="2" class="border px-2 py-1">MF</th>
                        <th v-if="Number(classes[1]) === 9" rowspan="2" class="border px-2 py-1">R</th>
                      </tr>
                      <tr>
                        <th class="border">MAC</th>
                        <th v-if="visibleColumnNpp" class="border">NPP</th>
                        <th class="border">NPT</th>
                        <th class="border">MT1</th>

                        <th class="border">MAC</th>
                        <th v-if="visibleColumnNpp" class="border">NPP</th>
                        <th class="border">NPT</th>
                        <th class="border">MT2</th>

                        <th class="border">MAC</th>
                        <th v-if="visibleColumnNpp" class="border">NPP</th>
                        <th class="border">NPT</th>
                        <th class="border">MT3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in termTables[classes[1]].rows" :key="row.uid">
                        <td class="border text-start font-bold ps-2">{{ row.disciplina?.nome ?? '---' }}</td>

                        <!-- I trimestre -->
                        <td class="border" :class="getNotaClass(row.mac1)">{{ displayVal(row.mac1) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp1)">{{ displayVal(row.npp1) }}</td>
                        <td class="border" :class="getNotaClass(row.npt1)">{{ displayVal(row.npt1) }}</td>
                        <td class="border" :class="getNotaClass(row.mt1)">{{ displayVal(row.mt1) }}</td>

                        <!-- II trimestre -->
                        <td class="border" :class="getNotaClass(row.mac2)">{{ displayVal(row.mac2) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp2)">{{ displayVal(row.npp2) }}</td>
                        <td class="border" :class="getNotaClass(row.npt2)">{{ displayVal(row.npt2) }}</td>
                        <td class="border" :class="getNotaClass(row.mt2)">{{ displayVal(row.mt2) }}</td>

                        <!-- III trimestre -->
                        <td class="border" :class="getNotaClass(row.mac3)">{{ displayVal(row.mac3) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp3)">{{ displayVal(row.npp3) }}</td>
                        <td class="border" :class="getNotaClass(row.npt3)">{{ displayVal(row.npt3) }}</td>
                        <td class="border" :class="getNotaClass(row.mt3)">{{ displayVal(row.mt3) }}</td>

                        <!-- MFD -->
                        <td class="border font-bold" :class="getNotaClass(row.mfd)">{{ displayVal(row.mfd) }}</td>

                        <!-- E, MF, R (apenas para classe 9) -->
                        <td v-if="Number(classes[1]) === 9" class="border" :class="getNotaClass(row.exame)">{{ displayVal(row.exame) }}</td>
                        <td v-if="Number(classes[1]) === 9" class="border" :class="getNotaClass(row.mf)">{{ displayVal(row.mf) }}</td>
                        <td v-if="Number(classes[1]) === 9" class="border" :class="getNotaClass(row.recurso)">{{ displayVal(row.recurso) }}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div v-else class="p-2 text-center small">Sem notas para esta classe</div>
                </div>
              </div>
            </div>

            <!-- Linha 2 -->
            <div class="linha">
              <!-- Tabela - Classe 2 -->
              <div class="nivel">
                <div class="escola">
                  <p>
                    Ano Lectivo: <span>{{ anoLetivoParaClasse(classes[2]) }}</span> &nbsp;&nbsp; Classe:
                    <span>{{ classes[2] ?? '-' }}ª</span> &nbsp;&nbsp; Turma: <span>{{ turmaParaClasse(classes[2]) }}</span> &nbsp;&nbsp; Nº:
                    <span>{{ numeroAluno }}</span> &nbsp;&nbsp; Obs: <span :class="obsClass(classes[2])"><b>{{ termObservation(classes[2]) }}</b></span>
                  </p>
                </div>
                <div class="tabela">
                  <table v-if="(termTables[classes[2]]?.rows || []).length" class="w-full border-collapse border m-0 text-sm">
                    <thead>
                      <tr>
                        <th rowspan="2" class="border px-2 py-1">DISCIPLINAS</th>
                        <th colspan="4" class="border">I Trimestre</th>
                        <th colspan="4" class="border">II Trimestre</th>
                        <th colspan="4" class="border">III Trimestre</th>
                        <th rowspan="2" class="border px-2 py-1">MFD</th>
                        <th v-if="Number(classes[2]) === 9" rowspan="2" class="border px-2 py-1">E</th>
                        <th v-if="Number(classes[2]) === 9" rowspan="2" class="border px-2 py-1">MF</th>
                        <th v-if="Number(classes[2]) === 9" rowspan="2" class="border px-2 py-1">R</th>
                      </tr>
                      <tr>
                        <th class="border">MAC</th>
                        <th v-if="visibleColumnNpp" class="border">NPP</th>
                        <th class="border">NPT</th>
                        <th class="border">MT1</th>

                        <th class="border">MAC</th>
                        <th v-if="visibleColumnNpp" class="border">NPP</th>
                        <th class="border">NPT</th>
                        <th class="border">MT2</th>

                        <th class="border">MAC</th>
                        <th v-if="visibleColumnNpp" class="border">NPP</th>
                        <th class="border">NPT</th>
                        <th class="border">MT3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in termTables[classes[2]].rows" :key="row.uid">
                        <td class="border text-start font-bold ps-2">{{ row.disciplina?.nome ?? '---' }}</td>

                        <!-- I trimestre -->
                        <td class="border" :class="getNotaClass(row.mac1)">{{ displayVal(row.mac1) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp1)">{{ displayVal(row.npp1) }}</td>
                        <td class="border" :class="getNotaClass(row.npt1)">{{ displayVal(row.npt1) }}</td>
                        <td class="border" :class="getNotaClass(row.mt1)">{{ displayVal(row.mt1) }}</td>

                        <!-- II trimestre -->
                        <td class="border" :class="getNotaClass(row.mac2)">{{ displayVal(row.mac2) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp2)">{{ displayVal(row.npp2) }}</td>
                        <td class="border" :class="getNotaClass(row.npt2)">{{ displayVal(row.npt2) }}</td>
                        <td class="border" :class="getNotaClass(row.mt2)">{{ displayVal(row.mt2) }}</td>

                        <!-- III trimestre -->
                        <td class="border" :class="getNotaClass(row.mac3)">{{ displayVal(row.mac3) }}</td>
                        <td v-if="visibleColumnNpp" class="border" :class="getNotaClass(row.npp3)">{{ displayVal(row.npp3) }}</td>
                        <td class="border" :class="getNotaClass(row.npt3)">{{ displayVal(row.npt3) }}</td>
                        <td class="border" :class="getNotaClass(row.mt3)">{{ displayVal(row.mt3) }}</td>

                        <!-- MFD -->
                        <td class="border font-bold" :class="getNotaClass(row.mfd)">{{ displayVal(row.mfd) }}</td>

                        <!-- E, MF, R (apenas para classe 9) -->
                        <td v-if="Number(classes[2]) === 9" class="border" :class="getNotaClass(row.exame)">{{ displayVal(row.exame) }}</td>
                        <td v-if="Number(classes[2]) === 9" class="border" :class="getNotaClass(row.mf)">{{ displayVal(row.mf) }}</td>
                        <td v-if="Number(classes[2]) === 9" class="border" :class="getNotaClass(row.recurso)">{{ displayVal(row.recurso) }}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div v-else class="p-2 text-center small">Sem notas para esta classe</div>
                </div>
              </div>

              <!-- Tabela 4 vazia -->
              <div class="nivel vazio">
                <div class="as-container">
                  <div class="text-center bold mb-2 text-10">
                      OBS: <span class="as-input-line-1"></span>
                  </div>

                  <div class="text-center bold mb-2 text-10">
                      Lubango, aos <span>{{ dataAssinatura }}</span>.
                  </div>

                  <div class="text-center bold mb-5 text-10">
                      O CONSELHO DE NOTAS,
                  </div>

                  <div class="as-list text-center text-10 bold">
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

          </div> <!-- end nivel-container -->
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
      alunoId: this.$route?.params?.alunoId ?? this.$route?.query?.alunoId ?? 59,
      classes: (this.$route?.query?.classes ? ([]).concat(this.$route.query.classes) : [7,8,9]),
      certificado: {},
      termTables: {}, // por classe: { rows: [...], ano_letivo, termo, summary: {...} }
      visibleColumnNpp: true,
      numeroAluno: '_',
      dataAssinatura: new Date().toLocaleDateString(),
    };
  },
  mounted() {
    this.fetchCertificado();
  },
  methods: {
    buildQuery() {
      const params = new URLSearchParams();
      (this.classes || []).forEach(c => params.append('classes[]', c));
      return params.toString();
    },

    async fetchCertificado() {
      try {
        const url = `alunos/${this.alunoId}/classes?${this.buildQuery()}`;
        const res = await api.listar(url);
        this.certificado = res?.data ?? res;
        this.buildTermTables();
      } catch (err) {
        console.error('Erro ao buscar certificado:', err);
      }
    },

    // helper: média segura (null se vazio)
    _avg(arr) {
      if (!Array.isArray(arr) || arr.length === 0) return null;
      const nums = arr.map(x => Number(x)).filter(x => !Number.isNaN(x));
      if (nums.length === 0) return null;
      const s = nums.reduce((a,b) => a + b, 0);
      return Math.round((s / nums.length) * 10) / 10;
    },

    buildTermTables() {
      const tables = {};
      const termos = this.certificado.termos || [];

      // map termos por classe (pega último termo se múltiplos)
      const termosByClasse = {};
      termos.forEach(t => {
        termosByClasse[String(t.classe)] = t;
      });

      (this.classes || []).forEach(cl => {
        const termo = termosByClasse[String(cl)];
        if (!termo) {
          tables[cl] = { rows: [], ano_letivo: null, termo: null, summary: { mediaMFD: null } };
          return;
        }

        const rowsByDisc = {};
        (termo.notas || []).forEach(n => {
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
              // auxiliares
              finalBase: null,
              finalComExame: null,
              finalComRecurso: null,
              transita: null
            };
          }

          const r = rowsByDisc[did];
          const tipo = (n.tipo_nota || '').toLowerCase();
          const tri = (n.trimestre === null || n.trimestre === undefined || n.trimestre === '') ? null : Number(n.trimestre);
          const val = (n.valor === null || n.valor === undefined || n.valor === '') ? null : Number(n.valor);

          // preencher campos por tipo + trimestre (trimester 1/2/3)
          if (tri === 1 || tri === 2 || tri === 3) {
            if (tipo === 'mac') r[`mac${tri}`] = val;
            if (tipo === 'npp') r[`npp${tri}`] = val;
            if (tipo === 'npt') r[`npt${tri}`] = val;
            if (tipo === 'mt') r[`mt${tri}`] = val;
          } else {
            // casos que não têm trimestre (mfd, exame, recurso, mfe...)
            if (tipo === 'mfd' || tipo === 'mfe') r.mfd = val;
            if (tipo === 'exame') r.exame = val;
            if (tipo === 'recurso') r.recurso = val;
          }
        });

        // calcula finais por disciplina e flags de transição
        Object.values(rowsByDisc).forEach(r => {
          // finalBase = mfd (se existir), senão null
          r.finalBase = (r.mfd !== null && r.mfd !== undefined && r.mfd !== '') ? Number(r.mfd) : null;

          // se existir exame, finalComExame = (mfd + exame)/2 (se mfd null, usa 0 como base)
          if (r.exame !== null && r.exame !== undefined && r.exame !== '') {
            const baseForExam = (r.finalBase !== null) ? r.finalBase : 0;
            r.finalComExame = Math.round(((baseForExam + Number(r.exame)) / 2) * 10) / 10;
          } else {
            r.finalComExame = null;
          }

          // se existir recurso, finalComRecurso:
          if (r.recurso !== null && r.recurso !== undefined && r.recurso !== '') {
            const base = (r.finalComExame !== null) ? r.finalComExame : ((r.finalBase !== null) ? r.finalBase : 0);
            r.finalComRecurso = Math.round(((base + Number(r.recurso)) / 2) * 10) / 10;
          } else {
            r.finalComRecurso = null;
          }

          // decide o final efetivo por disciplina (prioridade: recurso > exame > mfd)
          if (r.finalComRecurso !== null) r.mf = Number(r.finalComRecurso.toFixed(1));
          else if (r.finalComExame !== null) r.mf = Number(r.finalComExame.toFixed(1));
          else if (r.finalBase !== null) r.mf = Number(Number(r.finalBase).toFixed(1));
          else r.mf = null;

          // transição por disciplina
          r.transita = (r.mf !== null && Number(r.mf) >= 10);
        });

        // agora sumariza a classe/termo
        const rows = Object.values(rowsByDisc).sort((a,b) => (a.disciplina?.nome ?? '').localeCompare(b.disciplina?.nome ?? ''));

        // coletar arrays de valores válidos
        const mfdVals = rows.map(r => r.mfd).filter(v => v !== null && v !== undefined && v !== '');
        const exameVals = rows.map(r => r.exame).filter(v => v !== null && v !== undefined && v !== '');
        const recursoVals = rows.map(r => r.recurso).filter(v => v !== null && v !== undefined && v !== '');

        const mediaMFD = this._avg(mfdVals);
        const mediaExame = this._avg(exameVals);
        const mediaRecurso = this._avg(recursoVals);

        // combinações: se existir exame, calcula media com exame; se existir recurso, combina com recurso
        let mediaComExame = null;
        if (mediaExame !== null && mediaMFD !== null) {
          mediaComExame = Math.round(((mediaMFD + mediaExame) / 2) * 10) / 10;
        } else if (mediaExame !== null && mediaMFD === null) {
          // se não houver MFDs mas houver exames, considera média MFD = 0 (opcional) — aqui deixamos como mediaComExame = mediaExame/2 ? melhor: usar mediaExame alone
          mediaComExame = Math.round((( (mediaMFD ?? 0) + mediaExame ) / 2) * 10) / 10;
        }

        let mediaComRecurso = null;
        if (mediaRecurso !== null) {
          const base = (mediaComExame !== null) ? mediaComExame : (mediaMFD !== null ? mediaMFD : 0);
          mediaComRecurso = Math.round(((base + mediaRecurso) / 2) * 10) / 10;
        }

        // decide média atual para observação/transição
        let mediaAtual = null;
        if (mediaComRecurso !== null) mediaAtual = mediaComRecurso;
        else if (mediaComExame !== null) mediaAtual = mediaComExame;
        else mediaAtual = mediaMFD;

        const transita = (mediaAtual !== null && Number(mediaAtual) >= 10);

        // monta observação detalhada
        const parts = [];
        // Retorna medias
        // parts.push(`Média MFD: ${mediaMFD !== null ? mediaMFD.toFixed(1) : '-'}`);
        // if (mediaExame !== null) parts.push(`Média Exames: ${mediaExame.toFixed(1)}`);
        // if (mediaComExame !== null) parts.push(`Média c/ Exames: ${mediaComExame.toFixed(1)}`);
        // if (mediaRecurso !== null) parts.push(`Média Recursos: ${mediaRecurso.toFixed(1)}`);
        // if (mediaComRecurso !== null) parts.push(`Média c/ Recursos: ${mediaComRecurso.toFixed(1)}`);
        parts.push(transita ? 'Transita' : 'Não transita');

        const summary = {
          mediaMFD, mediaExame, mediaRecurso,
          mediaComExame, mediaComRecurso,
          mediaAtual,
          transita,
          observacao: parts.join(' | '),
          obsClass: transita ? 'text-primary' : 'text-danger',
          disciplinasContadas: rows.length
        };

        tables[cl] = { rows, ano_letivo: termo.ano_letivo ?? null, termo, summary };
      });

      this.termTables = tables;
    },

    anoLetivoParaClasse(classe) {
      return this.termTables?.[classe]?.ano_letivo ?? (this.certificado.termos?.[0]?.ano_letivo ?? '—');
    },
    turmaParaClasse() { return '_'; },

    displayVal(v) {
      if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '-';
      // mostra uma casa decimal
      return Number(v).toFixed(1).replace('.', ',');
    },

    getNotaClass(valor) {
      if (valor === null || valor === undefined || valor === '-' || valor === '') return '';
      const num = Number(valor);
      if (Number.isNaN(num)) return '';
      return num < 10 ? 'nota-red font-bold' : 'nota-blue font-bold';
    },

    // observação por classe (ex.: usar no template)
    termObservation(cl) {
      const table = this.termTables[cl];
      if (!table || !table.summary) return '-';
      return table.summary.observacao ?? '-';
    },
    obsClass(cl) {
      const table = this.termTables[cl];
      if (!table || !table.summary) return '';
      return table.summary.obsClass;
    },

    formatDataNascimento(dt) {
      if (!dt) return '—';
      try {
        return new Date(dt).toLocaleDateString();
      } catch { return dt; }
    },
    formatAno(dt) {
      if (!dt) return '—';
      try { return new Date(dt).getFullYear(); } catch { return '—'; }
    },

    editarAluno() {
      this.$router.push('/alunos/edit/' + this.$route.params.alunoId)
    },

    imprimirPDF() {
      const elemento = document.getElementById("conteudo-pdf");
      const opcoes = {
        margin: [5, 5, 5, 5],
        filename: "termo.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };
      html2pdf().set(opcoes).from(elemento).save();
    }
  },
  computed: {
    primeiraLancamentoAnoLetivo() {
      return this.certificado?.termos?.[0]?.ano_letivo ?? '—';
    }
  }
};
</script>


<style scoped>
span {
  /* font-weight: bold; */
}
.nivel-container {
  display: flex;
  flex-direction: column;
}
.linha {
  display: flex;
  gap: 20px;
}
.nivel {
  flex: 1;
  min-width: 0;
}
table {
  border-collapse: collapse;
  width: 98%;
  text-align: center;
}
table th,
table td {
  border: 1px solid #000;
}
table th {
  background: #f2f2f2;
}
.nota {
  color: red;
  /* font-weight: bold; */
}
.vazio table {
  background: #fafafa;
}

/* **** */
.dados p, .escola p {
  margin: 3px 0;
  font-size: 10pt;
}
/* span { font-weight: bold; } */
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
  font-size: 8pt !important;
}
table th {
  background: #f2f2f2;
}
.nota {
  color: red;
  /* font-weight: bold; */
}
.vazio table {
  background: #fafafa;
}

/* ** */
/* .bold {
  font-weight: bold;
} */

.as-input-line-1 {
  display: inline-block; border-bottom: 1px solid #000; width: 300px;
}

.as-input-line-2 {
  display: inline-block; border-bottom: 1px solid #000; width: 250px;
}

/* destaque cores para obs */
/* .text-primary { color: #0d6efd; font-weight: 700; } */
/* .text-danger { color: #dc3545; font-weight: 700; } */
.ps-2 { padding-left: 8px; }
/* .font-bold { font-weight: 700; } */

/* responsividade básica */
@media (max-width: 1200px) {
  .linha { flex-direction: column; }
}

/* cores das notas */
.nota-red {
  color: #dc3545; /* vermelho */
  /* font-weight: 700; */
}
.nota-blue {
  color: #0d6efd; /* azul bootstrap primary */
  /* font-weight: 700; */
}

.text-9 { font-size: 9pt !important;}
.text-10 { font-size: 10pt !important;}
.text-11 { font-size: 11pt !important;}
.text-12 { font-size: 12pt !important;}
.text-14 { font-size: 14pt !important;}
</style>
