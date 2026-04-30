<template>
  <!-- navbar -->
  <navbar/>

  <!-- sidebar -->
  <sidebar/>

  <div class="main-content" id="mainContent">
    <div class="container-fluid">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Horário da Turma</h2>
        </div>
        <div>
          <button class="btn btn-outline-secondary" @click="$router.back()">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </button>
        </div>
      </div>

      <!-- Tabela -->
      <div v-if="horarios.length == 0 && !loader" class="text-center py-3">
        Nenhum horario encontrado
        <div class="mt-4">
          <button class="btn btn-sm btn-primary" @click="criar_horairo">
            <i class="fas fa-plus me-2"></i> <span class="me-2">Criar</span>
          </button>
        </div>
      </div>
      <div v-if="loader">
        <Loader_1/>
      </div>

      <div v-if="horarios.length != 0" class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Turma</th>
              <th class="ps-5">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in horarios" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <div style="width: 500px;">
                  {{ item.turma.curso?.abreviatura || '' }} {{ item.turma.classe }}ª{{ item.turma.serie }} | {{ item.turma.turno }}  
                </div>
              </td>
              <td class="table-actions text-center">
                <div style="width: 200px; display: flex; justify-content: center;">
                    <button class="btn btn-sm btn-outline-primary" title="modelar" @click="modelarHorario(item)">
                      <i class="fas fa-edit"></i> modelar
                    </button>
                    <button class="btn btn-sm btn-outline-primary mx-2" title="Ver" @click="verHorario(item)">
                      <i class="fas fa-eye"></i>
                    </button>
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
      <!-- <nav v-if="links.length" class="mt-3">
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
      </nav> -->
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
      horarios: [],
      links: [],
      search: '',
      loader: false,
      form: {
        turma_id: '',
        ano_letivo: ''
      }
    }
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    async criar_horairo() {
      this.loader = true

      try {
        const payload = {
          turma_id: this.$route.params.turma_id,
          ano_letivo: this.$route.params.ano_letivo
        }

        const resp = await api.add('horarios/criar-horario', payload)

        if (resp?.horario) {
          const item = resp.horario // <- corrigido aqui

          const param = (v, fallback = 'nd') => (v === undefined || v === null || v === '' ? fallback : String(v))

          const ano_letivo  = param(item.ano_letivo, 'nd')
          const nome_curso  = param(item.turma?.curso?.nome, 'nd')
          const horario_id  = param(item.id, '0')
          const turma_id    = param(item.turma?.id, '0')
          const sala        = param(item.turma?.sala, 'sem-sala')
          const abreviatura = param(item.turma?.curso?.abreviatura, 'nd')
          const classe      = param(item.turma?.classe, 'nd')
          const serie       = param(item.turma?.serie, 'nd')
          const turno       = param(item.turma?.turno, 'nd')

          this.$router.push({
            name: 'horarios.edit',
            params: { ano_letivo, nome_curso, horario_id, abreviatura, turma_id, classe, serie, sala, turno }
          })

        } else {
          this.$toast.warning(resp.mensagem || 'Horário já existe para essa turma.')
        }

      } catch (error) {
        console.error('Erro ao criar horário:', error)
        this.$toast.error('Erro ao criar horário. Verifique os dados e tente novamente.')
      } finally {
        this.loader = false
      }
    },

    async fetchData() {
      this.loader = true
      const id = this.$route.params.turma_id

      try {
        const resp = await api.listar(`${request.horariosListar}/${id}`)

        if (!resp || resp.length === 0) {
          this.$toast.warning('Nenhum horário encontrado.')
          this.horarios = []
        } else {
          this.horarios = resp
        }

      } catch (error) {
        console.error('Erro ao buscar horários:', error)
        // this.$toast.error('Erro ao buscar horários. Verifique sua conexão ou tente novamente.')
        this.horarios = []
      } finally {
        this.loader = false
      }
    },

    modelarHorario(item) {
      const param = (v, fallback = 'nd') => (v === undefined || v === null || v === '' ? fallback : String(v))

      const ano_letivo  = param(item.ano_letivo, 'nd')
      const nome_curso  = param(item.turma?.curso?.nome, 'nd')
      const horario_id  = param(item.id, '0')
      const turma_id    = param(item.turma?.id, '0')
      const sala        = param(item.turma?.sala, 'sem-sala')
      const abreviatura = param(item.turma?.curso?.abreviatura, 'nd')
      const classe      = param(item.turma?.classe, 'nd')
      const serie       = param(item.turma?.serie, 'nd')
      const turno       = param(item.turma?.turno, 'nd')

      this.$router.push({
        name: 'horarios.edit',
        params: { ano_letivo, nome_curso, horario_id, abreviatura, turma_id, classe, serie, sala, turno }
      })
    },

    verHorario(item) {
      const param = (v, fallback = 'nd') => 
        (v === undefined || v === null || v === '' ? fallback : String(v))

        const ano_letivo   = param(item.ano_letivo, 'nd')
        const nome_curso   = param(item?.turma?.curso?.nome, 'nd')
        const horario_id   = param(item?.id, '0')
        const abreviatura  = param(item?.turma?.curso?.abreviatura, 'nd')
        const turma_id     = param(item?.turma?.id, '0')
        const classe       = param(item?.turma?.classe, 'nd')
        const serie        = param(item?.turma?.serie, 'nd')
        const sala         = param(item?.turma?.sala, 'sem-sala')
        const turno        = param(item?.turma?.turno, 'nd')

        this.$router.push({
          name: 'horarios.show',
          params: { 
            ano_letivo, 
            nome_curso, 
            horario_id, 
            abreviatura, 
            turma_id, 
            classe, 
            serie, 
            sala, 
            turno 
          }
        })
    },

    async confirmarExclusao(id) {
      if (confirm('Tem certeza que deseja excluir este curso?')) {
        try {
          await api.destroy(`horarios/destroy/${id}`)
          alert('Registo excluído com sucesso.')
          await this.fetchData()
        } catch (error) {
          alert('Erro ao excluir o curso.')
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
