<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

  <div>
    <!-- BOTOES DE AÇÃO (fora da area de impressão) -->
    <div class="actions-top d-print-none mb-3">
      <i class="fas fa-arrow-left me-2" style="font-size: 18px; position: relative; top: -2px; cursor: pointer;" @click="$router.back"></i>

      <!-- button class="btn btn-sm btn-primary me-2" @click="window.print()">
        <i class="fas fa-print"></i> Imprimir
      </button -->

      <button class="btn btn-sm btn-primary me-2" @click="exportPdf">
        <i class="fas fa-download"></i> Guardar
      </button>

      <button class="btn btn-sm btn-info me-2" @click="toggleExame">
        <i class="fas fa-eye"></i> {{ showExame ? 'Ocultar' : 'Mostrar' }} Exame
      </button>

      <button class="btn btn-sm btn-warning" @click="toggleRecurso">
        <i class="fas fa-eye"></i> {{ showRecurso ? 'Ocultar' : 'Mostrar' }} Recurso
      </button>
    </div>

    <!-- Área que será impressa / convertida em PDF -->
    <div ref="printArea" class="print-wrapper">
      <!-- Cabeçalho -->
      <header class="print-header">
        <div class="header-inner">
          <div class="logo-wrap">
            <!-- coloque aqui a src real do logo -->
            <img src="/assets/images/logo_saopio.jpg" alt="logo" class="logo" />
          </div>

          <div class="school-info">
            <h3>COMPLEXO ESCOLAR PÚBLICO - PRIVADO "SÃO PIO DA PIETRELCINA" - LUBANGO</h3>
            <div class="turma-info">
              <div class="left">
                <div><strong>Disciplina:</strong> {{ $route.params.disciplina_nome || '-' }}</div>
                <div><strong>Curso:</strong> {{ $route.params.nome_curso || '-' }}</div>
              </div>
              <div class="right">
                <div><strong>Classe:</strong> {{ $route.params.classe || '-' }}ª</div>
                <div><strong>Turma:</strong> {{ $route.params.turma_nome || $route.params.turma || '-' }}</div>
                <div><strong>Ano Lectivo:</strong> {{ $route.params.ano_letivo || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="container-print">
        <!-- TABELA (não responsiva para impressão) -->
        <div class="table-wrapper-print" ref="tableArea">
          <table class="table table-bordered table-print">
  <thead>
    <tr class="header-row-1">
      <th class="col-no" rowspan="2">Nº</th>
      <th class="col-nome" rowspan="2">Nome do Aluno</th>

      <template v-if="trimestres.primeiro">
        <th colspan="3" class="text-center">I TRIMESTRE</th>
      </template>
      <template v-if="trimestres.segundo">
        <th colspan="3" class="text-center">II TRIMESTRE</th>
      </template>
      <template v-if="trimestres.terceiro">
        <th colspan="3" class="text-center">III TRIMESTRE</th>
      </template>

      <th v-if="showExame" rowspan="2" class="text-center">Exame</th>
      <th v-if="showRecurso" rowspan="2" class="text-center">Recurso</th>
      <th rowspan="2" class="text-center col-mf">MF</th>
    </tr>

    <tr class="header-row-2">
      <!-- Apenas as colunas de notas -->
      <template v-if="trimestres.primeiro">
        <th class="text-center small-col">MAC</th>
        <th class="text-center small-col">NPT</th>
        <th class="text-center small-col">MT</th>
      </template>
      <template v-if="trimestres.segundo">
        <th class="text-center small-col">MAC</th>
        <th class="text-center small-col">NPT</th>
        <th class="text-center small-col">MT</th>
      </template>
      <template v-if="trimestres.terceiro">
        <th class="text-center small-col">MAC</th>
        <th class="text-center small-col">NPT</th>
        <th class="text-center small-col">MT</th>
      </template>
    </tr>
  </thead>

  <tbody>
    <tr v-for="(aluno, idx) in alunos" :key="aluno.id || idx">
      <td class="align-middle col-no">{{ aluno.numero ?? (idx+1) }}</td>
      <td class="col-nome align-middle">{{ aluno.nome || '' }}</td>

      <template v-if="trimestres.primeiro">
        <td class="text-center small-col">{{ formatValue(aluno.notas?.primeiro?.mac) }}</td>
        <td class="text-center small-col">{{ formatValue(aluno.notas?.primeiro?.npt) }}</td>
        <td class="text-center small-col" :class="mtClass(aluno.notas?.primeiro?.mt)">
          {{ formatValue(aluno.notas?.primeiro?.mt) }}
        </td>
      </template>

      <template v-if="trimestres.segundo">
        <td class="text-center small-col">{{ formatValue(aluno.notas?.segundo?.mac) }}</td>
        <td class="text-center small-col">{{ formatValue(aluno.notas?.segundo?.npt) }}</td>
        <td class="text-center small-col" :class="mtClass(aluno.notas?.segundo?.mt)">
          {{ formatValue(aluno.notas?.segundo?.mt) }}
        </td>
      </template>

      <template v-if="trimestres.terceiro">
        <td class="text-center small-col">{{ formatValue(aluno.notas?.terceiro?.mac) }}</td>
        <td class="text-center small-col">{{ formatValue(aluno.notas?.terceiro?.npt) }}</td>
        <td class="text-center small-col" :class="mtClass(aluno.notas?.terceiro?.mt)">
          {{ formatValue(aluno.notas?.terceiro?.mt) }}
        </td>
      </template>

      <td v-if="showExame" class="text-center small-col">{{ formatValue(aluno.exame) }}</td>
      <td v-if="showRecurso" class="text-center small-col">{{ formatValue(aluno.recurso) }}</td>

      <td class="text-center col-mf" :class="mfClass(aluno)">{{ calcularMediaFinal(aluno) }}</td>
    </tr>
  </tbody>
</table>

        </div>

        <!-- assinatura e estatísticas em linha -->
        <div class="bottom-row d-flex align-items-start mt-4">
          <div class="assinaturas">
            <div class="assin-block">
              <div class="line"></div>
              <div class="legend">O(A) Professor(a)</div>
            </div>
            <div class="assin-block mt-4">
              <div class="line"></div>
              <div class="legend">Direcção / Carimbo</div>
            </div>
          </div>

          <div class="estatisticas">
            <h6 class="mb-2">Estatísticas (Geral)</h6>
            <table class="table table-sm table-bordered small mb-0 stats-table">
              <thead>
                <tr>
                  <th></th>
                  <th class="text-center">Total</th>
                  <th class="text-center">Masculino</th>
                  <th class="text-center">Feminino</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Alunos Matriculados</strong></td>
                  <td class="text-center">{{ statistics?.totalMatriculados ?? 0 }}</td>
                  <td class="text-center">{{ statistics?.byGender?.M?.total ?? 0 }}</td>
                  <td class="text-center">{{ statistics?.byGender?.F?.total ?? 0 }}</td>
                </tr>
                <tr>
                  <td><strong>N.o Positivas (MF ≥ 10)</strong></td>
                  <td class="text-center">{{ statistics?.overall?.positivas ?? 0 }}</td>
                  <td class="text-center">{{ statistics?.byGender?.M?.positivas ?? 0 }}</td>
                  <td class="text-center">{{ statistics?.byGender?.F?.positivas ?? 0 }}</td>
                </tr>
                <tr>
                  <td><strong>N.o Negativas (MF &lt; 10)</strong></td>
                  <td class="text-center">{{ statistics?.overall?.negativas ?? 0 }}</td>
                  <td class="text-center">{{ statistics?.byGender?.M?.negativas ?? 0 }}</td>
                  <td class="text-center">{{ statistics?.byGender?.F?.negativas ?? 0 }}</td>
                </tr>
                <tr>
                  <td><strong>Percentagem Positiva</strong></td>
                  <td class="text-center">{{ (statistics?.overall?.percent ?? 0).toFixed(1) }}%</td>
                  <td class="text-center">{{ (statistics?.byGender?.M?.percent ?? 0).toFixed(1) }}%</td>
                  <td class="text-center">{{ (statistics?.byGender?.F?.percent ?? 0).toFixed(1) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div> <!-- /container-print -->
    </div> <!-- /printArea -->
  </div>

  </div>
</div>
</template>

<script>
/*
  Observações:
  - Assumo que instalaste jspdf e html2canvas via npm.
    import { jsPDF } from 'jspdf'  OR import jsPDF from 'jspdf' dependendo da versão.
  - Aqui uso import { jsPDF } from 'jspdf' em runtime e html2canvas default import.
*/
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../../api/api.js'
import * as request from '../../../api/request.js'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'MiniPautaPrint',
  components: { navbar, sidebar },

  data() {
    return {
      logoSrc: '/logo.png', // ajuste para o caminho real do logo no seu projeto
      trimestres: { primeiro: true, segundo: true, terceiro: true },
      alunos: [],
      loader: false,
      showExame: false,
      showRecurso: false
    }
  },

  created() {
    this.carregarMiniPautas()
  },

  computed: {
    statistics() {
      if (!this.alunos || !Array.isArray(this.alunos)) {
        return {
          totalMatriculados: 0,
          overall: { total: 0, positivas: 0, negativas: 0, percent: 0 },
          byGender: { M: { total: 0, positivas: 0, negativas: 0, percent: 0 }, F: { total: 0, positivas: 0, negativas: 0, percent: 0 } }
        }
      }

      const result = {
        totalMatriculados: 0,
        overall: { total: 0, positivas: 0, negativas: 0, percent: 0 },
        byGender: {
          M: { total: 0, positivas: 0, negativas: 0, percent: 0 },
          F: { total: 0, positivas: 0, negativas: 0, percent: 0 }
        }
      }

      const inferGenero = (a) => {
        const g = (a.genero || a.sexo || a.gender || '') + ''
        const up = g.trim().toUpperCase()
        if (up.startsWith('M') || up.includes('MASC')) return 'M'
        if (up.startsWith('F') || up.includes('FEM')) return 'F'
        return 'U'
      }

      for (const a of this.alunos) {
        result.totalMatriculados += 1
        const genero = inferGenero(a)
        const mfValue = a && a.notas ? Number(this.calcularMediaFinalRaw(a)) : NaN

        if (genero === 'M') result.byGender.M.total += 1
        if (genero === 'F') result.byGender.F.total += 1

        if (!Number.isNaN(mfValue)) {
          result.overall.total += 1
          if (mfValue >= 10) result.overall.positivas += 1
          else result.overall.negativas += 1
        }

        if (!Number.isNaN(mfValue) && genero === 'M') {
          if (mfValue >= 10) result.byGender.M.positivas += 1
          else result.byGender.M.negativas += 1
        }
        if (!Number.isNaN(mfValue) && genero === 'F') {
          if (mfValue >= 10) result.byGender.F.positivas += 1
          else result.byGender.F.negativas += 1
        }
      }

      result.overall.percent = result.overall.total ? (result.overall.positivas / result.overall.total) * 100 : 0
      result.byGender.M.percent = result.byGender.M.total ? (result.byGender.M.positivas / result.byGender.M.total) * 100 : 0
      result.byGender.F.percent = result.byGender.F.total ? (result.byGender.F.positivas / result.byGender.F.total) * 100 : 0

      return result
    }
  },

  methods: {
    toggleExame() { this.showExame = !this.showExame },
    toggleRecurso() { this.showRecurso = !this.showRecurso },

    async carregarMiniPautas() {
      this.loader = true
      try {
        const anoLetivo = encodeURIComponent(this.$route.params.ano_letivo || '')
        const resp = await api.listar(`${request.miniPautasListar}/${this.$route.params.turma_id || 'nd'}/${this.$route.params.disciplina_id || 'nd'}/${anoLetivo || 'nd'}`)
        let alunosResp = resp && resp.alunos ? resp.alunos : []
        if (!Array.isArray(alunosResp)) alunosResp = Object.values(alunosResp)

        const mapText = {1:'primeiro',2:'segundo',3:'terceiro'}
        this.alunos = alunosResp.map(a => {
          const aluno = JSON.parse(JSON.stringify(a))
          aluno.notas = aluno.notas || {}
          for (const k of [1,2,3]) {
            const text = mapText[k]
            const source = aluno.notas[k] ?? aluno.notas[text] ?? { mac:null, npt:null, mt:null }
            const mac = source.mac != null && source.mac !== '' ? Number(source.mac) : null
            const npt = source.npt != null && source.npt !== '' ? Number(source.npt) : null
            let mt = source.mt != null && source.mt !== '' ? Number(source.mt) : null
            if ((mt === null || Number.isNaN(mt)) && (mac !== null || npt !== null)) {
              const arr = [mac,npt].filter(x=>x!==null && !Number.isNaN(x))
              mt = arr.length ? Math.round(arr.reduce((s,x)=>s+x,0)/arr.length*10)/10 : null
            }
            aluno.notas[text] = { mac, npt, mt }
          }
          aluno.exame = aluno.exame != null && aluno.exame !== '' ? Number(aluno.exame) : null
          aluno.recurso = aluno.recurso != null && aluno.recurso !== '' ? Number(aluno.recurso) : null
          return aluno
        })
      } catch (e) {
        console.error('Erro ao carregar mini pautas', e)
        this.alunos = []
      } finally {
        this.loader = false
      }
    },

    formatValue(v) {
      if (v === null || v === undefined || v === '') return ''
      const n = Number(v)
      return Number.isNaN(n) ? '' : n.toFixed(1)
    },

    calcularMediaFinal(aluno) {
      const raw = this.calcularMediaFinalRaw(aluno)
      return Number.isNaN(raw) ? '' : raw.toFixed(1)
    },

    calcularMediaFinalRaw(aluno) {
      if (!aluno || !aluno.notas) return NaN
      const vals = ['primeiro','segundo','terceiro'].map(t=>aluno.notas[t]?.mt).filter(v=>v!=null && v!=='')
      if (!vals.length) return NaN
      const nums = vals.map(v=>Number(v)).filter(n=>!Number.isNaN(n))
      if (!nums.length) return NaN
      const media = Math.round(nums.reduce((s,x)=>s+x,0)/nums.length*10)/10
      return media
    },

    mtClass(mt) {
      if (mt == null || mt === '') return ''
      const n = Number(mt)
      if (Number.isNaN(n)) return ''
      return n < 10 ? 'nota-text-baixa' : 'nota-text-alta'
    },

    mfClass(aluno) {
      const raw = this.calcularMediaFinalRaw(aluno)
      if (Number.isNaN(raw)) return ''
      return raw < 10 ? 'nota-text-baixa' : 'nota-text-alta'
    },

    recarregarDados() {
      this.carregarMiniPautas()
    },

    async exportPdf() {
      // Exporta toda a área printArea (cabeçalho + tabela + assinaturas + estatísticas)
      const el = this.$refs.printArea
      if (!el) return
      try {
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'pt', 'a4')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 20
        const pdfWidth = pageWidth - margin * 2
        const imgProps = { width: canvas.width, height: canvas.height }
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width

        // se imagem maior que uma página, quebrar em páginas
        let position = margin
        let remainingHeight = imgHeight
        const ratio = imgProps.width / pdfWidth
        // add first
        pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, imgHeight)
        remainingHeight -= pageHeight - margin * 2
        // se precisar de páginas adicionais: desenha recortando segmentos do canvas
        if (remainingHeight > 0) {
          // criar canvas temporários para páginas adicionais
          const totalPages = Math.ceil(imgHeight / (pageHeight - margin * 2))
          for (let i = 1; i < totalPages; i++) {
            pdf.addPage()
            const y = -i * (pageHeight - margin * 2) * ratio
            // desenhar a mesma imagem deslocada verticalmente
            pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, imgHeight, undefined, 'FAST', y)
          }
        }

        pdf.save(`${this.$route.params.turma_id || 'pauta'}.pdf`)
      } catch (err) {
        console.error('Erro ao gerar PDF', err)
        alert('Erro ao gerar PDF. Verifique console.')
      }
    }
  }
}
</script>

