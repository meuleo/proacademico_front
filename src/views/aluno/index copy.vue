<template>
  <!-- navbar -->
  <navbar/>

  <!-- sidebar -->
  <sidebar/>

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-users me-2"></i>Alunos</h2>
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
              placeholder="Pesquisar por nome, email, telefone..."
            />
            <button class="btn btn-outline-secondary" @click="fetchData()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-6 mb-3 d-flex justify-content-md-end">
          <router-link to="/alunos/create">
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Novo
            </button>
          </router-link>
        </div>
      </div>

      <!-- Tabela -->
      <div v-if="alunos.length === 0">
        A carregar...
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome Completo</th>
              <th>Gênero</th>
              <th>Data de Nascimento</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="aluno in alunos" :key="aluno.id">
              <td>{{ aluno.id }}</td>
              <td>{{ aluno.nome_completo }}</td>
              <td>{{ aluno.genero }}</td>
              <td>{{ aluno.data_nascimento }}</td>
              <td>{{ aluno.email }}</td>
              <td>{{ aluno.telefone }}</td>
              <td>{{ aluno.cidade }}</td>
              <td class="table-actions text-center">
                <div style="width: 200px;">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    title="Ver"
                    @click="verAluno(aluno.id)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>

                  <button
                    class="btn btn-sm btn-outline-primary mx-2"
                    title="Editar"
                    @click="editarAluno(aluno.id)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>

                  <button
                    class="btn btn-sm btn-outline-danger"
                    title="Excluir"
                    @click="excluirAluno(aluno.id)"
                  >
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
import * as api from '../../api/api.js'
import * as resquest from '../../api/request.js'

export default {
  components: { navbar, sidebar },
  data() {
    return {
      alunos: [],
      links: [],
      search: '',
      currentPage: 1,
      perPage: 10
    }
  },
  async created() {
    await this.fetchData(resquest.alunosListar)
  },
  methods: {
    async fetchData(url = resquest.alunosListar) {
      const resp = await api.listar(url, { search: this.search })
      this.alunos = resp.data
      this.links = resp.links
      this.currentPage = resp.current_page
      this.perPage = resp.per_page
    },

    verAluno(id) {
      this.$router.push(`/alunos/show/${id}`)
    },

    editarAluno(id) {
      this.$router.push(`/alunos/edit/${id}`)
    },

    async excluirAluno(id) {
      if (confirm('Tem certeza que deseja excluir este aluno?')) {
        try {
          await api.destroy(`alunos/destroy/${id}`)
          alert('Aluno excluído com sucesso!')
          await this.fetchData()
        } catch (error) {
          console.error('Erro ao excluir aluno:', error)
          alert('Erro ao excluir aluno.')
        }
      }
    }
  }
}
</script>


<style scoped>
.pagination .page-link { cursor: pointer; }
</style>
