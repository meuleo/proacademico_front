<template>
  <navbar />
  <sidebar />

  <div class="main-content px-0">
    <div class="container-fluid0 col-md-10 mx-auto">
      <!-- Título e botão voltar -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="px-3">
          <h4 class="titulo-pagina">
            <Voltar/>
            Secretaria/Alunos/Editar Aluno
          </h4>
        </div>
      </div>

      <!-- Formulário -->
      <div v-show="loader">
        <Loader_1/>
      </div>
      <!-- Formulário -->
      <div v-show="!loader" class="form-container bg-white p-4 rounded shadow-sm animate-fadeInUp">
        <form @submit.prevent="submitForm">
          <div class="row">
          <div class="mb-3">
            <label for="nome_completo" class="form-label">Nome Completo</label>
            <input v-model="form.nome_completo" type="text" class="form-control" id="nome_completo" required>
          </div>

          <div class="mb-3 col-md-6">
            <label for="genero" class="form-label">Gênero</label>
            <select v-model="form.genero" class="form-select" id="genero">
              <option disabled value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
          </div>

          <div class="mb-3 col-md-6">
            <label for="data_nascimento" class="form-label">Data de Nascimento</label>
            <input v-model="form.data_nascimento" type="date" class="form-control" id="data_nascimento">
          </div>

          <div class="mb-3 col-md-6">
            <label for="naturalidade" class="form-label">Naturalidade</label>
            <input v-model="form.naturalidade" type="text" class="form-control" id="naturalidade">
          </div>

          <div class="mb-3 col-md-6">
            <label for="provincia" class="form-label">Província</label>
            <input v-model="form.provincia" type="text" class="form-control" id="provincia">
          </div>

          <div class="mb-3 col-md-6">
            <label for="municipio" class="form-label">Município</label>
            <input v-model="form.municipio" type="text" class="form-control" id="municipio">
          </div>

          <div class="mb-3 col-md-6">
            <label for="bi" class="form-label">BI</label>
            <input v-model="form.bi" type="text" class="form-control" id="bi">
          </div>

          <hr>

          <div class="mb-3 col-md-6">
            <label for="pai" class="form-label">Pai</label>
            <input v-model="form.pai" type="text" class="form-control" id="pai">
          </div>

          <div class="mb-3 col-md-6">
            <label for="mae" class="form-label">Mãe</label>
            <input v-model="form.mae" type="text" class="form-control" id="mae">
          </div>

          <hr>

          <div class="mb-3 col-md-6">
            <label for="email" class="form-label">E-mail</label>
            <input v-model="form.email" type="email" class="form-control" id="email">
          </div>

          <div class="mb-3 col-md-6">
            <label for="telefone" class="form-label">Telefone</label>
            <input v-model="form.telefone" type="text" class="form-control" id="telefone">
          </div>

          <div class="mb-3 col-md-6">
            <label for="bairro" class="form-label">Bairro</label>
            <input v-model="form.bairro" type="text" class="form-control" id="bairro">
          </div>

          <hr>

          <div class="col-md-6 mb-6">
              <div>
                <label class="form-label">Encarregados</label>
              </div>
              
              <div v-for="(item, index) in form.encarregados" :key="index" class="input-group mb-2">
                <select class="form-select" v-model="item.parentesco">
                  <option disabled value="">Grau Parentesco</option>
                  <option value="Pai">Pai</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Avo Paterno">Avô Paterno</option>
                  <option value="Avo Materna">Avó Materna</option>
                  <option value="Tio">Tio</option>
                  <option value="Tia">Tia</option>
                  <option value="Irmão">Irmão</option>
                  <option value="Irmã">Irmã</option>
                  <option value="Primo">Primo</option>
                  <option value="Prima">Prima</option>
                </select>

                <input type="text" class="form-control" v-model="item.nome" placeholder="Nome do Encarregado" />
                <input type="text" class="form-control" v-model="item.telefone" placeholder="Telefone" />

                <div class="btn btn-danger" @click="removeCabecalho(index)">
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>

              <div type="button" class="btn btn-sm btn-primary mt-2 mb-3" @click="addCabecalho">
                <i class="fas fa-plus me-1"></i> Adicionar encarregado
              </div>
            </div>

            <hr>

            <div class="mb-3 col-md-12">
              <label for="" class="text-muted">Usuário</label>
              <h4 class="text-muted">{{form.nome_usuario}}</h4>
            </div>


            <div class="mb-3 col-md-6" v-show="!alterarSenha" @click="mostrarAlterarSenha">
              <button type="button" class="btn btn-warning">
                Alterar Senha
              </button> 
            </div>

            
            <div class="mb-3 m-md-0 col-md-6" v-show="alterarSenha">
              <label for="senha" class="form-label">Nova Senha</label>
              <input v-model="novaSenha" type="password" class="form-control" id="senha">
            </div>
            <div class="mb-3 m-md-0 col-md-6" v-show="alterarSenha">
              <label for="senha" class="form-label">Confirmar Senha</label>
              <input v-model="senha_confirmar" type="password" class="form-control" id="senha">
            </div>
             <div v-show="alterarSenha" class="mb-3 mt-2">
              <span class="text-muted" style="cursor: pointer;" @click="mostrarAlterarSenha">Cancelar</span>
            </div>

        </div>
        <div v-if="loaderSave" class="px-3 mt-2">
          <LoaderBtnGuardar/>
        </div>
        <div v-else class="px-3 mt-2">
          <button type="submit" class="btn btn-primary mt-3">Guardar</button>
        </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from "../../api/api.js"
