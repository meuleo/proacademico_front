// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    ano_letivo: "",
    modelo: "saopio",
    nome_escola: "",
    notificacoesTotal: 0,
    modelo: "",
    usuario: "",
    permissoes: [],
    carregando: false, // loader global
    dadosMiniPautaShow: [],
    alunoTurma: 0
  },
  mutations: {
    setCarregando(state, valor) {
      state.carregando = valor
    }
  },
  actions: {
    // deixe em branco por enquanto
  },
  getters: {
    // deixe em branco por enquanto
  }
})
