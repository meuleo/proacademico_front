<template>
  <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <br><br><br><br>
  <!-- Main Content -->
  <div class="main-content m-0 mt-5" id="mainContent">
    <div class="container-fluid horizontal-scroll">
      <!-- Barra de pesquisa e ações -->
      <div class="row mb-3 sticky-top bg-white py-2">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Pesquisar aluno..." 
              v-model="searchQuery"
            >
            <button class="btn btn-outline-secondary" type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-primary me-2" @click="saveChanges" :disabled="loading || saving">
            <i class="fas fa-save"></i> {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
          <button class="btn btn-secondary me-2" @click="printSheet" :disabled="loading">
            <i class="fas fa-print"></i> Imprimir
          </button>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <div class="mt-2 text-muted">Carregando pauta...</div>
      </div>

      <!-- Conteúdo centralizado -->
      <div v-else class="d-flex justify-content-center">
        <div class="content-wrapper" id="sheetToPrint">
          <!-- Cabeçalho da Pauta -->
          <div class="row header">
            <div class="col-12 text-center">
              <h5>{{ schoolInfo.country }}</h5>
              <h6>{{ schoolInfo.ministry }}</h6>
            </div>
          </div>

          <div class="row school-name">
            <div class="col-12 text-center">
              <h5>{{ schoolInfo.name }}</h5>
              <p>{{ schoolInfo.location }}</p>
            </div>
          </div>

          <div class="row sheet-title">
            <div class="col-12">
              <h4>{{ sheetTitle }}</h4>
            </div>
          </div>

          <div class="row class-info">
            <div class="col-12">
              <p>
                <strong>ANO LECTIVO:</strong> {{ classInfo.academicYear }} | 
                <strong>{{ classInfo.grade }}</strong> | 
                <strong>SALA:</strong> {{ classInfo.room }} | 
                <strong>TURMA:</strong> {{ classInfo.class }} | 
                <strong>CÍCLO:</strong> {{ classInfo.cycle }} | 
                <strong>PERÍODO:</strong> {{ classInfo.period }}
              </p>
              <p>
                <strong>ESPECIALIDADE:</strong> {{ classInfo.specialty }} | 
                <strong>LIN. ESTRANGEIRA:</strong> {{ classInfo.foreignLanguage }} | 
                <strong>DIRECTOR DE TURMA:</strong> {{ classInfo.classDirector }}
              </p>
            </div>
          </div>

          <!-- Tabela de Notas -->
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th rowspan="3">Nº Ord</th>
                      <th rowspan="3">NOME COMPLETO</th>
                      <th rowspan="3">SEXO</th>
                      <th 
                        v-for="subject in subjects" 
                        :key="subject.id" 
                        :colspan="5" 
                        class="subject-header"
                      >
                        {{ subject.name }}
                        <div class="teacher-name">{{ getTeacherName(subject.teacherId) }}</div>
                      </th>
                      <th rowspan="3">MÉDIA GERAL</th>
                      <th rowspan="3">OBS</th>
                    </tr>
                    <tr>
                      <template v-for="subject in subjects" :key="'subheader-'+subject.id">
                        <th>MT1</th>
                        <th>MT2</th>
                        <th>MT3</th>
                        <th>MFD</th>
                        <th>F</th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(student, index) in filteredStudents" :key="student._localId || student.id || index">
                      <td>{{ index + 1 }}</td>
                      <td class="text-start">{{ student.name }}</td>
                      <td>{{ student.gender }}</td>
                      
                      <!-- Notas por disciplina com destaque vermelho para < 10 -->
                      <template v-for="subject in subjects" :key="'subject-'+subject.id">
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt1)}">
                          {{ student.subjects?.[subject.id]?.mt1 ?? '-' }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt2)}">
                          {{ student.subjects?.[subject.id]?.mt2 ?? '-' }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt3)}">
                          {{ student.subjects?.[subject.id]?.mt3 ?? '-' }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mfd)}">
                          {{ student.subjects?.[subject.id]?.mfd ?? '-' }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.final)}">
                          {{ student.subjects?.[subject.id]?.final ?? '-' }}
                        </td>
                      </template>
                      
                      <!-- Média Geral -->
                      <td :class="{'text-dark': (student.average ?? 0) >= passThreshold, 'text-danger': (student.average ?? 0) < passThreshold}" style="font-weight: bold;">
                        {{ student.average != null ? student.average.toFixed(1) : '-' }}
                      </td>
                      
                      <!-- Status (Apto/Não Apto) -->
                      <td :class="{'text-dark': (student.average ?? 0) >= passThreshold, 'text-danger': (student.average ?? 0) < passThreshold}" style="font-weight: bold;">
                        {{ (student.average ?? 0) >= passThreshold ? 'Apto' : 'N/Apto' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Assinaturas -->
          <div class="row mt-4">
            <div class="col-md-6">
              <p class="mb-0">O CHEFE DE SECRETARIA</p>
              <p class="border-bottom-dotted">{{ signatures.secretary }}</p>
            </div>
            <div class="col-md-6">
              <p class="mb-0">O SUBDIRECTOR PEDAGÓGICO</p>
              <p class="border-bottom-dotted">{{ signatures.pedagogicalDirector }}</p>
            </div>
          </div>

          <div class="row mt-4 mb-5">
            <div class="col-12">
              <p><strong>O CONSELHO DE NOTA</strong></p>
              <p class="border-bottom-dotted" v-for="(member, index) in signatures.councilMembers" :key="index">
                {{ index + 1 }}. {{ member || '______________________________________________________' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import * as api from "../../api/api.js"
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue'

export default {
  components: {
    navbar,
    sidebar
  },

  data() {
    return {
      searchQuery: '',
      editedStudents: new Set(),

      loading: false,
      saving: false,

      passThreshold: 9.5, // limiar visual de aprovação (ajustável)

      // cabeçalho / info (será preenchido pela API)
      schoolInfo: {
        country: "REPÚBLICA DE ANGOLA",
        ministry: "MINISTÉRIO DA EDUCAÇÃO",
        name: '',
        location: ''
      },
      sheetTitle: "PAUTA PARA O ENSINO SECUNDÁRIO - FORMAÇÃO GERAL",
      classInfo: {
        academicYear: '',
        grade: '',
        room: '',
        class: '',
        cycle: '',
        period: '',
        specialty: '',
        foreignLanguage: '',
        classDirector: ''
      },

      signatures: {
        secretary: '',
        pedagogicalDirector: '',
        councilMembers: ['', '']
      },

      // disciplinas dinâmicas (colunas) - geradas a partir do payload.pauta
      subjects: [], // { id: '9', name: 'Matemática', teacherName: '...'} 

      // estudantes (linhas)
      allStudents: [],

      // opcional: lista de professores (se usar getTeacherName)
      teachers: []
    }
  },

  computed: {
    // filtro por pesquisa (nome) — reativo
    filteredStudents() {
      const q = (this.searchQuery || '').trim().toLowerCase();
      if (!q) return this.allStudents;
      return this.allStudents.filter(s => (s.name || '').toLowerCase().includes(q));
    }
  },

  created() {
    const turmaId = this.$route && this.$route.params && this.$route.params.turmaId
      ? this.$route.params.turmaId
      : 24;

    this.fetchPauta(turmaId);
  },

  mounted() {
    // Segurança: garante recalcular médias caso não tenham sido calculadas
    (this.allStudents || []).forEach(s => {
      this.calculateAllAverages(s);
    });
  },

  methods: {
    // ---------- fetch / normaliza ----------
    // dentro de methods: --------------------------------------------------
async fetchPauta(turmaId) {
  try {
    this.loading = true;
    const resp = await api.listar(`/pautas/turmas/${turmaId}`);
    // Se a API retorna no campo data, use resp.data, senão resp
    const payload = (resp && resp.data) ? resp.data : resp;
    this.normalizeApiData(payload || {});
  } catch (err) {
    console.error('Erro ao carregar pauta', err);
    alert('Erro ao carregar pauta. Verifique o console.');
  } finally {
    this.loading = false;
  }
},

/**
 * Converte valor qualquer para número, retornando 0 quando inválido (ou opcionalmente null)
 */
toNumberOrZero(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
},

/**
 * Normaliza o payload da API para this.subjects e this.allStudents.
 * Tolerante a formatos variados (arrays/objects, trimestres como num ou texto).
 */
normalizeApiData(payload) {
  try {
    // 1) Cabeçalho/turma
    const t = payload.turma || {};
    this.classInfo.academicYear = t.ano_letivo ?? this.classInfo.academicYear;
    this.classInfo.grade = (t.classe ? `${t.classe}ª CLASSE` : this.classInfo.grade) || (t.nome || '');
    this.classInfo.room = t.sala ?? this.classInfo.room;
    this.classInfo.class = t.serie ?? this.classInfo.class;
    this.classInfo.classDirector = t.diretor ?? this.classInfo.classDirector;
    if (t.curso && t.curso.nome) this.classInfo.specialty = t.curso.nome;
    if (t.nome) this.sheetTitle = t.nome;

    // 2) Extrair disciplinas únicas + estudantes
    const pauta = payload.pauta || {};
    const subjectMap = new Map();
    const studentsMap = new Map();

    // helper: normaliza valor de "trimestre" para '1'|'2'|'3' strings
    const normalizeTri = (tri) => {
      if (tri === null || tri === undefined) return null;
      const s = String(tri).trim().toLowerCase();
      if (['1', '01', 'primeiro'].includes(s)) return '1';
      if (['2', '02', 'segundo'].includes(s)) return '2';
      if (['3', '03', 'terceiro'].includes(s)) return '3';
      return s; // fallback
    };

    // pauta pode ser object com keys = alunoId, ou um array; iteramos com Object.entries
    const pautaEntries = Array.isArray(pauta) ? pauta.entries() : Object.entries(pauta || {});
    for (const [alunoIdKey, disciplinas] of pautaEntries) {
      try {
        const alunoId = String(alunoIdKey);
        const disciplinasObj = disciplinas || {};

        // disciplinasObj pode ser array ou object
        const discEntries = Array.isArray(disciplinasObj) ? Object.entries(disciplinasObj) : Object.entries(disciplinasObj);

        for (const [discIdKey, item] of discEntries) {
          try {
            const discKey = String(discIdKey);
            const discName = (item && (item.disciplina || item.disciplina_nome)) ? (item.disciplina || item.disciplina_nome) : `Disciplina ${discKey}`;
            const teacherName = item && (item.professor || item.professor_nome) ? (item.professor || item.professor_nome) : '';

            if (!subjectMap.has(discKey)) {
              subjectMap.set(discKey, { id: discKey, name: discName, teacherName });
            } else {
              const s = subjectMap.get(discKey);
              if (!s.teacherName && teacherName) s.teacherName = teacherName;
              if (!s.name && discName) s.name = discName;
            }

            if (!studentsMap.has(alunoId)) {
              const alunoName = (item && (item.aluno || item.nome_aluno)) ? (item.aluno || item.nome_aluno) : `Aluno ${alunoId}`;
              const genero = (item && item.genero) ? item.genero : 'M';
              studentsMap.set(alunoId, {
                _localId: Number(alunoId),
                id: Number(alunoId),
                name: alunoName,
                gender: genero,
                subjects: {},
                average: 0
              });
            }

            const student = studentsMap.get(alunoId);

            // trimestres pode ser array ou object
            const trimesRaw = (item && item.trimestres) ? item.trimestres : [];
            let trimesArray = [];

            if (Array.isArray(trimesRaw)) {
              trimesArray = trimesRaw;
            } else if (trimesRaw && typeof trimesRaw === 'object') {
              trimesArray = Object.values(trimesRaw);
            } else {
              trimesArray = [];
            }

            // helper que busca media por trimestre (aceita 1/2/3)
            const findMedia = (nome) => {
              try {
                const want = normalizeTri(nome);
                const found = trimesArray.find(x => {
                  if (!x) return false;
                  const triVal = normalizeTri(x.trimestre ?? x.tri ?? x.numero ?? x.trimestre_num);
                  return triVal === want;
                });
                if (!found) return null;
                // pode ser found.media ou found.media_trimestre
                const m = found.media ?? found.media_trimestre ?? found.valor ?? found.nota ?? null;
                if (m === null || m === undefined || m === '') return null;
                const n = Number(m);
                return Number.isNaN(n) ? null : n;
              } catch (e) {
                // não deixar um erro menor quebrar tudo
                console.warn('findMedia erro', e, trimesArray);
                return null;
              }
            };

            const mt1 = this.toNumberOrZero(findMedia('1'));
            const mt2 = this.toNumberOrZero(findMedia('2'));
            const mt3 = this.toNumberOrZero(findMedia('3'));

            const mfdVal = item && (item.media_final ?? item.mfd ?? item.media) ? Number(item.media_final ?? item.mfd ?? item.media) : 0;
            const finalVal = item && (item.media_final ?? item.mfd ?? item.media) ? Number(item.media_final ?? item.mfd ?? item.media) : 0;

            // setar a disciplina no student.subjects, garantindo reatividade
            const subjObj = {
              mt1: mt1,
              mt2: mt2,
              mt3: mt3,
              mfd: this.toNumberOrZero(mfdVal),
              final: this.toNumberOrZero(finalVal),
              _origObservacao: item ? (item.observacao ?? null) : null,
              observacao: item ? (item.observacao ?? null) : null,
              disciplina_id: discKey,
              disciplina_nome: discName
            };

            // Vue.set se disponível para reatividade (Vue2)
            if (typeof this.$set === 'function') {
              if (!student.subjects) this.$set(student, 'subjects', {});
              this.$set(student.subjects, discKey, subjObj);
            } else {
              student.subjects = student.subjects || {};
              student.subjects[discKey] = subjObj;
            }

          } catch (errItem) {
            console.warn('Erro ao processar item de disciplina', discIdKey, errItem);
            continue;
          }
        }

      } catch (errAluno) {
        console.warn('Erro ao processar aluno na pauta', alunoIdKey, errAluno);
        continue;
      }
    }

    // montar subjects e students
    this.subjects = subjectMap.size ? Array.from(subjectMap.values()) : [];

    this.allStudents = Array.from(studentsMap.values())
      .sort((a,b) => (a._localId || 0) - (b._localId || 0))
      .map(s => {
        // garantir que todas as disciplinas atuais tenham objeto e recalcular médias
        this.subjects.forEach(subject => {
          const sid = subject.id;
          if (!s.subjects) s.subjects = {};
          if (!s.subjects[sid]) {
            if (typeof this.$set === 'function') {
              this.$set(s.subjects, sid, { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sid, disciplina_nome: subject.name, observacao: null });
            } else {
              s.subjects[sid] = { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sid, disciplina_nome: subject.name, observacao: null };
            }
          }
        });

        // recalcula médias
        this.calculateAllAverages(s);
        return s;
      });

  } catch (err) {
    console.error('normalizeApiData erro', err, payload);
    // se houver falha completa, zera arrays para evitar template quebrado
    this.subjects = [];
    this.allStudents = [];
  }
},
// ---------------------------------------------------------------------


    // ---------- util / UI ----------
    getTeacherName(teacherId) {
      const t = this.teachers && this.teachers.find(x => x.id === teacherId);
      return t ? t.name : '';
    },

    formatNumber(n) {
      if (n === null || n === undefined) return '';
      if (isNaN(Number(n))) return '';
      return Number(n).toFixed(2);
    },

    // ---------- cálculos ----------
    computeMean(arr) {
      const vals = (arr || []).map(v => Number(v)).filter(v => !isNaN(v));
      if (!vals.length) return 0;
      const sum = vals.reduce((a,b) => a + b, 0);
      return sum / vals.length;
    },

    round2(v) {
      return Math.round((Number(v) + Number.EPSILON) * 100) / 100;
    },

    calculateAllAverages(student) {
      // garantimos que todas as disciplinas atuais tenham objeto
      this.subjects.forEach(subject => {
        const sid = subject.id;
        if (!student.subjects) student.subjects = {};
        if (!student.subjects[sid]) {
          // inicializa com zeros se não existir
          this.$set(student.subjects, sid, { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sid, disciplina_nome: subject.name, observacao: null });
        }
        const subj = student.subjects[sid];
        subj.mfd = this.round2(this.computeMean([subj.mt1, subj.mt2, subj.mt3]));
        subj.final = subj.mfd;
      });

      // média geral do aluno = média aritmética das notas finais das disciplinas presentes
      this.calculateGeneralAverage(student);
    },

    calculateGeneralAverage(student) {
      const finals = this.subjects
        .map(s => (student.subjects && student.subjects[s.id] ? Number(student.subjects[s.id].final) : NaN))
        .filter(v => !isNaN(v));
      if (!finals.length) {
        student.average = 0;
      } else {
        const sum = finals.reduce((a,b) => a + b, 0);
        student.average = this.round2(sum / finals.length);
      }
    },

    // retorna true se nota é numérica e < 10
    isLowNote(value) {
      const n = Number(value);
      return !isNaN(n) && n < 10;
    },

    // ---------- edição / marcação ----------
    markStudentAsEdited(student) {
      this.editedStudents.add(student._localId);
    },

    addNewStudent() {
      const newLocalId = (this.allStudents.length ? Math.max(...this.allStudents.map(s => s._localId)) : 0) + 1;
      const newStudent = {
        _localId: newLocalId,
        id: null,
        name: 'Novo Aluno',
        gender: 'M',
        subjects: {},
        average: 0
      };
      this.subjects.forEach(sub => {
        newStudent.subjects[sub.id] = { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sub.id, disciplina_nome: sub.name, observacao: null };
      });
      this.allStudents.push(newStudent);
      this.markStudentAsEdited(newStudent);
    },

    // ---------- salvar ----------
    async saveChanges() {
      if (!this.editedStudents.size) {
        alert('Nenhuma alteração para salvar.');
        return;
      }

      try {
        this.saving = true;

        const payloadAlunos = [];
        for (const localId of Array.from(this.editedStudents)) {
          const student = this.allStudents.find(s => s._localId === localId);
          if (!student) continue;

          for (const subj of this.subjects) {
            const subObj = student.subjects[subj.id];
            if (!subObj) continue;

            payloadAlunos.push({
              aluno_id: student.id,
              disciplina_id: subObj.disciplina_id,
              disciplina: subObj.disciplina_nome || subj.name,
              media_final: Number(subObj.final),
              observacao: subObj.observacao || (Number(subObj.final) >= this.passThreshold ? 'Apto' : 'N/Apto')
            });
          }
        }

        const payload = {
          ano_letivo: this.classInfo.academicYear,
          classe: this.classInfo.grade || this.classInfo.class,
          curso: this.classInfo.specialty || null,
          alunos: payloadAlunos
        };

        const resp = await api.post('/termos/bulk', payload);

        alert('Alterações salvas com sucesso!');
        this.editedStudents.clear();
      } catch (err) {
        console.error('Erro salvar', err);
        alert('Erro ao salvar alterações. Veja console.');
      } finally {
        this.saving = false;
      }
    },

    // ---------- impressão com html2pdf (landscape) ----------
    async printSheet() {
      try {
        // tenta import dinâmico - funciona com bundlers que suportam import()
        const html2pdfModule = (await import('html2pdf.js')).default || (await import('html2pdf.js'));
        const html2pdf = html2pdfModule.default ? html2pdfModule.default : html2pdfModule;

        // elemento que será impresso (usei o wrapper #sheetToPrint)
        const element = document.getElementById('sheetToPrint') || document.getElementById('mainContent');

        if (!element) {
          alert('Elemento para impressão não encontrado.');
          return;
        }

        const opt = {
          margin:       [10, 10, 10, 10], // top, left, bottom, right (pt)
          filename:     `${this.sheetTitle || 'pauta'}.pdf`,
          image:        { type: 'jpeg', quality: 1 },
          html2canvas:  {
            scale: 2.5,            // escala maior = texto mais nítido
            useCORS: true,
            logging: false,
            dpi: 300,
            letterRendering: true
          },
          jsPDF:        { unit: 'pt', format: 'a4', orientation: 'landscape' }
        };

        // Chama o html2pdf
        // nota: html2pdf(element, opt) ou html2pdf().from(element).set(opt).save()
        html2pdf().set(opt).from(element).save();

      } catch (err) {
        console.error('Erro ao iniciar html2pdf', err);
        alert('Erro ao preparar impressão. Verifique console (import html2pdf).');
      }
    }
  }
}
</script>

<style scoped>
/* Forçar font-size 12px em todo o template deste componente */
.main-content, .main-content * {
  font-size: 12px !important;
}

/* Layout principal */
.main-content {
  margin-left: 250px;
  padding: 20px;
  transition: margin-left 0.3s;
  width: 100%;
  overflow-x: auto;
}

.horizontal-scroll {
  min-width: fit-content;
}

.content-wrapper {
  min-width: fit-content;
  width: 100%;
}

/* Estilos da tabela */
.table-responsive {
  overflow-x: visible;
}

.table {
  min-width: 1500px;
  margin: 0 auto;
}

.table th, .table td {
  padding: 0.3rem;
  vertical-align: middle;
  text-align: center;
  min-width: 50px;
}

/* cabeçalhos das disciplinas */
.subject-header {
  background-color: #f8f9fa;
  font-weight: bold;
  position: relative;
}

.teacher-name {
  font-weight: normal;
  font-size: 0.8rem;
  font-style: italic;
}

/* Estilos gerais */
.header {
  border-bottom: 1px solid #000;
  margin-bottom: 15px;
}

.school-name {
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.sheet-title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
}

.class-info {
  margin-bottom: 15px;
}

.border-bottom-dotted {
  border-bottom: 1px dotted #000;
}

/* Estilos dos inputs (ainda mantidos caso sejam reaproveitados) */
.form-control, .form-select {
  min-width: 50px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.form-control-sm {
  height: calc(1.5em + 0.5rem);
}

/* Cores de status */
.text-success {
  color: #198754 !important;
  font-weight: bold;
}

.text-danger {
  color: #dc3545 !important;
  font-weight: bold;
}

/* Barra de pesquisa fixa */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 990;
  background: white;
  padding-top: 15px;
  padding-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