import * as request from "../../api/request.js"
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import Voltar from '@/components/voltar.vue'
import Loader_1 from '@/components/loader_1.vue'

export default {
  components: {
    navbar,
    sidebar,
    LoaderBtnGuardar,
    Loader_1,
    Voltar
  },
  data() {
    return {
      form: {
        escola_id: 1,
        nome_completo: '',
        genero: '',
        data_nascimento: '',
        bi: '',
        bi_emissao: '',
        email: '',
        telefone: '',
        pai: '',
        mae: '',
        naturalidade: '',
        municipio: '',
        provincia: '',
        bairro: '',
        senha: '',
        nome_usuario: '',
        encarregados: []
      },
      alterarSenha: false,
      novaSenha: '',
      senha_confirmar: '',
      loader: false,
      loaderSave: false

    }
  },
  methods: {
    mostrarAlterarSenha() {
      this.alterarSenha = !this.alterarSenha
    },

    addCabecalho() {
      this.form.encarregados.push({ parentesco: '', nome: '', telefone: '' });
    },
    removeCabecalho(index) {
      this.form.encarregados.splice(index, 1);
    },
    async loadAluno() {
      this.loader = true
      try {
        const id = this.$route.params.id;
        const response = await api.show(`${request.alunosShow}${id}`)
        this.form = response;
        // Caso encarregados venha como string JSON:
        if (typeof this.form.encarregados === 'string') {
          this.form.encarregados = JSON.parse(this.form.encarregados);
        }
        if (!this.form.encarregados || !Array.isArray(this.form.encarregados)) {
          this.form.encarregados = [];
        }
        this.loader = false
      } catch (error) {
        console.error('Erro ao carregar dados:', error.response?.data || error.message);
        this.loader = false
      }
    },
    async submitForm() {
      if(this.alterarSenha) {
        if(!this.novaSenha) {
          alert('A senha não pode ser vazia')
          return

        } 
        else if(this.novaSenha != this.senha_confirmar) {
          alert('As Senhas são diferentes')
          return

        } else {
          this.form.senha = this.novaSenha

        }
      }

      this.loaderSave = true
      try {
        const id = this.$route.params.id;
        const response = await api.update(`${request.alunosUpdate}${id}`, this.form); // PATCH ou PUT
        alert('Registo do Aluno Editado\n----------------------------\nUsuário: ' + response.usuario + '\nSenha: ' + response.senha);
        this.$router.push("/alunos");
        this.loaderSave = false
      } catch (error) {
        console.error('Erro ao atualizar:', error.response?.data || error.message);
        this.loaderSave = false
      }
    },
  },
  mounted() {
    this.loadAluno();
  }
}
</script>

<style scoped>
.turmas {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
}
.turmas:hover {
  transform: scale(102%);
  transition: transform 0.3s ease;
}
</style>
