<template>
  <div>
      <div class="sidebar sidebar-movel" id="sidebar">
    <div class="sidebar-header">
      <h5>
        {{ nome_escola }}
      </h5>
    </div>

    <div class="sidebar-menu">
  <div>
    <router-link to="/painel-aluno" class="router-link">
      <div class="menu-item" :class="{ active: $route.path === '/painel-aluno' }">
        <i class="fas fa-home"></i>
        <span>Início</span>
      </div>
    </router-link>
  </div>

  <div v-if="$store.state.alunoTurma!=0">
    <router-link to="#" class="topo-router-link" @click="verHorario($store.state.alunoTurma)">
      <div class="menu-item" :class="{ active: $route.path === '/horario' }">
        <i class="fas fa-calendar" aria-hidden="true"></i>
        <span>Horário</span>
      </div>
    </router-link> 
  </div>

  <!-- div>
    <router-link to="/actividades" class="topo-router-link" @click="closeMenu">
      <div class="menu-item" :class="{ active: $route.path === '/actividades' }">
        <i class="fas fa-pencil" aria-hidden="true"></i>
        <span>Actividades</span>
      </div>
    </router-link> 
  </div -->
  
  <div>
    <router-link to="/notas" class="topo-router-link" @click="closeMenu">
      <div class="menu-item" :class="{ active: $route.path === '/notas' }">
        <i class="fas fa-book" aria-hidden="true"></i>
        <span>Notas</span>
      </div>
    </router-link>
  </div>

  <!-- div>
    <router-link to="/solicitacoes" class="topo-router-link" @click="closeMenu">
      <div class="menu-item" :class="{ active: $route.path === '/solicitacoes' }">
        <i class="fas fa-hand" aria-hidden="true"></i>
        <span>Solicitações</span>
      </div>
    </router-link> 
  </div -->
</div>



  </div>

<header id="topo-navbar" class="topo-navbar">
    <div class="topo-container">
      <div class="topo-menu-scroll-wrapper">
        <button @click="scrollMenu(-1)" class="scroll-btn left">
          <i class="fas fa-chevron-left"></i>
        </button>

        <nav
          class="topo-menu"
          role="navigation"
          aria-label="Top navigation"
          ref="menuContainer"
          @scroll="onMenuScroll"
        >
          <router-link to="/painel-aluno" class="topo-router-link" @click="closeMenu">
            <div class="topo-item" :class="{ active: $route.path === '/painel-aluno' }">
              <i class="fas fa-home" aria-hidden="true"></i>
              <span>Início</span>
            </div>
          </router-link> 

          
          <router-link v-if="$store.state.alunoTurma!=0" to="/" class="topo-router-link" @click="verHorario($store.state.alunoTurma)">
            <div class="topo-item" :class="{ active: $route.path === '/' }">
              <i class="fas fa-calendar" aria-hidden="true"></i>
              <span>Horário</span>
            </div>
          </router-link>

          <!-- router-link to="/" class="topo-router-link" @click="closeMenu">
            <div class="topo-item" :class="{ active: $route.path === '/' }">
              <i class="fas fa-pencil" aria-hidden="true"></i>
              <span>Actividades</span>
            </div>
          </router-link -->

          <router-link to="/notas" class="topo-router-link" @click="closeMenu">
            <div class="topo-item" :class="{ active: $route.path === '/notas' }">
              <i class="fas fa-book" aria-hidden="true"></i>
              <span>Notas</span>
            </div>
          </router-link> 

          <!-- router-link to="/" class="topo-router-link" @click="closeMenu">
            <div class="topo-item" :class="{ active: $route.path === '/' }">
              <i class="fas fa-hand" aria-hidden="true"></i>
              <span>Solicitações</span>
            </div>
          </router-link --> 

        </nav>

        <button @click="scrollMenu(1)" class="scroll-btn right">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </header>

  </div>
</template>

<script>
import * as api from '@/api/api.js';
import * as request from '@/api/request.js';

