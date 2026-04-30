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
                        <!-- segunda linha: cabeçalhos por coluna dinâmicas -->
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
                      <td class="text-start">{{ student.name }}</td>
                      <td>{{ student.gender }}</td>
                      
                      <!-- Notas por disciplina com destaque vermelho para < 10 e azul se >= 10 -->
                      <template v-for="subject in subjects" :key="'subject-'+subject.id">
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt1), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mt1)}">
                          {{ student.subjects?.[subject.id]?.mt1 != null ? formatNumber(student.subjects[subject.id].mt1) : '-' }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt2), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mt2)}">
                          {{ student.subjects?.[subject.id]?.mt2 != null ? formatNumber(student.subjects[subject.id].mt2) : '-' }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mt3), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mt3)}">
                          {{ student.subjects?.[subject.id]?.mt3 != null ? formatNumber(student.subjects[subject.id].mt3) : '-' }}
                        </td>
                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mfd), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mfd)}">
                          {{ student.subjects?.[subject.id]?.mfd != null ? formatNumber(student.subjects[subject.id].mfd) : '-' }}
                        </td>

                        <!-- Exame / MFE (se ativados) -->
                        <td v-if="ativarExame" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.exame), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.exame)}">
                          {{ student.subjects?.[subject.id]?.exame != null ? formatNumber(student.subjects[subject.id].exame) : '-' }}
                        </td>
                        <td v-if="ativarExame" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mfe), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mfe)}">
                          {{ student.subjects?.[subject.id]?.mfe != null ? formatNumber(student.subjects[subject.id].mfe) : '-' }}
                        </td>

                        <!-- Recurso / MFR (se ativados) -->
                        <td v-if="ativarRecurso" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.recurso), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.recurso)}">
                          {{ student.subjects?.[subject.id]?.recurso != null ? formatNumber(student.subjects[subject.id].recurso) : '-' }}
                        </td>
                        <td v-if="ativarRecurso" :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.mfr), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.mfr)}">
                          {{ student.subjects?.[subject.id]?.mfr != null ? formatNumber(student.subjects[subject.id].mfr) : '-' }}
                        </td>

                        <td :class="{'text-danger': isLowNote(student.subjects?.[subject.id]?.final), 'nota-blue': isHighNote(student.subjects?.[subject.id]?.final)}">
                          {{ student.subjects?.[subject.id]?.final != null ? formatNumber(student.subjects[subject.id].final) : '-' }}
                        </td>
                      </template>
                      
                      <!-- Média Geral (azul se >=10, vermelho se <10) -->
                      <td :class="{'nota-blue': (student.average ?? 0) >= 10, 'text-danger': (student.average ?? 0) < 10}" style="font-weight: bold;">
                        {{ (student.average != null && !isNaN(Number(student.average))) ? Number(student.average).toFixed(1) : '-' }}
                      </td>
                      
                      <!-- Status (Apto/Não Apto) -->
                      <td :class="{'nota-blue': (student.average ?? 0) >= 10, 'text-danger': (student.average ?? 0) < 10}" style="font-weight: bold;">
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
  components: { navbar, sidebar },

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
      teachers: [],

      // novos controles
      ativarExame: false,
      ativarRecurso: false
    }
  },

  computed: {
    // filtro por pesquisa (nome) — reativo
    filteredStudents() {
      const q = (this.searchQuery || '').trim().toLowerCase();
      if (!q) return this.allStudents;
      return this.allStudents.filter(s => (s.name || '').toLowerCase().includes(q));
    },

    // número de colunas por disciplina
    columnsPerSubject() {
      return 5 + (this.ativarExame ? 2 : 0) + (this.ativarRecurso ? 2 : 0);
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

  watch: {
    // quando desativa Exame/Recurso limpamos os campos correspondentes para evitar inconsistências
    ativarExame(newVal) {
      if (!newVal) {
        this.allStudents.forEach(s => {
          this.subjects.forEach(sub => {
            const subj = s.subjects && s.subjects[sub.id];
            if (subj) { subj.exame = null; subj.mfe = null; }
          });
        });
      } else {
        // recalcula possíveis MFE com base em valores existentes
        this.allStudents.forEach(s => this.subjects.forEach(sub => {
          const subj = s.subjects && s.subjects[sub.id];
          if (subj && subj.exame != null) {
            subj.mfe = this.round2((Number(subj.mfd || 0) + Number(subj.exame || 0)) / 2);
          }
        }));
      }
    },
    ativarRecurso(newVal) {
      if (!newVal) {
        this.allStudents.forEach(s => {
          this.subjects.forEach(sub => {
            const subj = s.subjects && s.subjects[sub.id];
            if (subj) { subj.recurso = null; subj.mfr = null; }
          });
        });
      } else {
        // recalcula possíveis MFR com base em valores existentes
        this.allStudents.forEach(s => this.subjects.forEach(sub => {
          const subj = s.subjects && s.subjects[sub.id];
          if (subj && subj.recurso != null) {
            const base = (this.ativarExame && subj.mfe != null) ? subj.mfe : (subj.mfd != null ? subj.mfd : 0);
            subj.mfr = this.round2((Number(base) + Number(subj.recurso)) / 2);
          }
        }));
      }
    }
  },

  methods: {
    // ---------- fetch / normaliza ----------
    async fetchPauta(turmaId) {
      try {
        this.loading = true;
        const resp = await api.listar(`/pautas/turmas/${turmaId}`);
        const payload = (resp && resp.data) ? resp.data : resp;
        this.normalizeApiData(payload || {});
      } catch (err) {
        console.error('Erro ao carregar pauta', err);
        alert('Erro ao carregar pauta. Verifique o console.');
      } finally {
        this.loading = false;
      }
    },

    toNumberOrZero(v) {
      if (v === null || v === undefined || v === '') return 0;
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    },

    normalizeApiData(payload) {
      try {
        const t = payload.turma || {};
        this.classInfo.academicYear = t.ano_letivo ?? this.classInfo.academicYear;
        this.classInfo.grade = (t.classe ? `${t.classe}ª CLASSE` : this.classInfo.grade) || (t.nome || '');
        this.classInfo.room = t.sala ?? this.classInfo.room;
        this.classInfo.class = t.serie ?? this.classInfo.class;
        this.classInfo.classDirector = t.diretor ?? this.classInfo.classDirector;
        if (t.curso && t.curso.nome) this.classInfo.specialty = t.curso.nome;
        if (t.nome) this.sheetTitle = t.nome;

        const pauta = payload.pauta || {};
        const subjectMap = new Map();
        const studentsMap = new Map();

        const normalizeTri = (tri) => {
          if (tri === null || tri === undefined) return null;
          const s = String(tri).trim().toLowerCase();
          if (['1', '01', 'primeiro'].includes(s)) return '1';
          if (['2', '02', 'segundo'].includes(s)) return '2';
          if (['3', '03', 'terceiro'].includes(s)) return '3';
          return s;
        };

        const pautaEntries = Array.isArray(pauta) ? pauta.entries() : Object.entries(pauta || {});
        for (const [alunoIdKey, disciplinas] of pautaEntries) {
          try {
            const alunoId = String(alunoIdKey);
            const disciplinasObj = disciplinas || {};
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
                const trimesRaw = (item && item.trimestres) ? item.trimestres : [];
                let trimesArray = [];

                if (Array.isArray(trimesRaw)) {
                  trimesArray = trimesRaw;
                } else if (trimesRaw && typeof trimesRaw === 'object') {
                  trimesArray = Object.values(trimesRaw);
                } else {
                  trimesArray = [];
                }

                const findMedia = (nome) => {
                  try {
                    const want = normalizeTri(nome);
                    const found = trimesArray.find(x => {
                      if (!x) return false;
                      const triVal = normalizeTri(x.trimestre ?? x.tri ?? x.numero ?? x.trimestre_num);
                      return triVal === want;
                    });
                    if (!found) return null;
                    const m = found.media ?? found.media_trimestre ?? found.valor ?? found.nota ?? null;
                    if (m === null || m === undefined || m === '') return null;
                    const n = Number(m);
                    return Number.isNaN(n) ? null : n;
                  } catch (e) {
                    console.warn('findMedia erro', e, trimesArray);
                    return null;
                  }
                };

                const mt1 = this.toNumberOrZero(findMedia('1'));
                const mt2 = this.toNumberOrZero(findMedia('2'));
                const mt3 = this.toNumberOrZero(findMedia('3'));

                const mfdVal = item && (item.media_final ?? item.mfd ?? item.media) ? Number(item.media_final ?? item.mfd ?? item.media) : 0;
                const finalVal = item && (item.media_final ?? item.mfd ?? item.media) ? Number(item.media_final ?? item.mfd ?? item.media) : 0;

                // capture possible exame/recurso fields if present in item
                const exameVal = (item && (item.exame !== undefined)) ? (item.exame === '' ? null : Number(item.exame)) : (item && (item.exame_valor !== undefined) ? Number(item.exame_valor) : null);
                const mfeVal = (item && (item.mfe !== undefined)) ? (item.mfe === '' ? null : Number(item.mfe)) : null;
                const recursoVal = (item && (item.recurso !== undefined)) ? (item.recurso === '' ? null : Number(item.recurso)) : null;
                const mfrVal = (item && (item.mfr !== undefined)) ? (item.mfr === '' ? null : Number(item.mfr)) : null;

                const subjObj = {
                  mt1: mt1,
                  mt2: mt2,
                  mt3: mt3,
                  mfd: this.toNumberOrZero(mfdVal),
                  final: this.toNumberOrZero(finalVal),
                  _origObservacao: item ? (item.observacao ?? null) : null,
                  observacao: item ? (item.observacao ?? null) : null,
                  disciplina_id: discKey,
                  disciplina_nome: discName,
                  // extras (exame/recurso) — podem ser null se ausentes
                  exame: exameVal != null ? exameVal : null,
                  mfe: mfeVal != null ? mfeVal : null,
                  recurso: recursoVal != null ? recursoVal : null,
                  mfr: mfrVal != null ? mfrVal : null
                };

                if (typeof this.$set === 'function') {
                  if (!student.subjects) this.$set(student.subjects, 'subjects', {});
                  this.$set(student.subjects, discKey, subjObj);
                } else {
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
            this.subjects.forEach(subject => {
              const sid = subject.id;
              if (!s.subjects) s.subjects = {};
              if (!s.subjects[sid]) {
                if (typeof this.$set === 'function') {
                  this.$set(s.subjects, sid, { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sid, disciplina_nome: subject.name, observacao: null, exame:null, mfe:null, recurso:null, mfr:null });
                } else {
                  s.subjects[sid] = { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sid, disciplina_nome: subject.name, observacao: null, exame:null, mfe:null, recurso:null, mfr:null };
                }
              } else {
                const sub = s.subjects[sid];
                if (!('exame' in sub)) sub.exame = null;
                if (!('mfe' in sub)) sub.mfe = null;
                if (!('recurso' in sub)) sub.recurso = null;
                if (!('mfr' in sub)) sub.mfr = null;
              }
            });

            // recalcula médias
            this.calculateAllAverages(s);
            return s;
          });

      } catch (err) {
        console.error('normalizeApiData erro', err, payload);
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
      this.subjects.forEach(subject => {
        const sid = subject.id;
        if (!student.subjects) student.subjects = {};
        if (!student.subjects[sid]) {
          this.$set(student.subjects, sid, { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sid, disciplina_nome: subject.name, observacao: null, exame:null, mfe:null, recurso:null, mfr:null });
        }
        const subj = student.subjects[sid];
        subj.mfd = this.round2(this.computeMean([subj.mt1, subj.mt2, subj.mt3]));
        // mantenho final = mfd por padrão (caso exista outra regra, adaptar aqui)
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

    isLowNote(value) {
      const n = Number(value);
      return !isNaN(n) && n < 10;
    },

    // novo: retorna true se valor numérico e >= 10
    isHighNote(value) {
      const n = Number(value);
      return !isNaN(n) && n >= 10;
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
        newStudent.subjects[sub.id] = { mt1:0, mt2:0, mt3:0, mfd:0, final:0, disciplina_id: sub.id, disciplina_nome: sub.name, observacao: null, exame:null, mfe:null, recurso:null, mfr:null };
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
        const html2pdfModule = (await import('html2pdf.js')).default || (await import('html2pdf.js'));
        const html2pdf = html2pdfModule.default ? html2pdfModule.default : html2pdfModule;

        const element = document.getElementById('sheetToPrint') || document.getElementById('mainContent');
        if (!element) {
          alert('Elemento para impressão não encontrado.');
          return;
        }

        const opt = {
          margin:       [10, 10, 10, 10],
          filename:     `${this.sheetTitle || 'pauta'}.pdf`,
          image:        { type: 'jpeg', quality: 1 },
          html2canvas:  {
            scale: 2.5,
            useCORS: true,
            logging: false,
            dpi: 300,
            letterRendering: true
          },
          jsPDF:        { unit: 'pt', format: 'a4', orientation: 'landscape' }
        };

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
