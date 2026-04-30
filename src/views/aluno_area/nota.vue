<template>
  <navbar />
  <sidebar />

    <br><br><br><br>

  <div class="mb-3 px-3 mt-md-5">
    <button class="btn btn-outline-secondary me-2" @click="$router.back()">Voltar</button>
    <span style="font-weight: 700; font-size: 1.2rem; opacity: 0.8;">Minhas Notas</span>
  </div>

  <div class="px-3 mt-4">

    <!-- Loader discreto -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2">Carregando notas...</p>
    </div>

    <!-- LOOP DE ALUNOS -->
    <div v-else v-for="(aluno, aIdx) in alunos" :key="aIdx" class="animate-fadeInUp mb-5">

      <!-- header class="header-name mb-3 text-center">
        <p class="mb-1 text-custom">Minhas notas</p>
        <strong>{{ aluno.nome }}</strong>
      </header -->

      <!-- LOOP DE TRIMESTRES -->
      <div v-for="(tr, tIdx) in aluno.trimestres" :key="tIdx" class="mb-5">
        <p class="mb-2 text-custom">
          <div style="width: 32px; height: 32px; border-radius: 50%; display: inline-flex; justify-content: center; align-items: center; font-size: 18px;" class="bg-primary text-white">
            {{ tr.trimestre }}
          </div>
          <strong style="font-size: 18px; margin-left: 8px;">Trimestre</strong>
        </p>

        <div style="overflow-x:auto;">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th class="bg-secondary" style="opacity: 0.2;"></th>
                <th v-for="(disc, dIdx) in disciplinas" :key="dIdx">{{ disc }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="tipo in tiposSequence" :key="tipo">
                <td><strong>{{ tipo }}</strong></td>
                <td v-for="disc in disciplinas" :key="disc">
                  <span :class="valorClass(tr, disc, tipo)">
                    {{
                      tr.notasPorDisc.find(n => n.materia.toUpperCase() === disc.toUpperCase())?.valores[tipo] ?? "—"
                    }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar_aluno.vue'
import sidebar from '@/components/sidebar_aluno.vue'
import * as api from "../../api/api.js"

export default {
  components: { navbar, sidebar },

  data() {
    return {
      alunos: [],
      disciplinas: [],
      tiposSequence: ["MAC", "NPT", "MT"],
      loading: true, // ✅ loader 
    }
  },

  async mounted() {
    await this.loadBoletim()
  },

  methods: {
    async loadBoletim() {
      this.loading = true
      try {
        const json = await api.listar('alunos-consultar-notas')
        this.disciplinas = json.disciplinas || []

        this.alunos = (json.alunos || []).map(aluno => {
          const trimestres = (aluno.trimestres || [])
            .slice()
            .sort((a,b) => a.trimestre - b.trimestre)
            .map(tr => {
              const notasPorDisc = (tr.notas || []).map(n => {
                const valoresObj = {}
                this.tiposSequence.forEach((tipo, i) => {
                  if (tipo === "MT") {
                    valoresObj[tipo] = n.mt ?? "—"
                  } else {
                    valoresObj[tipo] = n.valores[i] ?? "—"
                  }
                })
                return {
                  materia: n.materia,
                  valores: valoresObj
                }
              })
              return {
                trimestre: tr.trimestre,
                notasPorDisc
              }
            })
          return {
            numero: aluno.numero,
            nome: aluno.nome,
            trimestres
          }
        })
      } catch(err) {
        console.error('Erro ao carregar boletim', err)
      } finally {
        this.loading = false
      }
    },

    valorClass(tr, disc, tipo) {
      const discObj = tr.notasPorDisc.find(n => n.materia.toUpperCase() === disc.toUpperCase())
      if (!discObj) return 'text-muted'
      const v = discObj.valores[tipo]
      const num = parseFloat(v)
      if (isNaN(num)) return 'text-muted'
      return num < 10 ? 'text-danger fw-bold' : 'text-primary fw-bold'
    }
  }
}
</script>

<style scoped>
.text-danger { color: red; }
.text-primary { color: blue; }
.header-name { text-align: center; margin-bottom: 10px; }
.text-custom { font-size: 12px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: center; }
tr:nth-child(even) { background-color: #f9f9f9; }
tr:hover { background-color: #f1f1f1; }
.animate-fadeInUp { animation: fadeInUp 0.35s ease both; }
@keyframes fadeInUp { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
