<template>
  <!-- navbar -->
  <navbar />
  <!-- sidebar -->
  <sidebar />

  <!-- Main Content -->
  <div class="main-content" id="mainContent">
    <div class="container-fluid px-4">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4 mt-4">
        <div class="header-actions mt-3">
          <span style="margin-right: 10px; position: relative; top: 3px !important; display: inline-block;">
            <Voltar/>
          </span>
          <button class="btn btn-primary" @click="showPersonalData = !showPersonalData">
            <i class="fas fa-user-lock me-2"></i>
            {{ showPersonalData ? 'Ocultar dados' : 'Ver dados pessoais' }}
          </button>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div v-if="professor" class="teacher-detail-container">
        <!-- Perfil do Professor -->
        <div class="row">
          <div class="col-lg-4" style="border-radius: 8px !important;">
            <div class="teacher-profile-card" style="border-radius: 8px !important;">
              <div class="teacher-avatar-large shadow shadow-Regular">
                {{ professor?.nome_completo.charAt(0).toUpperCase() }}
              </div>
              <h2 class="teacher-name">{{ professor?.nome_completo || 'Não informado' }}</h2>
              
              <div v-if="showPersonalData" class="personal-info-section">
                <!-- DADOS PESSOAIS -->
                <h4 class="section-title"><i class="fas fa-user me-2"></i>Dados Pessoais</h4>

                <div class="info-item">
                  <span class="info-label"><i class="fas fa-phone me-2"></i>Telefone:</span>
                  <p class="info-value text-muted">{{ professor?.telefone || 'Não informado' }}</p>
                </div>

                <!-- <div class="info-item">
                  <span class="info-label"><i class="fas fa-envelope me-2"></i>Email:</span>
                  <p class="info-value text-muted">{{ professor?.email || 'Não informado' }}</p>
                </div> -->

                <div class="info-item">
                  <span class="info-label"><i class="fas fa-calendar-alt me-2"></i>Data de Nascimento:</span>
                  <p class="info-value text-muted">{{ professor?.data_nascimento || 'Não informado' }}</p>
                </div>

                <div class="info-item">
                  <span class="info-label"><i class="fas fa-map-marker-alt me-2"></i>Bairro:</span>
                  <p class="info-value text-muted">{{ professor?.bairro || 'Não informado' }}</p>
                </div>


                <!-- DADOS ACADÊMICOS -->
                <h4 class="section-title mt-4"><i class="fas fa-graduation-cap me-2"></i>Dados Académicos</h4>

                <div class="info-item">
                  <span class="info-label"><i class="fas fa-university me-2"></i>Grau Acadêmico:</span>
                  <p class="info-value text-muted">{{ professor?.grau_academico || 'Não informado' }}</p>
                </div>

                <div class="info-item">
                  <span class="info-label"><i class="fas fa-book me-2"></i>Especialidade:</span>
                  <p class="info-value text-muted">{{ professor?.especialidade || 'Não informado' }}</p>
                </div>

                <!-- DISCIPLINAS -->
                <h4 class="section-title mt-4"><i class="fas fa-chalkboard-teacher me-2"></i>Disciplinas ({{ professor?.disciplinas.length }})</h4>
                <div v-if="professor?.disciplinas.length > 0">
                  <div class="info-item" v-for="(item, index) in professor?.disciplinas" :key="index">
                    <p class="info-value"><i class="fas fa-book-open me-2"></i> {{ item.nome }}</p>
                  </div>
                </div>
                <div v-else class="text-center p-4">
                  Nenhuma disciplina foi Registada
                </div>
              </div>

            </div>
          </div>

          <div class="col-lg-8" style="border-radius: 8px !important;">
            <!-- Informações Acadêmicas -->
            <div class="teacher-info-card" style="border-radius: 8px !important;">
              <h3 class="section-title"><i class="fas fa-book-open me-2"></i>Turmas associadas ({{ professor?.turmas?.length }})</h3>
              
              <div v-if="professor?.turmas && professor?.turmas?.length > 0">
                <div class="academic-item" v-for="(turma, index) in professor?.turmas" :key="index">
                  <div class="academic-header">
                    <h4>{{ turma?.disciplina?.nome }}</h4>
                  </div>
                  <div class="academic-details">
                    <div class="detail-item">
                      <i class="fas fa-graduation-cap"></i>
                      <span>{{ turma?.turma?.curso?.nome || 'Regular' }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-clock"></i>
                      <span>Turno: {{ turma?.turma?.turno }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-calendar"></i>
                      <span>{{ turma?.turma?.classe || 'Iniciação' }}ª Classe - Turma {{ turma?.turma?.serie }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-door-open"></i>
                      <span>Sala: {{ turma?.turma?.sala }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="fas fa-book empty-icon"></i>
                <p>Nenhuma turma atribuída no momento</p>
              </div>
            </div>

            <!-- Avaliações -->
          </div>
        </div>
      </div>

      <div v-else class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">A carregar...</span>
        </div>
        <p class="mt-3">A carregar informações do professor?...</p>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import sidebar from '@/components/sidebar.vue'
import Voltar from '@/components/voltar.vue'
import * as api from "../../api/api.js"

export default {
  components: { navbar, sidebar, Voltar },
  data() {
    return {
      professor: null,
      showPersonalData: false
    }
  },

  async created() {
    const id = this.$route.params.id
    try {
      this.professor = await api.show(`funcionarios-professores/show/${id}`)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style scoped>
/* Estilos gerais */
.main-content {
  background-color: #f5f7fb;
}

.teacher-detail-container {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-back {
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  padding: 8px 16px;
  color: var(--text-color);
  transition: all 0.3s;
}

.btn-back:hover {
  background-color: #f0f0f0;
  transform: translateX(-2px);
}

/* Card de perfil */
.teacher-profile-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--card-shadow);
  height: 100%;
}

.teacher-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
}

.teacher-name {
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 2rem;
}

/* Seções de informação */
.teacher-info-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--card-shadow);
  margin-bottom: 1.5rem;
}

.section-title {
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

/* Informações pessoais */
.personal-info-section {
  text-align: left;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.info-item {
  margin-bottom: 1rem;
}

.info-label {
  font-weight: 500;
  color: var(--text-color);
  display: inline-block;
  width: 160px;
}

.info-value {
  color: var(--text-light);
}

/* Atribuições acadêmicas */
.academic-item {
  padding: 1.25rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.academic-item:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
}

.academic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.academic-header h4 {
  margin: 0;
  color: var(--text-color);
}

.academic-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  color: var(--text-light);
}

.detail-item i {
  margin-right: 8px;
  color: var(--primary-color);
}

/* Avaliações */
/* vazio */

/* Estados vazios e loading */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-light);
}

/* Responsividade */
@media (max-width: 758px) {
  .academic-details {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .teacher-profile-card {
    margin-bottom: 1.5rem;
  }
  
  .academic-details {
    grid-template-columns: 1fr;
  }
  
  .evaluation-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .evaluation-header {
    flex-wrap: wrap;
  }
  
  .evaluation-date {
    width: 100%;
    margin-top: 0.5rem;
    margin-left: 55px;
  }
  
  .evaluation-comment {
    padding-left: 0;
  }
}
</style>