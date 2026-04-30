<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <Voltar/> 
          Direção/Administrativa/Funções
        </h4>
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
          <router-link to="/funcoes/create">
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Novo
            </button>
          </router-link>
        </div>
      </div>

      <!-- Tabela -->
      <div v-show="loader">
        <div class="text-center py-3">
          A Carregar...
        </div>
      </div>
      
      <div v-if="cargos.length === 0 && !loader">
        <div class="text-center py-3">
          Nenhuma função encontrada
        </div>
      </div>

      <div v-if="cargos.length > 0 && !loader" class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Função</th>
              <!-- <th>Escola</th> -->
              <th width="120" class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cargos" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.nome }}</td>
              <!-- <td>{{ item.escola?.nome ?? '---' }}</td> -->
              <td class="table-actions text-center">
                <div style="width: 200px;">
                  <!-- <router-link :to="`/funcoes/show/${item.id}`">
                    <button class="btn btn-sm btn-outline-primary" title="Ver">
                      <i class="fas fa-eye"></i>
                    </button>
                  </router-link> -->
                  <router-link :to="`/funcoes/edit/${item.id}`">
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
import Voltar from '@/components/voltar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'

export default {
  components: { navbar, sidebar, Voltar },

  data() {
    return {
      cargos: [],
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
    async fetchData(url = request.funcoesListar) {
      this.loader = true
      try {
        const params = this.search ? { search: this.search } : {}
        const resp = await api.listar(url, params)
        this.cargos = resp.data
        this.links = resp.links
        this.currentPage = resp.data.current_page
        this.perPage = resp.data.per_page
        this.loader = false
      } catch (error) {
        alert("Ocorreu um erro")
        this.loader = false
      } 
    },

    async confirmarExclusao(id) {
      if (confirm('Tem certeza que deseja excluir este cargo?')) {
        try {
          await api.destroy(`${request.funcoesDestroy}${id}`)
          alert('Registo excluído com sucesso.')
          await this.fetchData()
        } catch (error) {
          alert('Erro ao excluir o cargo.')
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
