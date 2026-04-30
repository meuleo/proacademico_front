<template>
  <navbar />
  <sidebar />

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>
            <Voltar/>
            Direção/Pedagógica/Turmas/Nova Turma
          </h4>
        </div>
      </div>

      <!-- Formulário -->
      <div v-if="loader" class="text-center p-5">
        A Carregar...
      </div>

      <div v-else class="card p-4 shadow-sm">
        <form @submit.prevent="submitForm">
          <div class="row">
           <div class="mb-3 col-md-6">
              <label for="ano_letivo" class="form-label">Ano Letivo *</label>
              <select name="" id="" class="form-control" v-model="form.ano_letivo" required>
                <option v-for="(item, index) in 5" :value="`${2025-index}/${2026-index}`" :key="index">
                  {{ `${2025-index}/${2026-index}` }}
                </option> 
              </select>
            </div>

            <div class="mb-3 col-md-6">
              <label for="bairro" class="form-label">Niveis de Ensino</label>
              <select name="" v-model="sub_sistema" class="form-select" id="sub_sistema" required>
                <option value="">Selecionar</option>
                <option value="0">Iniciação</option>
                <option value="1">Primário (1ª à 6ª)</option>
                <option value="2">I Ciclo (7ª,8ª,9ª)</option>
                <option value="3" v-if="$store.state.usuario.escola_id == 5">Secundário (10ª à 12ª)</option>
                <option value="3" v-else>Secundário (10ª à 13ª)</option>
              </select>
            </div>

            <div class="mb-3" v-show="sub_sistema == 3">
              <label for="curso_id" class="form-label">Curso *</label>
              <select v-model="form.curso_id" class="form-select" id="curso_id">
                <option value="" disabled selected>Selecione...</option>
                <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                  {{ curso.nome }}
                </option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="mb-3 col-md-4" v-show="sub_sistema != 0">
              <label for="classe" class="form-label">Classe *</label>
              <input type="number"  v-model="form.classe" class="form-control" id="classe">
            </div>

            <div class="mb-3 col-md-4">
              <label for="serie" class="form-label">Série *</label>
              <select v-model="form.serie" class="form-select" id="serie" required>
                <option value="" disabled selected>Selecione...</option>
                <option v-for="letra in series" :key="letra" :value="letra">
                  {{ letra }}
                </option>
              </select>
            </div>

            <div class="mb-3 col-md-4">
              <label for="turno" class="form-label">Periodo *</label>
              <select v-model="form.turno" class="form-select" id="turno" required>
                <option value="" disabled selected>Selecione...</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="mb-3 col-md-3">
              <label for="sala" class="form-label">Sala</label>
              <input v-model="form.sala" type="text" class="form-control" id="sala" />
            </div>
            <div class="mb-3 col-md-3">
              <label for="sala" class="form-label">Vagas</label>
              <input v-model="form.capacidade" type="number" class="form-control" id="sala" />
            </div>
            <div class="mb-3 col-md-6">
              <label for="sala" class="form-label">Director da turma</label>
              <select v-model="form.turma_funcionario_director_id" class="form-control">
                <option value="">Selecionar</option>
                <option v-for="item in professores" :key="item.id" :value="item.id">
                  {{ item.nome_completo }}
                </option>
              </select>
            </div>
          </div>

          <LoaderBtnGuardar v-if="loaderSave"/>
          <button v-else type="submit" class="btn btn-primary">
            <i class="fas fa-save me-2"></i>Guardar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import * as api from '../../api/api.js'
import * as request from '../../api/request.js'
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue'
import Voltar from '@/components/voltar.vue'

export default {
  components: { navbar, sidebar, LoaderBtnGuardar, Voltar },
  data() {
    return {
      cursos: [],
      series: Array.from({ length: 13 }, (_, i) => String.fromCharCode(65 + i)), // A-M
      professores: [],
      form: {
        curso_id: '',
        classe: '',
        serie: '',
        turno: '',
        ano_letivo: '',
        sala: '',
        turma_funcionario_director_id: '',
        capacidade: ''
      },
      sub_sistema: null,
      loader: false,
      loaderSave: false
    }

  },

  async created() {
    
    this.cursos = await api.listar(request.cursosListar).then(resp => resp.data)
    this.fetchProfessores()

    // alert(this.$store.state?.ano_letivo)

    this.form.ano_letivo = this.$store.state?.ano_letivo

  },

  methods: {
    async fetchProfessores() {
      this.loader = true
      try {
        const resp = await api.listar('funcionarios-professores-all')
        this.professores = resp        
        this.loader = false
        
      } catch (error) {
        this.loader = false
        
      }
      
    },

    async submitForm() {

      if(this.sub_sistema != 3) {
        this.form.curso_id = ""
        if(this.sub_sistema == 0) {
          this.form.classe = ""
        }

      } else {
        if(this.form.curso_id == "" || this.form.curso_id == "") {
          alert("Preencha todos os campos!")
        }
      }

      this.loaderSave = true
      
      try {
        await api.add(request.turmasAdd, this.form)
        alert('Turma cadastrada com sucesso!')
        this.loaderSave = false
        this.$router.push('/turmas')
        
      } catch (error) {
        this.loaderSave = false
        console.error(error)
      }
    }
  }
}
</script>


<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
}
</style>
