<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Mini Pautas</h2>
      </div>

      <!-- Barra de Pesquisa -->
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="input-group">
            <input
              v-model="search"
              @keyup.enter="fetchData()"
              type="text"
              class="form-control"
              placeholder="Pesquisar disciplina..."
            />
            <button class="btn btn-outline-secondary" @click="fetchData()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-6 mb-3 d-flex justify-content-md-end">
          <!-- <router-link to="/mini-pautas/create">
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Novo
            </button>
          </router-link> -->
        </div>
      </div>

      <!-- Tabela -->
      <div v-show="loader">
        <Loader_1/>
      </div>

      <div v-if="miniPautas.length == 0 && !loader" class="text-center p-5">
        Nenhuma mini pauta encontrada
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Turma</th>
              <th>Disciplina</th>
              <th>Ano Letivo</th>
              <th width="120" class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in miniPautas" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <span v-if="item.turma.curso">
                  {{ item.turma.curso.abreviatura }} 
                </span>
                <span class="ms-2" v-if="item.turma.classe">
                  {{ item.turma.classe }} ª Classe
                </span>
                <span v-else>
                  Iniciação
                </span>
                  | {{ item.turma.serie }} | {{ item.turma.turno }}  
              </td>
              <td>{{ item.disciplina?.nome || '---' }}</td>
              <td>{{ item.ano_letivo }}</td>
              <td class="table-actions text-center">
                <div style="width: 200px;">
                  <button class="btn btn-sm btn-secondary mx-2" title="Editar" @click="editMiniPauta(item)">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <nav v-if="links.length" class="mt-3">
        <ul class="pagination">
          <li
            v-for="link in links"
            :key="link.label"
            class="page-item"
            :class="{ disabled: !link.url, active: link.active }"
          >
            <a href="#" class="page-link" v-html="link.label" @click.prevent="fetchData(link.url)"></a>
          </li>
        </ul>
      </nav>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import Loader_1 from '@/components/loader_1.vue'

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      miniPautas: [],
      links: [],
      currentPage: 1,
      perPage: 20,
      search: '',
      loader: false
    }
  },

  async created() {
    await this.fetchData()
  },

  methods: {
    async fetchData(url = `${request.miniPautasTodas}?turma=${this.$route.params.turma_id}` ) {
      this.loader = true
      try {
        const params = this.search ? { search: this.search } : {}
        const resp = await api.listar(url, params)
        this.miniPautas = resp.data
        this.links = resp.links || []
        this.currentPage = resp.data.current_page || 1
        this.perPage = resp.data.per_page || 20
        this.loader = false

      } catch (error) {
        this.loader = false
        
      }
    },

    editMiniPauta(item) {
      this.$router.push({
        name: "mini.pauta.edit",
        params: {
          disciplina_id: item.disciplina.id,
          ano_letivo: item.turma?.ano_letivo || "sem Ano letivo",
          nome_curso: item.turma?.curso?.nome || "nd",
          horario_id: 1,
          abreviatura: item.turma?.curso?.abreviatura || 'nd',
          turma_id: item.turma?.id || "nd",
          classe: item.turma?.classe || "nd",
          serie: item.turma?.serie || "nd",
          sala: item.turma?.sala || "sem Sala",
          turno: item.turma?.turno || "nd",
          disciplina_nome: item?.disciplina?.nome || "nd",
          disciplina_abreviatura: item?.disciplina?.abreviatura || "nd"
        }
      });
    },

    async confirmarExclusao(id) {
      if (confirm('Tem certeza que deseja excluir esta mini pauta?')) {
        try {
          await api.destroy(`${request.miniPautasDestroy}${id}`)
          alert('Mini pauta excluída com sucesso.')
          await this.fetchData()
        } catch (error) {
          alert('Erro ao excluir a mini pauta.')
          console.error(error)
        }
      }
    }
  }
}
</script>

<style scoped>
.pagination .page-link {
  cursor: pointer;
}
</style>