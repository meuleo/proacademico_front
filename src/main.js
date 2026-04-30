import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'
import * as api from './api/api.js'

// Bootstrap e FontAwesome
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

let token = null

router.beforeEach(async (to, from, next) => {
  store.commit('setCarregando', true)

  token = sessionStorage.getItem('token')

  // Rotas que não exigem autenticação
  // Para App
  // const rotasPublicas = ['/', /login', '/registrar', '/esqueci-senha']
  const rotasPublicas = ['/login', '/registrar', '/esqueci-senha']
  const rotaEhPublica = rotasPublicas.includes(to.path)

  // Se não tiver token e rota não for pública → vai pro login
  if (!token && !rotaEhPublica) {
    store.commit('setCarregando', false)
    return next('/login')
  }

  // Se tiver token e ainda não carregou permissões
  if (token && !store.state.permissoes.length) {
    try {
      const resp = await api.listar('get-usuario')
      store.state.usuario = resp.usuario
      store.state.permissoes = resp.permissoes
    } catch (error) {
      console.error('Erro ao buscar usuário e permissões:', error)

      // Só remove token se for erro de autenticação
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        sessionStorage.removeItem('token')
        store.commit('setCarregando', false)
        return next('/login')
      }
    }
  }

  // Se a rota exigir permissão específica e o usuário não tiver
  if (to.meta.permissao && !store.state.permissoes.some(p => p.nome === to.meta.permissao)) {
    store.commit('setCarregando', false)
    return next('/acesso-negado')
  }

  store.commit('setCarregando', false)
  next()
})


const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
