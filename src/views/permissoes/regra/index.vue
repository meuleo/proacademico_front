<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Perfis</h2>
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
              placeholder="Pesquisar por nome..."
            />
            <button class="btn btn-outline-secondary" @click="fetchData()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-6 mb-3 d-flex justify-content-md-end">
          <router-link to="/regras/create">
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Novo
            </button>
          </router-link>
        </div>
      </div>

      <!-- Tabela -->
      <div v-if="regras.length === 0">A carregar...</div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th width="120" class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in regras" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.nome }}</td>
              <td class="table-actions text-center">
                <div style="width: 200px;">
                  <router-link :to="`/regras/show/${item.id}`">
                    <button class="btn btn-sm btn-outline-primary" title="Ver">
                      <i class="fas fa-eye"></i>
                    </button>
                  </router-link>
                  <router-link :to="`/regras/edit/${item.id}`">
                    <button class="btn btn-sm btn-outline-primary mx-2" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                  </router-link>
                  <button class="btn btn-sm btn-outline-danger" title="Excluir" @click="confirmarExclusao(item.id)">
                    <i class="fas fa-trash"></i>
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
import * as api from '../../../api/api.js'
import * as request from '../../../api/request.js'

export default {
  components: { navbar, sidebar },

  data() {
    return {
      regras: [],
      links: [],
      currentPage: 1,
      perPage: 20,
      search: ''
    }
  },

  async created() {
    await this.fetchData()
  },

  methods: {
    async fetchData(url = request.regrasListar) {
      const params = this.search ? { search: this.search } : {}
      const resp = await api.listar(url, params)
      this.regras = resp.data
      this.links = resp.links
      this.currentPage = resp.data.current_page
      this.perPage = resp.data.per_page
    },

    async confirmarExclusao(id) {
      if (confirm('Tem certeza que deseja excluir?')) {
        try {
          await api.destroy(`regras/destroy/${id}`)
          alert('Excluído com sucesso.')
          await this.fetchData()
        } catch (error) {
          alert('Erro ao excluir.')
          console.error(error)
        }
      }
    }
  }
}
</script>

<style scoped>
.pagination .page-link { cursor: pointer; }
</style>
