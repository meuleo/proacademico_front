<template>
  <!-- navbar -->
  <navbar />

  <!-- sidebar -->
  <sidebar />

  <br><br><br>
  <div class="main-content mt-2 mt-md-5 p-3 px-0" id="mainContent">
    <div class="">
      <div class="row gy-3 animate-fadeInUp">
        <div class="col-12">
          <!-- Comunicados -->
          <div class="card mb-3 p-3 shadow Regular" style="border: none;">
            <div class="perfil-container">
              <img src="/assets/images/logo_saopio.jpg" class="perfil-img" alt="Logo">
              <div>
                <h5 class="mb-1">Escola São Pio da Pietrelcina</h5>  
                <p class="mb-0">
                  Olá <strong>{{ getPrimeiroUltimoNome($store.state.usuario?.nome_completo) }}</strong>
                  <span class="bg-success ms-1" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%;"></span>
                </p>
              </div>  
            </div>
          </div>
        </div>
        <!-- Left column: Comunicados e Atividades -->
        <div class="col-lg-8">
          <!-- Comunicados -->
          <div class="card mb-3 shadow Regular" style="border: none;">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Comunicados</h5>
            </div>
            <div class="card-body" style="min-height:150px">
              <Loader_1 v-if="loading.comunicados" />

              <div v-else>
                <div v-if="comunicados.length === 0" class="text-muted">Não há comunicados no momento.</div>

                <div v-for="(c, idx) in comunicados" :key="c.id || idx" class="mb-3 pb-2 border-bottom">
                  <div class="d-flex justify-content-between">
                    <h6 class="mb-1">{{ c.titulo || c.assunto || 'Comunicado' }}</h6>
                    <small class="text-muted">{{ formatDate(c.data || c.created_at) }}</small>
                  </div>
                  <p class="mb-1" v-html="shortText(c.mensagem || c.conteudo || c.texto, 280)"></p>
                  <div>
                    <router-link :to="`/comunicados/${c.id}`" class="router-link btn btn-sm btn-outline-primary">Ler mais</router-link>
                  </div>
                </div>

                <div class="text-end mt-2">
                  <router-link to="#" class="router-link btn btn-sm btn-link">Ver todos os comunicados</router-link>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right column: Materias de consulta e Quadro de Honra -->
        <div class="col-lg-4">
          <!-- Comunicados -->
          <div class="card mb-3 shadow Regular" style="border: none;">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Meu desempenho</h5>
            </div>
            <div class="card-body" style="min-height:150px">
                <canvas id="myPieChart"></canvas>
              <div class="text-center mt-3">
                <router-link to="/notas" class="router-link text-primary" style="font-size: 14px;">
        <i class="fas fa-book" aria-hidden="true"></i>
                   Minhas notas
                </router-link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar_aluno.vue'
