<template>
  <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <!-- Main Content -->
  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-user-shield me-2"></i>Gerenciar Permissões</h2>
        <button  @click="$router.back()" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <!-- Select de Regras -->
      <div v-show="loader">
        <Loader_1/>
      </div>

      <div v-show="!loader">
        <div class="mb-3">
          <label class="form-label">Selecione o Perfil</label>
          <select v-model="regraSelecionada" @change="carregarPermissoes" class="form-select">
            <option value="">-- Selecione --</option>
            <option v-for="r in regras" :key="r.id" :value="r.id" v-show="r.nome != 'aluno'">{{ r.nome }}</option>
          </select>
        </div>

        <!-- Tabela de Permissões -->
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Página</th>
                <th class="text-center">Ver</th>
                <th class="text-center">Criar</th>
                <th class="text-center">Editar</th>
                <th class="text-center">Excluir</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pagina in paginas" :key="pagina" v-show="!loader_permissao">
                <td>{{ pagina }}</td>
                <td class="text-center">
                  <input type="checkbox" class="cursor-pointer"
                    :value="'ver_' + pagina"
                    v-model="permissoesSelecionadas"
                    @change="(e) => togglePermissao('ver_' + pagina, e)">

                </td>
                <td class="text-center">
                  <input type="checkbox" class="cursor-pointer"
                    :value="'criar_' + pagina"
                     v-model="permissoesSelecionadas"
                    @change="(e) => togglePermissao('criar_' + pagina, e)">
                </td>
                <td class="text-center">
                  <input type="checkbox" class="cursor-pointer"
                    :value="'editar_' + pagina"
                     v-model="permissoesSelecionadas"
                    @change="(e) => togglePermissao('editar_' + pagina, e)">
                </td>
                <td class="text-center">
                  <input type="checkbox" class="cursor-pointer"
                    :value="'excluir_' + pagina"
                     v-model="permissoesSelecionadas"
                    @change="(e) => togglePermissao('excluir_' + pagina, e)">
                </td>
              </tr>
              <tr v-show="loader_permissao">
                <td colspan="5">
                  <Loader_2/>
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
import navbar from "@/components/navbar.vue";
import sidebar from "@/components/sidebar.vue";
import * as api from "../../../api/api.js";
import Loader_1 from "@/components/loader_1.vue";
import Loader_2 from "@/components/Loader_2.vue";

export default {
  components: { navbar, sidebar, Loader_1, Loader_2 },
  data() {
    return {
      regras: [],
      regraSelecionada: "",
      permissoes: [],
      paginas: [
        "director_geral",
        "director_pedagogico",
        "director_administrativo",
        "secretaria",
        "professor",
        "aluno",
        "curso",
        "turma",
        "configuracao",
        "comunicados",
      ],
      loader: false,
      loader_permissao: false,
      permissoesSelecionadas: []

    };
  },
  mounted() {
    this.carregarRegras();
  },
  methods: {
    async carregarRegras() {
      this.loader = true
      try {
        const resp = await api.listar("regras");
        this.regras = resp;
        this.loader = false
      } catch (error) {
        console.error("Erro ao carregar regras:", error);
        this.loader = false
      }
    },

    async carregarPermissoes() {
      if (!this.regraSelecionada) return;
      this.loader_permissao = true
      try {
        const resp = await api.listar(`regras/${this.regraSelecionada}/permissoes`);
        
        // Garante que vem array
        this.permissoes = Array.isArray(resp.permissoes) ? resp.permissoes : [];

        // Atualiza os checkboxes com os nomes já atribuídos
        this.permissoesSelecionadas = this.permissoes.map(p => p.nome);

        this.loader_permissao = false
      } catch (error) {
        console.error("Erro ao carregar permissões:", error);
        this.permissoes = [];
        this.permissoesSelecionadas = [];
        this.loader_permissao = false
      }
    },

    async togglePermissao(nome) {
      if (!this.regraSelecionada) {
        alert("Selecione um Perfil antes de alterar permissões.");
        return;
      }

      try {
        await api.add(`regras/${this.regraSelecionada}/permissoes/toggle`, { nome });
        // Recarrega direto da API -> força sincronização
        await this.carregarPermissoes();
      } catch (error) {
        console.error("Erro ao alterar permissão:", error);
        // Recarrega mesmo assim para não deixar marcado errado
        await this.carregarPermissoes();
      }
    }

    
  }
};
</script>

<style scoped>
.badge {
  font-size: 0.9rem;
  padding: 0.4rem 0.6rem;
}

.cursor-pointer {
  cursor: pointer;
}
</style>