export default {
  name: 'TopoNavbar',
  data() {
    return {
      nome_escola: '',
      activeMenu: null,
      teleSubmenuStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        minWidth: '180px'
      },
      // guarda referência do elemento clicado para calcular posicionamento
      _lastLabelRect: null
    };
  },
  computed: {
    isPedagogicaActive() {
      const paths = ['/anos-letivos', '/professores', '/cursos', '/turmas', '/disciplinas', '/mini-pautas', '/arquivados', '/documentos'];
      return paths.some(path => this.$route.path.startsWith(path));
    }
  },
  created() {
    if (this.$store && this.$store.state && (this.$store.state.nome_escola === '' || !this.$store.state.nome_escola)) {
      this.getNomeEscola();
    } else if (this.$store && this.$store.state) {
      this.nome_escola = this.$store.state.nome_escola || '';
    }
  },
  mounted() {
    // Sidebar toggle for mobile
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('show')
    })

    // clique fora - fecha menus (leva em conta o submenu teleported)
    this._onDocClick = (e) => {
      const menuContainer = this.$refs.menuContainer;
      const tele = this.$refs.teleSubmenu;
      if (menuContainer && (menuContainer.contains(e.target))) {
        // clique dentro do menu principal -> não fecha
        return;
      }
      if (tele && tele.contains && tele.contains(e.target)) {
        // clique dentro do teleported submenu -> não fecha
        return;
      }
      this.closeMenu();
    };
    document.addEventListener('click', this._onDocClick, true);

    // resize/scroll global -> reposicionar ou fechar
    this._onWindowChange = () => {
      if (this.activeMenu) {
        // tenta reposicionar se possível, ou fecha se não temos rect
        if (this._lastLabelRect) this.updateTelePositionFromRect(this._lastLabelRect);
        else this.closeMenu();
      }
      this.updateScrollButtons();
    };
    window.addEventListener('resize', this._onWindowChange);
    window.addEventListener('scroll', this._onWindowChange, true);

    // update initial scroll buttons
    this.$nextTick(() => {
      this.updateScrollButtons();
      if (this.$refs.menuContainer) this.$refs.menuContainer.addEventListener('scroll', this.updateScrollButtons);
    });
  },
  beforeUnmount() {
    document.removeEventListener('click', this._onDocClick, true);
    window.removeEventListener('resize', this._onWindowChange);
    window.removeEventListener('scroll', this._onWindowChange, true);
    if (this.$refs.menuContainer) this.$refs.menuContainer.removeEventListener('scroll', this.updateScrollButtons);
  },
  methods: {
      toggleSubmenu(menuId, event) {
        const submenu = document.getElementById(menuId + '-submenu')
        submenu.classList.toggle('show')
        const chevron = event.currentTarget.querySelector('.fa-chevron-down')
        chevron.style.transform = submenu.classList.contains('show')
          ? 'rotate(180deg)'
          : 'rotate(0deg)'
    },
    toggleMenu(menuId, event) {
      // se clicar no mesmo menu -> fecha
      if (this.activeMenu === menuId) {
        this.closeMenu();
        return;
      }
      // abre o menu: calcula e guarda rect do label
      const labelEl = event && event.currentTarget ? event.currentTarget : null;
      let rect = null;
      if (labelEl && labelEl.getBoundingClientRect) {
        rect = labelEl.getBoundingClientRect();
      } else {
        // fallback: tenta procurar elemento .topo-menu-label correspondente
        const guessed = event && event.target ? event.target.closest('.topo-menu-label') : null;
        if (guessed) rect = guessed.getBoundingClientRect();
      }
      this._lastLabelRect = rect;
      if (rect) this.updateTelePositionFromRect(rect);
      this.activeMenu = menuId;
    },
    closeMenu() {
      this.activeMenu = null;
      this._lastLabelRect = null;
    },
    updateTelePositionFromRect(rect) {
      // rect: DOMRect
      const margin = 6; // gap between label and submenu
      const bodyScrollTop = window.scrollY || window.pageYOffset;
      const bodyScrollLeft = window.scrollX || window.pageXOffset;

      // posiciona abaixo do rect; ajusta para não sair da viewport à direita
      const minWidth = Math.max(180, Math.round(rect.width));
      let left = rect.left + bodyScrollLeft;
      let top = rect.bottom + bodyScrollTop + margin;

      // evitar overflow horizontal
      const viewportW = document.documentElement.clientWidth;
      const submenuEstimatedWidth = minWidth;
      if (left + submenuEstimatedWidth + 10 > viewportW + bodyScrollLeft) {
        left = Math.max(10, viewportW + bodyScrollLeft - submenuEstimatedWidth - 10);
      }
      // evitar overflow vertical (se for necessário abrir para cima)
      const viewportH = document.documentElement.clientHeight;
      const estimatedHeight = 240; // um palpite razoável; o CSS não define fixo
      if (top + estimatedHeight > bodyScrollTop + viewportH) {
        // abre acima do label
        top = rect.top + bodyScrollTop - estimatedHeight - margin;
        if (top < 10) top = 10;
      }

      this.teleSubmenuStyle = {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${minWidth}px`,
        zIndex: 10000
      };
    },
    enablePermission(permission) {
      let permissions = [];
      if (this.$store && this.$store.state && this.$store.state.permissoes && this.$store.state.permissoes.length > 0) {
        permissions = this.$store.state.permissoes;
      } else {
        const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
        if (usuario && usuario.permissoes) permissions = usuario.permissoes;
      }
      if (!permissions || !permissions.length) return false;
      return permissions.some(el => el.nome === permission);
    },
    async getNomeEscola() {
      try {
        const resp = await api.getEscola();
        const anoLetivo = await api.listar(request.getAnoLetivo);
        const matricula = await api.listar('get-matricula');

        this.$store.state.alunoTurma = matricula.turma

        this.nome_escola = resp && resp.nome ? resp.nome : '';

        if (this.$store && this.$store.state) {
          
          this.$store.state.nome_escola = resp && resp.nome ? resp.nome : '';
          this.$store.state.modelo = resp && resp.modelo ? resp.modelo : '';

          if (anoLetivo && anoLetivo.ano_letivo) this.$store.state.ano_letivo = anoLetivo.ano_letivo;
        }
      } catch (err) {
        console.error('Erro ao carregar as configurações da escola.', err);
      }
    },
    scrollMenu(direction = 1) {
      const container = this.$refs.menuContainer;
      if (!container) return;
      const amount = Math.round(container.clientWidth * 0.6) * direction;
      container.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(this.updateScrollButtons, 300);
      // se o menu estava aberto, reposiciona/fecha
      if (this._lastLabelRect) {
        // preferimos fechar para evitar confusão ao usar o scroll
        this.closeMenu(); 
      }
    },
    updateScrollButtons() {
      const container = this.$refs.menuContainer;
     
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
     
    },
    onMenuScroll() {
      // se quiseres que o submenu se reposicione durante scroll horizontal
      // podes chamar this.updateTelePositionFromRect(this._lastLabelRect) aqui.
      // mas como o label pode sair do viewport, é mais estável fechar o submenu:
      if (this.activeMenu) this.closeMenu();
      this.updateScrollButtons();
    },
    verHorario(item) {
      this.$router.push({
        name: 'horario.aluno',
        params: {
          disciplina_id: item.id,
          ano_letivo: item?.ano_letivo || "sem Ano letivo",
          nome_curso: item?.curso?.nome || "nd",
          horario_id: 1,
          abreviatura: item?.curso?.abreviatura || 'nd',
          turma_id: item?.id || "nd",
          classe: item?.classe || "nd",
          serie: item?.serie || "nd",
          sala: item?.sala || "sem Sala",
          turno: item?.turno || "nd",
          disciplina_nome: item?.nome || "nd",
          disciplina_abreviatura: item?.abreviatura || "nd"
        }
      });
      
    },
  }
};
</script>

<style scoped>
.topo-navbar {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 999;
  background: #ffffff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}
.topo-container {
  max-width: 98%;
  margin: 0 auto;
  padding: 6px 12px;
}
.topo-menu-scroll-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}
.topo-scroll-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px 8px;
  font-size: 16px;
}

.topo-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  white-space: nowrap;
  padding: 6px 38px;
  flex: 1 1 auto;
}
.topo-router-link { text-decoration: none; color: inherit; }
.topo-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}
.topo-item i { min-width: 18px; text-align:center; }
.topo-item span { font-size: 14px; }
.topo-item.active { background: rgb(199, 234, 255); }
.topo-menu-group { position: relative; }

/* topo-submenu styles (aplicam-se ao teleported element) */
.topo-submenu {
  position: absolute; /* set by inline style too */
  background: #fff;
  border: 1px solid #e6e6e6;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  border-radius: 6px;
  padding: 8px 0;
  z-index: 10000;
  min-width: 200px;
}
.topo-subitem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
}
.topo-subitem:hover { background: #f7f7f7; }
.topo-chevron { margin-left: 6px; font-size: 12px; }

/* esconder scroll bar levemente (visual) */
.topo-menu::-webkit-scrollbar { height: 8px; }
.topo-menu::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 6px; }

/* esconder barras nativas */
.topo-menu { -ms-overflow-style: none; scrollbar-width: none; }
.topo-menu::-webkit-scrollbar { display: none; }


/* responsivo: esconder topo-menu em telas pequenas (<=991) */
.sidebar { display: none; }

@media (max-width: 758px) {
.topo-navbar { display: none !important; }
.sidebar { display: block !important; }
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20; /* Garante que fiquem por cima */
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  color: #555;
}

.scroll-btn:hover {
  background-color: #f5f5f5;
  transform: translateY(-50%) scale(1.1);
}

.scroll-btn.left {
  left: 0;
}

.scroll-btn.right {
  right: 0;
}
</style>