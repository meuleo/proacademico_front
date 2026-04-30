import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store' // caminho para sua store

// importações estáticas
import HomeView from '../views/homeView.vue'

import inicioView from '../views/inicioView.vue'

import LoginView from '@/views/loginView.vue'

import PerfilEdit from '@/views/perfil/edit.vue'

import AcessoRestritoView from '@/views/AcessoRestritoView.vue'

// Escola-
import EscolaEdit from '../views/escola/edit.vue'

// Funcionário
import FuncionarioIndex from '../views/funcionario/index.vue'
import FuncionarioCreate from '../views/funcionario/create.vue'
import FuncionarioEdit from '../views/funcionario/edit.vue'
import FuncionarioShow from '../views/funcionario/show.vue'

// Ano Letivo
import AnoLetivoIndex from '../views/ano_letivo/index.vue'
import AnoLetivoCreate from '../views/ano_letivo/create.vue'
import AnoLetivoEdit from '../views/ano_letivo/edit.vue'

import ProfessorIndex from '../views/professor/index.vue'
import ProfessorShow from '../views/professor/show.vue'

// Aluno
import AlunoIndex from '../views/aluno/index.vue'
import AlunoCreate from '../views/aluno/create.vue'
import AlunoEdit from '../views/aluno/edit.vue'
import AlunoShow from '../views/aluno/show.vue'

// Funções
import FuncaoIndex from '../views/funcao/index.vue'
import FuncaoCreate from '../views/funcao/create.vue'
import FuncaoEdit from '../views/funcao/edit.vue'
import FuncaoShow from '../views/funcao/show.vue'

// Disciplinas
import DisciplinaIndex from '../views/disciplina/index.vue'
import DisciplinaCreate from '../views/disciplina/create.vue'
import DisciplinaEdit from '../views/disciplina/edit.vue'
import DisciplinaShow from '../views/disciplina/show.vue'

// Cursos
import CursoIndex from '../views/curso/index.vue'
import CursoCreate from '../views/curso/create.vue'
import CursoEdit from '../views/curso/edit.vue'
import CursoShow from '../views/curso/show.vue'

// Coordenações
import CoordenacaoIndex from '../views/coordenacao/index.vue'
import CoordenacaoCreate from '../views/coordenacao/create.vue'

// Turmas
import TurmaIndex from '../views/turma/index.vue'
import TurmaCreate from '../views/turma/create.vue'
import TurmaShow from '../views/turma/show.vue'
import TurmaEdit from '../views/turma/edit.vue'
import TurmaAlunos from '../views/turma/turma_alunos.vue'
import TurmaAlunosDesempenho from '../views/turma/turma_alunos_desempenho.vue'
import AddAlunoTurma from '../views/turma/addAlunoTurma.vue'

import TurmaSecretariaIndex from '../views/turma_secretaria/index.vue'
import TurmaSecretariaShow from '../views/turma_secretaria/show.vue'

// Matrículas
import MatriculaIndex from '../views/matricula/index.vue'
import MatriculaCreate from '../views/matricula/create.vue'
import MatriculaShow from '../views/matricula/show.vue'
import MatriculaEdit from '../views/matricula/edit.vue'

// Confirmações
import ConfirmacaoIndex from '../views/confirmacao/index.vue'
import ConfirmacaoCreate from '../views/confirmacao/create.vue'
import ConfirmacaoShow from '../views/confirmacao/show.vue'
import ConfirmacaoEdit from '../views/confirmacao/edit.vue'

// Horario
import HorarioIndex from '../views/horario/index.vue'
import HorarioShow from '../views/horario/show.vue'
import HorarioEdit from '../views/horario/edit.vue'

// Mini Pautas Pedagogico e secretaria
import MiniPautaIndex from '../views/mini_pauta/index.vue'
import MiniPautaEdit from '../views/mini_pauta/edit.vue'
import MiniPautaShow from '../views/mini_pauta/show.vue'

// Atribuir Professor a turma
import AtribuirProfessorCreate from '../views/atribuir_professor/create.vue'

// Horario Professor
import HorarioProfessor from '../views/professor_area/horario_professor.vue'

// Disciplinas Professor
import TurmaProfessorIndex from '../views/professor_area/turma.vue'

// Mini Pauta Professor
import MiniPautaProfessorEdit from '../views/professor_area/mini_pauta/edit.vue'
import MiniPautaProfessorShow from '../views/professor_area/mini_pauta/show.vue'

