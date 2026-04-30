<template>
  <!-- navbar -->
  <navbar/>

  <!-- sidebar -->
  <sidebar/>

  <div class="main-content" id="mainContent">
    <div class="container-fluid px-4">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4 mt-4">
        <div>
          <h4>
            <Voltar/> 
            Direção/Pedagógica/Professores
        </h4>
        </div>
        <div class="header-actions">
          <!-- Espaço para futuros botões -->
        </div>
      </div>

      <!-- Card Principal -->
      <div class="card teachers-card">
        <div class="card-body">
          <!-- Barra de Pesquisa e Filtros -->
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="input-group">
                <input
                  v-model="search"
                  @keyup.enter="fetchData()"
                  type="text"
                  class="form-control"
                  placeholder="Pesquisar por nome ou abrangência..."
                />
                <button class="btn btn-outline-secondary" @click="fetchData()">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-end">
              <!-- <router-link to="/funcionarios/create">
                <button class="btn btn-primary add-btn">
                  <i class="fas fa-plus me-2"></i>Adicionar Professor
                </button>
              </router-link> -->
            </div>
          </div>

          <!-- Loader -->
          <div v-show="loader" class="loader-container">
            <Loader_1/>
          </div>

          <!-- Mensagem de lista vazia -->
          <div v-if="funcionarios.length == 0 && !loader" class="empty-state text-center py-5">
            <i class="fas fa-user-graduate empty-icon"></i>
            <h3>Nenhum professor encontrado</h3>
            <p class="text-muted">Tente ajustar sua pesquisa ou filtros</p>
          </div>

          <!-- Lista de Professores -->
          <div v-if="funcionarios.length > 0 && !loader" class="teachers-list">
            <div class="row">
              <div class="col-md-6 col-lg-4 mb-4" v-for="item in funcionarios" :key="item.id">
                <div class="card p-4" style="cursor: pointer; display: flex; justify-content: center;" @click="verFuncionario(item.id)">
                  <div class="teacher-avatar shadow shadow-Regular mb-4 mx-auto">
                    {{ item.nome_completo.charAt(0).toUpperCase() }}
                  </div>
                  <div class="teacher-info text-center mt-">
                    <h5 class="teacher-name">{{ item.nome_completo }}</h5>
                    <div class="teacher-meta">
                      <span><i class="fas fa-phone-alt me-2"></i>{{ item.telefone || 'Não informado' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginação -->
          <nav v-if="links.length" class="mt-4">
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
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from "../../api/api.js"
import Loader_1 from '@/components/loader_1.vue'
import Voltar from '@/components/voltar.vue'

export default {
  components: { navbar, sidebar, Loader_1, Voltar },

  data() {
    return {
      funcionarios: [],
      links: [],
      currentPage: 1,
      perPage: 20,
      loader: false
    }
  },

  async created() {
    await this.fetchData('funcionarios-professores')
  },

  methods: {
    async fetchData(url) {
      if (!url) { return }

      this.loader = true

      try {
        const resp = await api.listar(url)
        this.funcionarios = resp.data
        this.links = resp.links
        this.currentPage = resp.current_page
        this.perPage = resp.per_page  
        this.loader = false
      } catch (error) {
        this.loader = false
        console.log("Ocorreu um erro")
      }
    },

    verFuncionario(id) {
      this.$router.push(`/area/professores/show/${id}`)
    },
  }
}
</script>

<style scoped>
/* Variáveis de cor */
/* :root {
  --primary-color: #4361ee;
  --primary-light: #eef2ff;
  --secondary-color: #3f37c9;
  --text-color: #2b2d42;
  --text-light: #8d99ae;
  --bg-color: #f8f9fa;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
} */

/* Estilos gerais */
.page-title {
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.8rem;
}

.teachers-card {
  border: none;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  margin-bottom: 2rem;
}

/* Barra de pesquisa */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  color: var(--text-light);
  z-index: 4;
}

.search-input {
  padding-left: 40px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  height: 46px;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.search-btn {
  margin-left: 10px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s;
}

.search-btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
}

.add-btn {
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s;
}

.add-btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
}

/* Cards de professores */
.teachers-list {
  margin-top: 1.5rem;
}

.teacher-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.teacher-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow);
  border-color: transparent;
}

.teacher-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 20px;
  flex-shrink: 0;
}

.teacher-info {
  flex-grow: 1;
}

.teacher-name {
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 5px;
}

.teacher-meta {
  color: var(--text-light);
  font-size: 0.9rem;
}

.teacher-meta i {
  width: 16px;
  text-align: center;
}

.teacher-actions .btn-view {
  background-color: var(--primary-light);
  color: var(--primary-color);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.teacher-actions .btn-view:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Estado vazio */
.empty-state {
  padding: 3rem 0;
}

.empty-icon {
  font-size: 3rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .teacher-card {
    flex-direction: column;
    text-align: center;
  }
  
  .teacher-avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .search-btn {
    width: 100%;
    margin-left: 0;
  }
}
</style>