import sidebar from '@/components/sidebar_aluno.vue'
import * as api from '../../api/api.js'
import Loader_1 from '@/components/loader_1.vue'
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default {
  components: { navbar, sidebar, Loader_1 },
  data() {
    return {
      chart: null,
      comunicados: [
      ],

      desempenho: 0,
      estadoDesempenho: '',
      chart: null,
      loading: {
        desempenho: false
      },

      recursos: [
        { id: 201, titulo: 'Guia de Matemática - Capítulo 3', tipo: 'PDF', url: '#' },
        { id: 202, titulo: 'Resumo: História de Angola', tipo: 'Documento', url: '#' },
        { id: 203, titulo: 'Exercícios resolvidos - Física', tipo: 'PDF', url: '#' }
      ],

      honra: [
        { id: 301, nome: 'Albertina Josefa Calunga', classe: '10A' },
        { id: 302, nome: 'Alberto Nazareno Lisboa Félix', classe: '11B' },
        { id: 303, nome: 'Amélia Chilombo Elías Catumbela', classe: '12C' }
      ],

      // campos para o calendário (apenas para estilo)
      calendarYear: new Date().getFullYear(),
      calendarMonth: new Date().getMonth(),

      loading: {
        comunicados: false,
        atividades: false,
        recursos: false,
        honra: false
      },
      error: null
    }
  },
  computed: {
    proximaEntregaDate() {
      if (!this.atividades.length) return '—'
      const sorted = [...this.atividades].sort((a,b) => new Date(a.prazo || a.data_entrega) - new Date(b.prazo || b.data_entrega))
      const d = sorted[0]?.prazo || sorted[0]?.data_entrega
      return d ? this.formatDate(d) : '—'
    },

    // computed simples para o calendário
    calendarMonthYear() {
      const d = new Date(this.calendarYear, this.calendarMonth)
      return d.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })
    },

    calendarDays() {
      const year = this.calendarYear
      const month = this.calendarMonth
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const today = new Date()
      const arr = []
      for (let i = 1; i <= daysInMonth; i++) {
        const dt = new Date(year, month, i)
        arr.push({
          key: `${year}-${month+1}-${i}`,
          label: i,
          date: dt.toISOString(),
          today: dt.toDateString() === today.toDateString(),
          inactive: false
        })
      }
      return arr
    }
  },
  mounted() {
    this.fetchDesempenho(); // busca o desempenho ao montar
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy(); // limpa o gráfico ao desmontar
    }
  },
  methods: {
    async fetchDesempenho() {
      this.loading.desempenho = true;
      try {
        const res = await api.listar('desempenho-geral'); // rota Laravel
        const aluno = res?.alunos?.[0];

        if (!aluno) return;

        this.desempenho = aluno.media_geral; // atribui valor da API

        // Calcula percentagem para definir estado
        const percentagem = (this.desempenho / 20) * 100;

        if (percentagem >= 85) this.estadoDesempenho = 'Excelente';
        else if (percentagem >= 70) this.estadoDesempenho = 'Bom';
        else if (percentagem >= 50) this.estadoDesempenho = 'Regular';
        else this.estadoDesempenho = 'Precisa melhorar';

        this.renderChart(); // renderiza o gráfico após ter o valor
      } catch (err) {
        console.error('Erro ao buscar desempenho', err);
      } finally {
        this.loading.desempenho = false;
      }
    },

    renderChart() {
      const ctx = document.getElementById("myPieChart").getContext("2d");
      const total = 20;
      const restante = total - this.desempenho;

      if (this.chart) this.chart.destroy(); // destrói gráfico anterior, se houver

      this.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: [`Desempenho ${this.desempenho}`],
          datasets: [
            {
              label: "Desempenho",
              data: [this.desempenho, restante],
              backgroundColor: [
                "rgba(0, 200, 0, 0.6)",   // verde
                "rgba(200, 0, 0, 0.6)"    // vermelho
              ],
              borderColor: [
                "rgba(0, 200, 0, 1)",
                "rgba(200, 0, 0, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${percentage}%`;
                }
              }
            }
          }
        }
      });
    },

    getPrimeiroUltimoNome(nome) {
      if (!nome) return '';
      const partes = nome.trim().split(/\s+/);
      if (partes.length === 1) return partes[0];
      return `${partes[0]} ${partes[partes.length - 1]}`;
    },

    async fetchComunicados() {
      this.loading.comunicados = true
      try {
        const res = await api.listar('comunicados', { params: { limit: 5 } })
        this.comunicados = res?.data || []
      } catch (err) {
        console.error('Erro ao carregar comunicados', err)
        this.error = 'Erro ao carregar comunicados'
      } finally { this.loading.comunicados = false }
    },

    async fetchAtividades() {
      this.loading.atividades = true
      try {
        const res = await api.listar('atividades', { params: { status: 'aberto', limit: 8 } })
        this.atividades = res?.data || []
      } catch (err) {
        console.error('Erro ao carregar atividades', err)
        this.error = 'Erro ao carregar atividades'
      } finally { this.loading.atividades = false }
    },

    async fetchRecursos() {
      this.loading.recursos = true
      try {
        const res = await api.listar('recursos', { params: { limit: 6 } })
        this.recursos = res?.data || []
      } catch (err) {
        console.error('Erro ao carregar recursos', err)
        this.error = 'Erro ao carregar recursos'
      } finally { this.loading.recursos = false }
    },

    async fetchHonra() {
      this.loading.honra = true
      try {
        const res = await api.listar('quadro_honra', { params: { limit: 6 } })
        this.honra = res?.data || []
      } catch (err) {
        console.error('Erro ao carregar quadro de honra', err)
        this.error = 'Erro ao carregar quadro de honra'
      } finally { this.loading.honra = false }
    },

    formatDate(iso) {
      if (!iso) return '—'
      try {
        const d = new Date(iso)
        return d.toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      } catch (e) { return iso }
    },

    shortText(txt = '', len = 120) {
      const s = String(txt || '')
      return s.length > len ? (s.slice(0, len).trim() + '...') : s
    },

    daysUntil(iso) {
      if (!iso) return ''
      try {
        const now = new Date()
        const then = new Date(iso)
        const diff = Math.ceil((then - now) / (1000 * 60 * 60 * 24))
        if (diff < 0) return 'Prazo expirado'
        if (diff === 0) return 'Entrega: hoje'
        return `Faltam ${diff} dia${diff > 1 ? 's' : ''}`
      } catch (e) { return '' }
    },

    initials(name = '') {
      return (String(name).split(' ').map(s => s[0]).slice(0,2).join('') || 'A').toUpperCase()
    }
  }
}
</script>

<style scoped>
.avatar{
  width:44px; height:44px; background:#e9ecef; color:#343a40; font-size:14px;
  border-radius:50%;
}
.card-header h5, .card-header h6{ margin:0 }

/* Logo com titulo do lado*/
.perfil-container {
    display: flex;
    align-items: center;        /* Alinha verticalmente */
    gap: 10px;                  /* Espaço entre img e texto */
}

.perfil-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;         /* Deixa redondo */
    object-fit: cover;          /* Evita distorção */
    background: #f0f0f0;
}

.animate-fadeInUp { animation: fadeInUp 0.35s ease both; }
@keyframes fadeInUp { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.router-link {
  text-decoration: none;
}
</style>
