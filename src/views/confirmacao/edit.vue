<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Editar Confirmação</h2>
        <button class="btn btn-outline-secondary" @click="$router.back()">
          <i class="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      <div v-if="cursos.length == 0">
        <Loader_1/>
      </div>
      <div v-else>
        <div class="form-container bg-white p-4 rounded shadow-sm animate-fadeInUp">
          <form @submit.prevent="submitForm">
            <!-- Aluno já selecionado -->
            <div class="mb-3">
              <label class="form-label">Aluno Selecionado</label>
              <div class="alert alert-secondary">
                <strong>{{ aluno?.nome_completo }}</strong> - {{ aluno?.bi }}
              </div>
            </div>

            <!-- Dados da Confirmação -->
            <div class="mb-3">
              <label for="sub_sistema" class="form-label">Níveis de Ensino</label>
              <select v-model="sub_sistema" name="sub_sistema" class="form-select" id="sub_sistema" required>
                <option value="">Selecionar</option>
                <option value="0">Iniciação</option>
                <option value="1">Primário (1ª à 6ª)</option>
                <option value="2">I Ciclo (7ª à 9ª)</option>
                <option value="3">Secundrário (10ª à 13ª)</option>
              </select>
            </div>

            <!-- Buscar turmas para sub_sistema 0, 1, 2 -->
            <div v-if="sub_sistema == 0 || sub_sistema == 1 || sub_sistema == 2" class="px-2">
              <div class="py-3" style="border: 1px solid #d1d1d1; border-radius: 8px;">
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label class="form-label">Ano Letivo</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="ano_letivo_primario"
                      name="ano_letivo_primario"
                      placeholder="2024/2025"
                      :required="sub_sistema == 0 || sub_sistema == 1 || sub_sistema == 2"
                      :disabled="!(sub_sistema == 0 || sub_sistema == 1 || sub_sistema == 2)"
                    />
                  </div>

                  <div class="col-md-2 mb-3" :class="{ 'd-none': sub_sistema == 0 }">
                    <label class="form-label">Classe</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="classe_primario"
                      name="classe_primario"
                      :required="sub_sistema == 1 || sub_sistema == 2"
                      :disabled="sub_sistema == 0"
                    />
                  </div>

                  <div class="col-md-3 mb-3">
                    <div><label class="form-label invisible">Buscar</label></div>
                    <button type="button" class="btn btn-primary col-12" @click="buscarTurmas">Buscar</button>
                  </div>
                </div>

                <div>
                  <div class="row m-0">
                    <p><strong>Turmas</strong></p>

                    <div v-show="loaderTurmas" class="my-3">
                      Buscando turmas...
                    </div>

                    <div v-show="turmas.length == 0 && !loaderTurmas" class="my-3">
                      Nenhuma turma Encontrada
                    </div>

                    <div v-show="turmas.length > 0 && !loaderTurmas" class="col-md-6 mb-3" v-for="item in turmas" :key="item.id">
                      <div
                        @click="getTurmaId(item.id)"
                        :class="['p-1 px-2 turmas', { 'turma-ativa': turma_id === item.id }]"
                        style="margin-bottom: 2px; border-left: 2px solid yellow; border-right: 2px solid yellow; color: #e9e9e9;"
                      >
                        <i class="fas fa-building-columns me-2"></i>
                        <span v-if="item.curso">{{ item.curso.abreviatura }}</span>
                        <span v-if="item.classe">{{ item.classe }}º</span>
                        <span v-else>Iniciação</span>
                        {{ item.serie }} - {{ item.turno }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Buscar cursos para Ensino Médio -->
            <!-- <div v-if="sub_sistema == 3" class="mb-3">
              <input id="buscar_cursos" name="buscar_cursos" type="checkbox" @click="buscarCursos" class="me-1" />
              <label for="buscar_cursos" class="form-label">Buscar cursos</label>
            </div> -->

            <!-- <div v-if="loader">Carregando cursos...</div> -->

            <div v-if="cursos.length > 0 && sub_sistema == 3" class="px-2">
              <div class="py-3" style="border: 1px solid #d1d1d1; border-radius: 8px;">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Curso</label>
                    <select
                      v-model="form.curso_id"
                      name="curso_id"
                      class="form-select"
                      :required="sub_sistema == 3"
                      :disabled="sub_sistema != 3"
                    >
                      <option value="">Selecionar</option>
                      <option v-for="curso in cursos" :key="curso.id" :value="curso.id">{{ curso.nome }}</option>
                    </select>
                  </div>

                  <div class="col-md-3 mb-3">
                    <label class="form-label">Ano Letivo</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.ano_letivo"
                      name="ano_letivo"
                      placeholder="2024/2025"
                      :required="sub_sistema == 3"
                      :disabled="sub_sistema != 3"
                    />
                  </div>

                  <div class="col-md-2 mb-3">
                    <label class="form-label">Classe</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="form.classe"
                      name="classe"
                      :required="sub_sistema == 3"
                      :disabled="sub_sistema != 3"
                    />
                  </div>

                  <div class="col-md-3 mb-3">
                    <div><label class="form-label invisible">Buscar</label></div>
                    <button type="button" class="btn btn-primary col-12" @click="buscarTurmas">Buscar</button>
                  </div>
                </div>

                <div>
                  <div class="row m-0">
                    <p><strong>Turmas</strong></p>

                    <div v-show="loaderTurmas" class="my-3">
                      Buscando turmas...
                    </div>

                    <div v-show="turmas.length == 0 && !loaderTurmas" class="my-3">
                      Nenhuma turma Encontrada
                    </div>

                    <div v-show="turmas.length > 0 && !loaderTurmas" class="col-md-6 mb-3" v-for="item in turmas" :key="item.id">
                      <div
                        @click="getTurmaId(item.id)"
                        :class="['p-1 px-2 turmas', { 'turma-ativa': turma_id === item.id }]"
                        style="margin-bottom: 2px; border-left: 2px solid yellow; border-right: 2px solid yellow; color: #e9e9e9;"
                      >
                        <i class="fas fa-building-columns me-2"></i>
                        <span v-if="item.curso">{{ item.curso.abreviatura }}</span>
                        <span v-if="item.classe">{{ item.classe }}º</span>
                        <span v-else>Iniciação</span>
                        {{ item.serie }} - {{ item.turno }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Campo oculto para enviar turma_id corretamente -->
            <input type="hidden" name="turma_id" :value="turma_id"/>

              <!-- Botão -->
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
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import * as api from '../../api/api.js';
import * as request from '../../api/request.js';
import LoaderBtnGuardar from '@/components/loaderBtnGuardar.vue';
import Loader_1 from '@/components/loader_1.vue';

export default {
  components: { navbar, sidebar, LoaderBtnGuardar, Loader_1 },
  data() {
    return {
      form: {
        aluno_id: '',
        curso_id: '',
        turma_id: '',
        ano_letivo: '',
        classe: '',
        escola_id: '1',
      },
      id: this.$route.params.id,
      aluno: null,
      cursos: [],
      turmas: [],
      turma_id: null,
      sub_sistema: null,
      curso_id_primario: "",
      ano_letivo_primario: "",
      classe_primario: "",
      curso_temp: "",
      classe_temp: "", 
      loader: false,
      loaderTurmas: false,
      loaderSave: false
    };
  },
  methods: {
    async carregarConfirmacao() {
      try {
        const resp = await api.show(`${request.confirmacoesShow}${this.id}`);
        const data = resp;

        this.form = {
          aluno_id: data.aluno_id,
          curso_id: data.turma.curso_id,
          turma_id: data.turma_id,
          ano_letivo: data.ano_letivo,
          classe: data.turma.classe,
          escola_id: data.escola_id,
        };
        
        this.turma_id = this.form.turma_id

        this.aluno = data.aluno;
        
        await this.buscarTurmas_inicial(this.form.curso_id, this.form.ano_letivo, this.form.classe)

        this.verifica_sub_sistema(this.form.classe)

      } catch (error) {
        console.error('Erro ao carregar matrícula:', error);
      }
    },

    obterAnoLetivoAtual() {
      const anoAtual = new Date().getFullYear();
      const proximoAno = anoAtual + 1;
      this.form.ano_letivo = anoAtual + '/' + proximoAno
      this.ano_letivo_primario = this.form.ano_letivo
    },

    validarAnoLetivo(ano) {
      // Formato esperado: 2020/2021
      const regex = /^\d{4}\/\d{4}$/;
      return regex.test(ano);
    },

    async buscarCursos() {
      this.loader = true;
      try {
        const { data } = await api.listar(request.cursosListar);
        this.cursos = data;
      } catch (e) {
        console.error('Erro ao buscar cursos', e);
      } finally {
        this.loader = false;
      }
    },

    async buscarTurmas() {
          if(this.sub_sistema != 3) {
            this.form.curso_id = ""
            this.form.ano_letivo = this.ano_letivo_primario
            this.form.classe = this.classe_primario
            if(this.sub_sistema == 0) {
              this.form.classe = ""
            }
    
          } else {
            if (this.form.curso_id == "" || this.form.classe == "" || this.form.ano_letivo == "") {
              alert("Preencha todos os campos!")
              return;
            }
          }
    
          if (!this.validarAnoLetivo(this.form.ano_letivo)) {
            alert('Por favor, digite o Ano Letivo no formato correto: ex. 2020/2021');
            return;
          }
    
          this.loaderTurmas = true;
    
          try {
            const resp = await api.listar(`turmas/getTurmas?curso_id=${this.form.curso_id}&classe=${this.form.classe}&ano_letivo=${this.form.ano_letivo}`);
            this.turmas = resp;
          } catch (e) {
            this.turmas = [];
            console.error('Erro ao buscar turmas:', e);
          } finally {
              this.loaderTurmas = false;
              
          }
        },

        async buscarTurmas_inicial(curso_id, ano_letivo, classe) {   
          if(!classe) {
            classe = ""
          }

          if(!curso_id) {
            curso_id = ""
          }

          try {
            const resp = await api.listar(`turmas/getTurmas?curso_id=${curso_id}&classe=${classe}&ano_letivo=${ano_letivo}`);
            this.turmas = resp;
          } catch (e) {
            this.turmas = [];
            console.error('Erro ao buscar turmas:', e);
          } finally {
            this.loader = false;
          }
        },

        getTurmaId(id) {
          this.turma_id = id
        },

        verifica_sub_sistema(classe) {
          if(!classe) {
            this.sub_sistema = 0
          } else if (classe == 10 || classe == 11 || classe == 12 || classe == 13) {
            this.sub_sistema = 3
          } else {
            this.sub_sistema = 1 ?? 2
          }
          
        },
          
      async submitForm() {
        this.loaderSave = true
        try {
          await api.update(`${request.confirmacoesUpdate}${this.id}`, this.form);
          
          alert('confimação atualizada com sucesso!');
          this.loaderSave = false
          this.$router.push('/confirmacoes');
        
        } catch (error) {
          console.error('Erro ao atualizar confimação:', error);
          alert('Erro ao atualizar confimação.');
          this.loaderSave = false
        }
      },
    },
  
    created() {
      this.obterAnoLetivoAtual()
    },

    async mounted() {
      await this.carregarConfirmacao();
      this.buscarCursos();
    },
};
</script>

<style scoped>
.turmas {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
  cursor: pointer;
}

.turmas:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

.turma-ativa {
  border: 2px solid #0f0;
}
</style>