<style scoped>
/* ações top (fora area de impressão) */
.actions-top { display:flex; gap:.5rem; align-items:center; }

/* Print wrapper */
.print-wrapper { background: #fff; padding: 8px; }

/* Cabeçalho (logo central + título) */
.print-header { padding: 6px 8px 12px;}
.header-inner { display:flex; align-items:center; gap:12px; justify-content:center; flex-direction:column; }
.logo-wrap { margin-top: -6px; }
.logo { width:72px; height:72px; display:block; margin: 0 auto 6px; border-radius: 50%; }

/* school info and turma info layout */
.school-info h3 { margin: 0; font-weight: 700; text-align:center; font-size:14px; letter-spacing:0.5px; }
.turma-info { display:flex; justify-content:space-between; width:100%; margin-top:6px; font-size:12px; gap:10px; }
.turma-info .left, .turma-info .right { width:50%; display:flex; flex-direction:column; }
.turma-info .right { align-items:flex-end; text-align:right; }

/* container and table */
.container-print { padding: 12px 6px 6px; }
.table-wrapper-print { overflow: visible; }
.table-print { width:100%; border-collapse: collapse; table-layout: fixed; font-size:12px; }
.table-print th, .table-print td { padding:6px; border:1px solid #000; vertical-align:middle; }

/* cores notas */
.nota-text-baixa { color:#d9534f; font-weight:600; }
.nota-text-alta { color:#0d6efd; font-weight:600; }

/* assinatura e estatisticas em linha */
.bottom-row { display:flex; gap:20px; justify-content:space-between; align-items:flex-start; padding-top:12px; }
.assinaturas { width:55%; }
.assin-block { margin-bottom:12px; }
.assin-block .line { height:1px; border-bottom:1px solid #000; width:320px; margin-bottom:6px; }
.assin-block .legend { font-size:12px; }

.estatisticas { width:40%; }
.stats-table th, .stats-table td { padding:6px; }

/* esconder elementos na impressão */
@media print {
  .actions-top { display:none !important; }
  body { background:#fff; }
}

/* responsivo */

.table-print {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto; /* permite largura automática das colunas */
}

.col-nome {
  max-width: auto;
  text-align: left;
  padding-left: 8px;
}

</style>
