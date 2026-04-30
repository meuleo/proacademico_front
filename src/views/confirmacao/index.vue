<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Confirmações</h2>
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
              placeholder="Pesquisar por nome ou abrangência..."
            />
            <button class="btn btn-outline-secondary" @click="fetchData()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-6 mb-3 d-flex justify-content-md-end">
          <router-link to="/confirmacoes/create">
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Novo
            </button>
          </router-link>
        </div>
      </div>

      <!-- Tabela -->
        <div v-show="loader">
            <Loader_1/>
        </div>
        
        <div class="text-center p-4" v-show="confirmacoes.length == 0 && !loader">
          <h5>Nenhuma matricula encontrada</h5>
        </div>

        <div v-show="confirmacoes.length > 0 && !loader" class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Ano Lectivo</th>
              <th>Data da Confirmação</th>
              <!-- <th>Escola</th> -->
              <th width="120" class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in confirmacoes" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.aluno.nome_completo }}</td>
              <td>
                <div style="background: #e1e1e1; padding: 5px 10px; border-radius: 8px;">
                  <span v-if="item.turma.curso">
                    {{ item.turma.curso.abreviatura }} 
                  </span>
                  <span class="ms-2" v-if="item.turma.classe">
                    {{ item.turma.classe }}ª Classe
                  </span>
                  <span v-else>
                    Iniciação
                  </span>
                   | {{ item.turma.serie }} | {{ item.turma.turno }}
                </div>
              </td>
              <td>{{ item.ano_letivo }}</td>
              <td>{{ item.created_at ?? "---" }}</td>
              <!-- <td>{{ item.escola?.nome ?? '---' }}</td> -->
              <td class="table-actions text-center">
                <div style="width: 200px;">
                  <!-- <router-link :to="`/confirmacoes/show/${item.id}`">
                    <button class="btn btn-sm btn-outline-primary" title="Ver">
                      <i class="fas fa-eye"></i>
                    </button>
                  </router-link> -->
                  <button class="btn btn-sm btn-outline-secondary" title="Excluir" @click="baixarFicha(item)">
                    <i class="fas fa-download"></i>
                  </button>
                  <router-link :to="`/confirmacoes/edit/${item.id}`">
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

            <br><br><br>

      <div id="ficha-confirmacao">
        <div class="text-center mb-3">
          <!-- <div class="text-center">
            logo
          </div> -->
          <div>
            {{escola.nome}}
          </div>
          <h5>Ficha de confirmação</h5>
        </div>
        <h5>Dados do Aluno</h5>
        <p>Nome: {{ confirmacao.aluno.nome_completo || ''}} </p>
        <p>Genero: {{ confirmacao.aluno.genero || ''}} </p>
        <p>Idade: {{ confirmacao.aluno.data_nascimento || ''}} </p>
        <p>Numedo de BI: {{ confirmacao.aluno.bi || ''}} </p>
        <p>Morada: {{ confirmacao.aluno.bairro || ''}}</p>
        <hr>
        <h5>Dados Académicos</h5>
        <p>Ano lectivo: {{ confirmacao.ano_letivo || ''}} </p>
        <p>Numero do Aluno: {{ confirmacao.num_aluno || ''}} </p>
        <p v-if="confirmacao.turma.curso">Curso: {{ confirmacao.turma.curso.nome || ''}} </p>
        <p v-if="confirmacao.turma.classe">Classe: {{ confirmacao.turma.classe || ''}} </p>
        <p v-else>Iniciação</p>
        <p>Turma: {{ confirmacao.turma.serie || ''}} </p>
        <p>Periodo: {{ confirmacao.turma.turno || ''}} </p>
        <p>Sala: {{ confirmacao.turma.sala || ''}}</p>
        <hr>
        <h5>Autenticação</h5>
        <p>Usuário: {{ confirmacao.aluno.nome_usuario || ''}} </p>
        <p>Senha: {{ confirmacao.aluno.senha || ''}} </p>
      </div>

    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import html2pdf from 'html2pdf.js';
import Loader_1 from '@/components/loader_1.vue';

export default {
  components: { navbar, sidebar, Loader_1 },

  data() {
    return {
      escola: [],
      confirmacoes: [],
      links: [],
      currentPage: 1,
      perPage: 20,
      search: '',
      confirmacao: {
        aluno: {
          nome_completo: "",
          genero: "",
          data_nascimento: "",
          bi: "",
          bairro: "",
          usuario: "",
          senha: ""
        },
        ano_letivo: "",
        num_aluno: null,
        turma: {
          curso: {
            nome: ""
          },
          classe: "",
          serie: "",
          turno: "",
          sala: ""
        }
      },
      loader: false
    }
  },

  async created() {
    this.getEscola()
    await this.fetchData()
  },

  methods: {
    async getEscola() {
      try {
       const resp = await api.getEscola()

        this.escola = resp
        // Garante que cabecalhos seja sempre um array
        if (!Array.isArray(resp.cabecalhos)) {
          this.cabecalhos.cabecalhos = []

          return
        }

        this.cabecalhos = resp.cabecalhos 
        
      } catch (error) {
        
      }

    },

    baixarFicha(item){
      this.confirmacao.num_aluno = null
      this.confirmacao = item

      if(this.confirmacao.num_aluno) {
        this.gerarPDF(item)
      } 
    },

    gerarPDF(item) {
      const element = document.getElementById('ficha-confirmacao');

      const opt = {
        margin:       [5, 5, 5, 5], // [top, right, bottom, left] em mm
        filename:     `confirmacao_${item.aluno.nome_completo}_${item.ano_letivo}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3 }, // aumenta a resolução
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    },

    async fetchData(url = request.confirmacoesListar) {
      this.loader = true
      try {
        const params = this.search ? { search: this.search } : {}
        const resp = await api.listar(url, params)
        this.confirmacoes = resp.data
        this.links = resp.links
        this.currentPage = resp.data.current_page
        this.perPage = resp.data.per_page

        this.loader = false

      } catch (error) {
        this.loader = false
        
      }
    },

    async confirmarExclusao(id) {
      if (confirm('Tem certeza que deseja excluir?')) {
        try {
          await api.destroy(`${request.confirmacoesDestroy}${id}`)
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
