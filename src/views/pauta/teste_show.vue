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
      <div class="row mb-3 sticky-top bg-white py-2 align-items-center">
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

        <div class="col-md-6 text-end d-flex justify-content-end align-items-center gap-3">
          <!-- toggles para Exame / Recurso -->
          <div class="toggle-controls me-auto d-flex gap-3 align-items-center">
            <label class="small mb-0">
              <input type="checkbox" v-model="ativarExame" class="form-check-input me-1" /> Ativar Exame
            </label>
            <label class="small mb-0">
              <input type="checkbox" v-model="ativarRecurso" class="form-check-input me-1" /> Ativar Recurso
            </label>
          </div>

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
                <strong>ANO LECTIVO:</strong> {{ classInfo.academicYear || '' }} | 
                <strong>{{ classInfo.grade || '' }}</strong> | 
                <strong>SALA:</strong> {{ classInfo.room || '' }} | 
                <strong>TURMA:</strong> {{ classInfo.class || '' }} | 
                <strong>CÍCLO:</strong> {{ classInfo.cycle || '' }} | 
                <strong>PERÍODO:</strong> {{ classInfo.period || '' }}
              </p>
              <p>
                <strong>ESPECIALIDADE:</strong> {{ classInfo.specialty || '' }} | 
                <strong>LIN. ESTRANGEIRA:</strong> {{ classInfo.foreignLanguage || '' }} | 
                <strong>DIRECTOR DE TURMA:</strong> {{ classInfo.classDirector || '' }}
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
                        :colspan="columnsPerSubject"
                        class="subject-header"
                      >
                        {{ subject.name }}
                        <div class="teacher-name">{{ subject.teacherName || getTeacherName(subject.teacherId) }}</div>
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

                        <th v-if="ativarExame">E</th>
                        <th v-if="ativarExame">MFE</th>

                        <th v-if="ativarRecurso">R</th>
                        <th v-if="ativarRecurso">MFR</th>

                        <th>F</th>
                      </template>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(student, index) in filteredStudents" :key="student._localId || student.id || index">
                      <td>{{ index + 1 }}</td>
                      <td class="text-start">{{ student.name || '' }}</td>
                      <td>{{ student.gender || '' }}</td>
                      
                      <!-- Notas por disciplina -->
                      <template v-for="subject in subjects" :key="'subject-'+subject.id">
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt1), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mt1)}">
                          {{ displayNote(student.subjects?.[subject.id]?.mt1) }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt2), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mt2)}">
                          {{ displayNote(student.subjects?.[subject.id]?.mt2) }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt3), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mt3)}">
                          {{ displayNote(student.subjects?.[subject.id]?.mt3) }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mfd), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mfd)}">
                          {{ displayNote(student.subjects?.[subject.id]?.mfd) }}
                        </td>

                        <!-- Exame / MFE -->
                        <td v-if="ativarExame" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.exame), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.exame)}">
                          {{ displayNote(student.subjects?.[subject.id]?.exame) }}
                        </td>
                        <td v-if="ativarExame" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mfe), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mfe)}">
                          {{ displayNote(student.subjects?.[subject.id]?.mfe) }}
                        </td>

                        <!-- Recurso / MFR -->
                        <td v-if="ativarRecurso" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.recurso), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.recurso)}">
                          {{ displayNote(student.subjects?.[subject.id]?.recurso) }}
                        </td>
                        <td v-if="ativarRecurso" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mfr), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mfr)}">
                          {{ displayNote(student.subjects?.[subject.id]?.mfr) }}
                        </td>

                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.final), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.final)}">
                          {{ displayNote(student.subjects?.[subject.id]?.final) }}
                        </td>
                      </template>
                      
                      <!-- Média Geral -->
                      <td :class="{'nota-blue': (student.average || 0) >= 10, 'text-danger': (student.average || 0) < 10}" style="font-weight: bold;">
                        {{ displayNote(student.average) }}
                      </td>
                      
                      <!-- Status -->
                      <td :class="{'nota-blue': (student.average || 0) >= passThreshold, 'text-danger': (student.average || 0) < passThreshold}" style="font-weight: bold;">
                        {{ (student.average || 0) >= passThreshold ? 'Apto' : 'N/Apto' }}
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
              <p class="border-bottom-dotted">{{ signatures.secretary || '' }}</p>
            </div>
            <div class="col-md-6">
              <p class="mb-0">O SUBDIRECTOR PEDAGÓGICO</p>
              <p class="border-bottom-dotted">{{ signatures.pedagogicalDirector || '' }}</p>
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
  components: { navbar, sidebar },

  data() {
    return {
      searchQuery: '',
      editedStudents: new Set(),
      loading: false,
      saving: false,
      passThreshold: 9.5,

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

      subjects: [],
      allStudents: [],
      teachers: [],
      ativarExame: false,
      ativarRecurso: false
    }
  },

  computed: {
    filteredStudents() {
      const q = (this.searchQuery || '').trim().toLowerCase();
      if (!q) return this.allStudents;
      return this.allStudents.filter(s => (s.name || '').toLowerCase().includes(q));
    },
    columnsPerSubject() {
      return 5 + (this.ativarExame ? 2 : 0) + (this.ativarRecurso ? 2 : 0);
    }
  },

  created() {
    const turmaId = this.$route?.params?.turmaId ?? 24;
    this.fetchPauta(turmaId);
  },

  watch: {
    ativarExame(newVal) {
      this.allStudents.forEach(s => {
        this.subjects.forEach(sub => {
          const subj = s.subjects?.[sub.id];
          if (subj) {
            if (!newVal) { subj.exame = null; subj.mfe = null; }
            else if (subj.exame != null) subj.mfe = this.round2((Number(subj.mfd ?? 0) + Number(subj.exame)) / 2);
          }
        });
      });
    },
    ativarRecurso(newVal) {
      this.allStudents.forEach(s => {
        this.subjects.forEach(sub => {
          const subj = s.subjects?.[sub.id];
          if (subj) {
            if (!newVal) { subj.recurso = null; subj.mfr = null; }
            else if (subj.recurso != null) {
              const base = (this.ativarExame && subj.mfe != null) ? subj.mfe : subj.mfd;
              subj.mfr = this.round2((Number(base ?? 0) + Number(subj.recurso)) / 2);
            }
          }
        });
      });
    }
  },

  methods: {
    async fetchPauta(turmaId) {
      try {
        this.loading = true;
        const resp = await api.listar(`/pautas/turmas/${turmaId}`);
        this.normalizeApiData(resp?.data ?? resp ?? {});
      } catch (err) {
        console.error('Erro ao carregar pauta', err);
        alert('Erro ao carregar pauta. Verifique o console.');
      } finally {
        this.loading = false;
      }
    },

    displayNote(value) {
      if (value === null || value === undefined || value === '') return '';
      if (isNaN(Number(value))) return '';
      return Number(value).toFixed(2);
    },

    normalizeApiData(payload) {
      try {
        const t = payload.turma ?? {};
        this.classInfo.academicYear = t.ano_letivo ?? '';
        this.classInfo.grade = t.classe ? `${t.classe}ª CLASSE` : (t.nome || '');
        this.classInfo.room = t.sala ?? '';
        this.classInfo.class = t.serie ?? '';
        this.classInfo.classDirector = t.diretor ?? '';
        this.classInfo.specialty = t.curso?.nome ?? '';
        if (t.nome) this.sheetTitle = t.nome;

        const pauta = payload.pauta ?? {};
        const subjectMap = new Map();
        const studentsMap = new Map();

        const normalizeTri = tri => {
          if (tri === null || tri === undefined) return null;
          const s = String(tri).trim().toLowerCase();
          if (['1','01','primeiro'].includes(s)) return '1';
          if (['2','02','segundo'].includes(s)) return '2';
          if (['3','03','terceiro'].includes(s)) return '3';
          return s;
        };

        for (const [alunoIdKey, disciplinas] of Object.entries(pauta ?? {})) {
          const alunoId = String(alunoIdKey);
          for (const [discIdKey, item] of Object.entries(disciplinas ?? {})) {
            const discKey = String(discIdKey);
            const discName = item?.disciplina ?? item?.disciplina_nome ?? `Disciplina ${discKey}`;
            const teacherName = item?.professor ?? item?.professor_nome ?? '';

            if (!subjectMap.has(discKey)) subjectMap.set(discKey, { id: discKey, name: discName, teacherName });

            if (!studentsMap.has(alunoId)) {
              const alunoName = item?.aluno ?? item?.nome_aluno ?? `Aluno ${alunoId}`;
              const genero = item?.genero ?? 'M';
              studentsMap.set(alunoId, { _localId: Number(alunoId), id: Number(alunoId), name: alunoName, gender: genero, subjects: {}, average: null });
            }

            const student = studentsMap.get(alunoId);
            const trimesArray = Array.isArray(item?.trimestres) ? item.trimestres : Object.values(item?.trimestres ?? {});
            
            const findMedia = nome => {
              const found = trimesArray.find(x => normalizeTri(x?.trimestre ?? x?.tri ?? x?.numero ?? x?.trimestre_num) === normalizeTri(nome));
              const m = found?.media ?? found?.media_trimestre ?? found?.valor ?? found?.nota ?? null;
              return m === '' ? null : m;
            };

            const subjObj = {
              mt1: findMedia('1') ?? null,
              mt2: findMedia('2') ?? null,
              mt3: findMedia('3') ?? null,
              mfd: item?.media_final ?? item?.mfd ?? item?.media ?? null,
              final: item?.media_final ?? item?.mfd ?? item?.media ?? null,
              disciplina_id: discKey,
              disciplina_nome: discName,
              observacao: item?.observacao ?? null,
              exame: item?.exame ?? null,
              mfe: item?.mfe ?? null,
              recurso: item?.recurso ?? null,
              mfr: item?.mfr ?? null
            };

            student.subjects[discKey] = subjObj;
          }
        }

        this.subjects = Array.from(subjectMap.values());
        this.allStudents = Array.from(studentsMap.values()).sort((a,b) => (a._localId || 0) - (b._localId || 0));
        this.allStudents.forEach(s => this.calculateAllAverages(s));

      } catch (err) {
        console.error('normalizeApiData erro', err, payload);
        this.subjects = [];
        this.allStudents = [];
      }
    },

    formatNumber(n) { return this.displayNote(n); },
    round2(v) { return Math.round((Number(v) + Number.EPSILON) * 100) / 100; },
    computeMean(arr) { 
      const vals = (arr || []).map(v => Number(v)).filter(v => !isNaN(v));
      if (!vals.length) return null;
      return vals.reduce((a,b)=>a+b,0)/vals.length;
    },

    calculateAllAverages(student) {
      this.subjects.forEach(subject => {
        const sid = subject.id;
        const subj = student.subjects[sid] ?? {};
        subj.mfd = this.computeMean([subj.mt1,subj.mt2,subj.mt3]);
        subj.final = subj.mfd;
        student.subjects[sid] = subj;
      });

      const finals = this.subjects.map(s => student.subjects[s.id]?.final).filter(v=>v!==null);
      student.average = finals.length ? this.round2(finals.reduce((a,b)=>a+b,0)/finals.length) : null;
    },

    isLowNote(value) { const n = Number(value); return !isNaN(n) && n < 10; },
    isHighNote(value) { const n = Number(value); return !isNaN(n) && n >= 10; },

    markStudentAsEdited(student) { this.editedStudents.add(student._localId); },
    addNewStudent() {
      const newLocalId = (this.allStudents.length ? Math.max(...this.allStudents.map(s=>s._localId)) : 0) + 1;
      const newStudent = { _localId:newLocalId, id:null, name:'Novo Aluno', gender:'M', subjects:{}, average:null };
      this.subjects.forEach(sub => { newStudent.subjects[sub.id]={ mt1:null, mt2:null, mt3:null, mfd:null, final:null, disciplina_id:sub.id, disciplina_nome:sub.name, observacao:null, exame:null, mfe:null, recurso:null, mfr:null }; });
      this.allStudents.push(newStudent);
      this.markStudentAsEdited(newStudent);
    },

    getTeacherName(id) { return this.teachers.find(t=>t.id===id)?.name ?? ''; },

    async printSheet() {
      try {
        const html2pdfModule = (await import('html2pdf.js')).default || (await import('html2pdf.js'));
        const html2pdf = html2pdfModule.default ? html2pdfModule.default : html2pdfModule;
        const element = document.getElementById('sheetToPrint') || document.getElementById('mainContent');
        if (!element) return alert('Elemento para impressão não encontrado.');
        const opt = { margin:[10,10,10,10], filename:`${this.sheetTitle||'pauta'}.pdf`, image:{type:'jpeg', quality:1}, html2canvas:{scale:2.5, useCORS:true, logging:false, dpi:300, letterRendering:true}, jsPDF:{unit:'pt', format:'a4', orientation:'landscape'} };
        html2pdf().set(opt).from(element).save();
      } catch(err){ console.error('Erro ao iniciar html2pdf', err); alert('Erro ao preparar impressão.'); }
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

/* nova: nota azul para >= 10 */
.nota-blue {
  color: #1565c0 !important;
  font-weight: 700;
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

/* toggle controls */
.toggle-controls label { cursor: pointer; display: inline-flex; align-items: center; gap: .4rem; }

/* responsive tweaks */
@media (max-width: 900px) { .table { min-width: 900px; } }
</style>
