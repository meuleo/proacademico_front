<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">

      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="page-title mb-0">
          <Voltar/> Direção/Pedagógica/Ano Lectivo
        </h4> 
      </div>

      <!-- Formulário -->
      <!-- Formulário -->
<div class="card p-4 shadow-sm">
  <form @submit.prevent="submitForm">
    <div class="row">
      <div class="col-md-9 mb-3">
        <label for="ano_letivo" class="form-label">Novo ano lectivo *</label>
        <select
          v-model="form.ano_letivo"
          class="form-select"
          id="ano_letivo"
          required
        >
          <option value="---">Nenhum</option>
          <option :value="`${new Date().getFullYear()}/${(new Date().getFullYear())+1}`" selected>{{ new Date().getFullYear() }}/{{ (new Date().getFullYear())+1 }}</option>
          <option v-for="ano in anosLetivos" :key="ano" :value="ano">
            {{ ano }}
          </option>
        </select>
      </div>
      <div class="col-md-3 mb-3">
        <label for="" class="invisible">...</label>
        <div class="pt-2">
          <button v-show="!loaderSave" type="submit" class="btn btn-primary col-md-12">
            <i class="fas fa-save me-2"></i> Guardar
          </button>
          <LoaderBtnGuardar v-show="loaderSave"/>
        </div>
      </div>
    </div>
  </form>
</div>

<!-- Tabela de listagem -->
<div class="card p-4 shadow-sm mt-4">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th>Ano Letivo</th>
        <th class="text-end">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(ano, index) in listaAnos" :key="ano.id">
        <td>{{ index + 1 }}</td>
        <td>{{ ano.ano_letivo }}</td>
        <td class="text-end">
          <button class="btn btn-danger btn-sm" @click="excluirAno(ano.id)">
            <i class="fas fa-trash"></i> Excluir
          </button>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="text-center">
          <div v-show="loader">
            A Carregar...
          </div>
        </td>
      </tr>
      <tr v-if="listaAnos.length == 0 && !loader">
        <td colspan="3" class="text-center">Nenhum ano letivo cadastrado.</td>
      </tr>
    </tbody>
  </table>
</div>

      
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import Voltar from '@/components/voltar.vue'

export default {
  components: { navbar, sidebar, LoaderBtnGuardar, Voltar },
  data() {
    return {
      form: {
        ano_letivo: '',
      },
      listaAnos: [],
      loader: false,
      loaderSave: false
    }
  },
  computed: {
    anosLetivos() {
      const anos = []
      const anoInicial = 2009
      const anoAtual = new Date().getFullYear()
      for (let ano = (anoAtual-1); ano > anoInicial; ano--) {
        anos.push(`${ano}/${ano + 1}`)
      }
      return anos
    }
  },
  methods: {
    async carregarAnos() {
      this.loader = true
      try {
        const response = await api.listar(request.anoLetivoListar)
        this.listaAnos = response ?? []
        this.loader = false
      } catch (error) {
        console.error('Erro ao carregar anos:', error)
        this.listaAnos = [] // evita erro no template
        this.loader = false
      }
    },
    
    async submitForm() {
    this.loaderSave = true
      try {
        await api.add(request.anoLetivoAdd, this.form)
        this.form.ano_letivo = ''
        this.carregarAnos()
        toast.success('Novo ano letivo registado');
        this.loaderSave = false
      } catch (error) {
        console.error('Erro ao adicionar:', error)
        toast.error('Ocorreu um erro');
        this.loaderSave = false
      }
    },
    async excluirAno(id) {
      if (confirm('Tem certeza que deseja excluir este ano letivo?')) {
        try {
          await api.destroy(`${request.anoLetivoDestroy}${id}`)
          this.carregarAnos()
          toast.success('Novo ano letivo registado');
        
        } catch (error) {
          console.error('Erro ao adicionar:', error)
          toast.error('Ocorreu um erro');
        }
      }
    }
  },
  mounted() {
    this.carregarAnos()
    this.form.ano_letivo = `${ new Date().getFullYear() }/${ (new Date().getFullYear())+1 }`
  }
}
</script>


<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
}
</style>