// Pauta Geral
import PautaTestehow from '../views/pauta/teste_show.vue'
import PautaSaopioShow from '../views/pauta/sao_pio_show.vue'
import PautaDopsaShow from '../views/pauta/dopsa_show.vue'

// Boletim
import BoletimIndex from '../views/boletim/index.vue'
import BoletimShow from '../views/boletim/show.vue'

// Declaracao
import DeclaracaoIndex from '../views/declaracao/index.vue'
import DeclaracaoEdit from '../views/declaracao/edit.vue'
import DeclaracaoShow from '../views/declaracao/show.vue'

// Termo
import TermoIndex from '../views/termo/index.vue'
import TermoCreate from '../views/termo/create.vue'
import TermoCriarTermo from '../views/termo/criar_termo.vue'
import TermoEditarTermo from '../views/termo/editar_termo.vue'
import termoAutomatico from '../views/termo/termoAutomatico.vue'

// Termo Modelos
// Teste
import TermoTesteNivel1 from '../views/termo/modelo/teste/teste_nivel1.vue'
import TermoTesteNivel2_simples from '../views/termo/modelo/teste/teste_nivel2.vue'
import TermoTesteNivel2_agrupado from '../views/termo/modelo/teste/teste_nivel2_agrupado.vue'
import TermoTesteNivel3 from '../views/termo/modelo/teste/teste_nivel3.vue'

// Dopsa
import TermoDopsaNivel1 from '../views/termo/modelo/dopsa/dopsa_nivel1.vue'
import TermoDopsaNivel2 from '../views/termo/modelo/dopsa/dopsa_nivel2.vue'
import TermoDopsaNivel3 from '../views/termo/modelo/dopsa/dopsa_nivel3.vue'

// Saopio
import TermoSaopioNivel3 from '../views/termo/modelo/saopio/saopio_nivel3.vue'

// Certificados
import CertificadoIndex from '../views/certificado/index.vue'
import CertificadoCreate from '../views/certificado/create.vue'
// import CertificadoDopsaNivel1 from '../views/certificado/modelo/dopsa_nivel1.vue'

// Certificados modelos
import CertificadoTesteNivel2 from '../views/certificado/modelo/teste/teste_nivel2.vue'
import CertificadoTesteNivel3 from '../views/certificado/modelo/teste/teste_nivel3.vue'


//* Aluno Area
import AlunoAreaInicio from '../views/aluno_area/inicio.vue'
import AlunoAreaNota from '../views/aluno_area/nota.vue'
import HorarioAlunoShow from '../views/aluno_area/horario.vue'

// **Permissões
// Regras
import RegraIndex from '../views/permissoes/regra/index.vue'
import RegraCreate from '../views/permissoes/regra/create.vue'
import RegraEdit from '../views/permissoes/regra/edit.vue'
import RegraShow from '../views/permissoes/regra/show.vue'

// Regra de usuarios
import RegraUsuarioIndex from '../views/permissoes/regraUsuario/index.vue'
import RegraUsuarioCreate from '../views/permissoes/regraUsuario/create.vue'
import RegraUsuarioEdit from '../views/permissoes/regraUsuario/edit.vue'
import RegraUsuarioShow from '../views/permissoes/regraUsuario/show.vue'

// Permissões
import PermissaoIndex from '../views/permissoes/permissao/index.vue'
import PermissaoCreate from '../views/permissoes/permissao/create.vue'
import PermissaoEdit from '../views/permissoes/permissao/edit.vue'
import PermissaoShow from '../views/permissoes/permissao/show.vue'

// Regra de Permissões
import RegraPermissaoIndex from '../views/permissoes/regraPermissao/index.vue'
import RegraPermissaoCreate from '../views/permissoes/regraPermissao/create.vue'
import RegraPermissaoEdit from '../views/permissoes/regraPermissao/edit.vue'
import RegraPermissaoShow from '../views/permissoes/regraPermissao/show.vue'

