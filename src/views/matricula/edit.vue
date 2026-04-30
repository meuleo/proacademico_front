<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4><Voltar/> Secretaria/Matriculas/Editar Matrícula</h4>
      </div>

       <div v-if="loader">
        <Loader_1/>
      </div>
      <div v-else>
        <div class="form-container bg-white p-4 rounded shadow-sm animate-fadeInUp">
          <form @submit.prevent="submitForm">
            <div class="row">
              <!-- Campos do Aluno -->
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

              <!-- Sub Sistema -->
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

            <div v-if="loader">Carregando...</div>

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
import Voltar from '@/components/voltar.vue';

export default {
  components: { navbar, sidebar, LoaderBtnGuardar, Loader_1, Voltar },
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
        encarregados: []
      },
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

  created() {
    this.obterAnoLetivoAtual()
  },

  mounted() {
    this.carregarMatricula();
    this.buscarCursos();
  },

  methods: {
    addCabecalho() {
      this.form.encarregados.push({ parentesco: '', nome: '', telefone: '' });
    },

    removeCabecalho(index) {
      this.form.encarregados.splice(index, 1);
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

    async carregarMatricula() {
      this.loader = true
      try {
        const id = this.$route.params.id;
        const m = await api.show(`${request.matriculasShow}${id}`);
        
        // Preenche os campos de forma segura e reativa
        // alert(m)
        this.form.escola_id = m.escola_id;
        this.form.nome_completo   = m.aluno.nome_completo;
        this.form.genero          = m.aluno.genero;
        this.form.data_nascimento = m.aluno.data_nascimento;
        this.form.bi              = m.aluno.bi;
        this.form.email           = m.aluno.email;
        this.form.telefone        = m.aluno.telefone;
        this.form.bairro          = m.aluno.bairro;

        this.form.pai          = m.aluno.pai;
        this.form.mae          = m.aluno.mae;
        this.form.naturalidade          = m.aluno.naturalidade;
        this.form.municipio          = m.aluno.municipio;
        this.form.provincia          = m.aluno.provincia; 

        this.form.curso_id        = m.turma.curso_id;
        this.form.classe          = m.turma.classe;
        this.classe_primario      = m.turma.classe;
        this.form.ano_letivo_primario = m.ano_letivo;
        this.form.ano_letivo      = m.ano_letivo;
        this.form.turma_id        = m.turma_id;

        this.turma_id = m.turma_id;

        this.form.encarregados= m.aluno.encarregados;

        // Caso encarregados venha como string JSON:
        if (typeof this.form.encarregados === 'string') {
          this.form.encarregados = JSON.parse(this.form.encarregados);
        }
        if (!this.form.encarregados || !Array.isArray(this.form.encarregados)) {
          this.form.encarregados = [];
        }

        // Opcional: carregar turmas já aqui
        await this.buscarTurmas_inicial(this.form.curso_id, this.form.ano_letivo, this.form.classe)

        this.verifica_sub_sistema(this.form.classe)
        
        this.loader = false
      } catch (error) {
        console.error('Erro ao carregar matrícula:', error);
        this.loader = false
      }
    },

    async submitForm() {
      this.loaderSave = true
      this.form.turma_id = this.turma_id

      try {
        const id = this.$route.params.id;
        this.form.turma_id = this.turma_id;

        await api.update(`${request.matriculasUpdate}${id}`, this.form);

        alert('Atualizado com sucesso!');
        this.loaderSave = false
        this.$router.push('/matriculas');
      } catch (error) {
        console.error('Erro ao atualizar:', error);
        this.loaderSave = false
      }
    },

    async buscarCursos() {
      try {
        const { data } = await api.listar(request.cursosListar);
        this.cursos = data;
      } catch (e) {
        console.error('Erro ao buscar cursos', e);
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

        verifica_sub_sistema(classe) {
          if(classe == null) {
            this.sub_sistema = 0
          } else if (classe == 10 || classe == 11 || classe == 12 || classe == 13) {
            this.sub_sistema = 3
          } else {
            this.sub_sistema = 1 ?? 2
          }
          
        },

        getTurmaId(id) {
          this.turma_id = id
        }
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