const routes = [
  // { path: '/', name: 'home', component: HomeView },

  { path: '/', name: 'login.page', component: LoginView },
  
  { path: '/login', name: 'login', component: LoginView },

  { path: '/acesso-negado', name: 'acesso.restrito', component: AcessoRestritoView },

  { path: '/painel-geral', name: 'painel.geral', component: inicioView,   meta: { permissao: 'ver_painel_geral' } },
  
  //Aluno Area
  { path: '/painel-aluno', name: 'painel.aluno', component: AlunoAreaInicio },
  { path: '/notas', name: 'aluno.nota', component: AlunoAreaNota },
  {
    path: '/horario/:ano_letivo/:nome_curso/:horario_id/:abreviatura/:turma_id/:classe/:serie/:sala/:turno',
    name: 'horario.aluno',
    component: HorarioAlunoShow
  },


  { path: '/escola/config', name: 'escola.config', component: EscolaEdit, meta: { permissao: 'ver_configuracao' } },
  { path: '/perfil', name: 'perfil', component: PerfilEdit, meta: { permissao: 'ver_painel_geral' } },

  // Ano Letivo
  { path: '/anos-letivos', name: 'ano.letivo', component: AnoLetivoIndex },
  { path: '/anos-letivos/create', name: 'ano.letivo.create', component: AnoLetivoCreate },
  { path: '/anos-letivos/edit/:id', name: 'ano.letivo.edit', component: AnoLetivoEdit },

  // Funcionários
  { path: '/funcionarios', name: 'funcionarios', component: FuncionarioIndex },
  { path: '/funcionarios/create', name: 'funcionarios.create', component: FuncionarioCreate },
  { path: '/funcionarios/edit/:id', name: 'funcionarios.edit', component: FuncionarioEdit },
  { path: '/funcionarios/show/:id', name: 'funcionarios.show', component: FuncionarioShow },

  // Alunos
  { path: '/alunos', name: 'alunos', component: AlunoIndex },
  { path: '/alunos/create', name: 'alunos.create', component: AlunoCreate },
  { path: '/alunos/edit/:id', name: 'alunos.edit', component: AlunoEdit },
  { path: '/alunos/show/:id', name: 'alunos.show', component: AlunoShow },

  // Funções
  { path: '/funcoes', name: 'funcoes', component: FuncaoIndex },
  { path: '/funcoes/create', name: 'funcoes.create', component: FuncaoCreate },
  { path: '/funcoes/edit/:id', name: 'funcoes.edit', component: FuncaoEdit },
  { path: '/funcoes/show/:id', name: 'funcoes.show', component: FuncaoShow },

  // Disciplinas
  { path: '/disciplinas', name: 'disciplinas', component: DisciplinaIndex },
  { path: '/disciplinas/create', name: 'disciplinas.create', component: DisciplinaCreate },
  { path: '/disciplinas/edit/:id', name: 'disciplinas.edit', component: DisciplinaEdit },
  { path: '/disciplinas/show', name: 'disciplinas.show', component: DisciplinaShow },

    // Professor
  { path: '/area/professores', name: 'area.professores', component: ProfessorIndex },
  { path: '/area/professores/show/:id', name: 'area.professores.show', component: ProfessorShow },

  // Cursos
  { path: '/cursos', name: 'cursos', component: CursoIndex },
  { path: '/cursos/create', name: 'cursos.create', component: CursoCreate },
  { path: '/cursos/edit/:id', name: 'cursos.edit', component: CursoEdit },
  { path: '/cursos/show/:id', name: 'cursos.show', component: CursoShow },

  // Coordenações
  { path: '/coordenacoes', name: 'coordenacoes', component: CoordenacaoIndex },
  { path: '/coordenacoes/create', name: 'coordenacoes.create', component: CoordenacaoCreate },

  // Turmas
  { path: '/turmas', name: 'turmas', component: TurmaIndex },
  { path: '/turmas/create', name: 'turmas.create', component: TurmaCreate },
  { path: '/turmas/show', name: 'turmas.show', component: TurmaShow },
  { path: '/turmas/edit/:id', name: 'turmas.edit', component: TurmaEdit },
  { path: '/turmas/:id/alunos', name: 'turmas.edit.alunos', component: TurmaAlunos },
  { path: '/turmas/:turma_id/alunos/desempenho', name: 'turmas.edit.alunos.desempenho', component: TurmaAlunosDesempenho },
  { path: '/turmas/:id/alunos/add', name: 'turmas.alunos.add', component: AddAlunoTurma },
  
  // Turmas Secretaria
  { path: '/secretaria/turmas', name: 'secretaria.turmas', component: TurmaSecretariaIndex },
  { path: '/secretaria/turmas/show/:id', name: 'secretaria.turmas.show', component: TurmaSecretariaShow },

  // Matrículas
  { path: '/matriculas', name: 'matriculas', component: MatriculaIndex },
  { path: '/matriculas/create', name: 'matriculas.create', component: MatriculaCreate },
  { path: '/matriculas/show/:id', name: 'matriculas.show', component: MatriculaShow },
  { path: '/matriculas/edit/:id', name: 'matriculas.edit', component: MatriculaEdit },

  // Confirmações
  { path: '/confirmacoes', name: 'confirmacoes', component: ConfirmacaoIndex },
  { path: '/confirmacoes/create', name: 'confirmacoes.create', component: ConfirmacaoCreate },
  { path: '/confirmacoes/show/:id', name: 'confirmacoes.show', component: ConfirmacaoShow },
  { path: '/confirmacoes/edit/:id', name: 'confirmacoes.edit', component: ConfirmacaoEdit },

  // Horários
  { path: '/horarios-criar/create/:ano_letivo/:turma_id/:classe/:serie/:sala/:turno', name: 'horarios.create', component: HorarioIndex },
  
  // Atribuir Professor
  { path: '/atribuir-professor/create/:ano_letivo/:turma_id/:classe/:serie/:sala/:turno', name: 'atribuir.professor.create', component: AtribuirProfessorCreate },

  {
    path: '/horarios/edit/:ano_letivo/:nome_curso/:horario_id/:abreviatura/:turma_id/:classe/:serie/:sala/:turno',
    name: 'horarios.edit',
    component: HorarioEdit
  },
  {
    path: '/horarios/show/:ano_letivo/:nome_curso/:horario_id/:abreviatura/:turma_id/:classe/:serie/:sala/:turno',
    name: 'horarios.show',
    component: HorarioShow
  },
  {
    path: '/mini-pautas/:turma_id',
    name: 'mini.pautas.index',
    component: MiniPautaIndex
  },
  { 
    path: '/mini-pautas/edit/:ano_letivo/:nome_curso/:horario_id/:abreviatura/:turma_id/:classe/:serie/:sala/:turno/:disciplina_id/:disciplina_nome/:disciplina_abreviatura', name: 'mini.pauta.edit', 
    component: MiniPautaProfessorEdit 
  },
  
  // Mini Pauta Professor
  { path: '/professor/area/mini-pautas/edit/:ano_letivo/:nome_curso/:horario_id/:abreviatura/:turma_id/:classe/:serie/:sala/:turno/:disciplina_id/:disciplina_nome/:disciplina_abreviatura', name: 'professor.mini.pauta.edit', component: MiniPautaProfessorEdit },
  
  { path: '/professor/area/mini-pautas/show/:ano_letivo/:nome_curso/:horario_id/:abreviatura/:turma_id/:classe/:serie/:sala/:turno/:disciplina_id/:disciplina_nome/:disciplina_abreviatura', name: 'professor.mini.pauta.show', component: MiniPautaProfessorShow },

  // Pautas
  { path: '/pautas/teste/:turmaId/show', name: 'pautas.teste.show', component: PautaTestehow },
  { path: '/pautas/saopio/:turmaId/show', name: 'pautas.saopio.show', component: PautaSaopioShow },
  { path: '/pautas/dopsa/:turmaId/show', name: 'pautas.dopsa.show', component: PautaDopsaShow },

  // Boletim
  { path: '/boletim/:turma_id', name: 'boletim', component: BoletimIndex },
  { path: '/boletim/show/:id/:trimestre/:alunos_id', name: 'boletim.show', component: BoletimShow },
  
  // Termos
  { path: '/termos', name: 'termos.index', component: TermoIndex },
  { path: '/termos/create', name: 'termos.create', component: TermoCreate },
  { path: '/termos/criar-termo/:aluno_id/:nivelEnsino/:classe', name: 'termos.criar.termo', component: TermoCriarTermo },
  { path: '/termos/editar-termo/:termo_id/:nome_aluno/:alunoId/editar/:classe', name: 'termos.editar.termo', component: TermoEditarTermo },

  // Teste
  { path: '/termos/:alunoId/:nivel/auto/:classe/', name: 'termos.nivelEnsino.classe', component: termoAutomatico },
  
  //Termos modelos
  
  // Teste
  { path: '/termos/:alunoId/teste/1/:classe/show/:termo_id', name: 'termos.n1.teste.show', component: TermoTesteNivel1 },
  { path: '/termos/:alunoId/teste/2/:classe/show/:termo_id', name: 'termos.n2.teste.show', component: TermoTesteNivel2_simples },
  { path: '/termos/:alunoId/agrupado', name: 'termos.n2.teste.show.agrupado', component: TermoTesteNivel2_agrupado },
  { path: '/termos/:alunoId/teste/3/:classe/show/:termo_id', name: 'termos.n3.teste.show', component: TermoTesteNivel3 },


  // Dopsa
  { path: '/termos/:alunoId/dopsa/1/:classe/show/:termo_id', name: 'termos.n1.dopsa.show', component: TermoDopsaNivel1 },
  { path: '/termos/:alunoId/dopsa/2/:classe/show/:termo_id', name: 'termos.n2.dopsa.show', component: TermoDopsaNivel2 },
  { path: '/termos/:alunoId/dopsa/3/:classe/show/:termo_id', name: 'termos.n3.dopsa.show', component: TermoDopsaNivel3 },
  
  // São Pio
  { path: '/termos/:alunoId/saopio/1/:classe/show/:termo_id', name: 'termos.n1.saopio.show', component: TermoDopsaNivel1 },
  { path: '/termos/:alunoId/saopio/2/:classe/show/:termo_id', name: 'termos.n2.saopio.show', component: TermoDopsaNivel2 },
  { path: '/termos/:alunoId/saopio/3/:classe/show/:termo_id', name: 'termos.n3.saopio.show', component: TermoSaopioNivel3 },


  // Certificados
  { path: '/Certificados', name: 'certificados.index', component: CertificadoIndex },
  { path: '/Certificados/create', name: 'certificados.create', component: CertificadoCreate },

  // Teste
  // { path: '/Certificados/show/dopsa/n1/:aluno_id/:nivelEnsino', name: 'certificados.show.d.n1', component: CertificadoDopsaNivel1 },
  { path: '/Certificados/:alunoId/teste/:nivel/show', name: 'certificados.teste.nivel.show', component: CertificadoTesteNivel2 },
  
  // Area do Professor
  // disciplinas Professor
  { path: '/professor/area/turmas', name: 'professor.area.turmas', component: TurmaProfessorIndex },

  // Horário Professor
  { path: '/horarios-professor/show/:ano_letivo/:nome_curso/:horario_id/:abreviatura/:turma_id/:classe/:serie/:sala/:turno/:disciplina_id/:disciplina_nome/:disciplina_abreviatura', name: 'horarios.professor', component: HorarioProfessor },
  
  //Area do Aluno
  // { path: '/aluno/area/inicio', name: 'aluno.area.inicio', component: AlunoAreaInicio },

  // **Permissões 
  // Regras
  // { path: '/regras', name: 'regras', component: RegraIndex },
  // { path: '/regras/create', name: 'regras.create', component: RegraCreate },
  // { path: '/regras/show', name: 'regras.show', component: RegraShow },
  // { path: '/regras/edit', name: 'regras.edit', component: RegraEdit },
   
  // Regras de Usuários
  { path: '/perfil-usuarios', name: 'regrasUsuarios', component: RegraUsuarioIndex },
  { path: '/perfil-usuarios/create', name: 'regrasUsuarios.create', component: RegraUsuarioCreate },
  { path: '/perfil-usuarios/show', name: 'regrasUsuarios.show', component: RegraUsuarioShow },
  { path: '/perfil-usuarios/edit', name: 'regrasUsuarios.edit', component: RegraUsuarioEdit }, 

  // Permissões
  { path: '/permissoes', name: 'permissoes', component: PermissaoIndex },
  { path: '/permissoes/create', name: 'permissoes.create', component: PermissaoCreate },
  { path: '/permissoes/show', name: 'permissoes.show', component: PermissaoShow },
  { path: '/permissoes/edit', name: 'permissoes.edit', component: PermissaoEdit },

  // Regra de Permissões
  // { path: '/regras-permissoes', name: 'regrasPermissoes', component: RegraPermissaoIndex },
  // { path: '/regras-permissoes/create', name: 'regrasPermissoes.create', component: RegraPermissaoCreate },
  // { path: '/regras-permissoes/show', name: 'regrasPermissoes.show', component: RegraPermissaoShow },
  // { path: '/regras-permissoes/edit', name: 'regrasPermissoes.edit', component: RegraPermissaoEdit },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router