// src/api/api.js
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css' 

// Base URL — sem barra final para evitar confusões
const BASE_URL = import.meta.env.VITE_API_URL

// Instância axios
const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // não definimos Authorization aqui para evitar usar um token "antigo"
  },
  timeout: 50000
})

// Interceptor: anexa token atualizado antes de cada requisição
request.interceptors.request.use(cfg => {
  try {
    const t = sessionStorage.getItem('token')
    if (t) {
      cfg.headers = cfg.headers || {}
      cfg.headers['Authorization'] = `Bearer ${t}`
    } else {
      // garante que não fica um header stale caso não exista token
      if (cfg.headers && cfg.headers['Authorization']) {
        delete cfg.headers['Authorization']
      }
    }
  } catch (e) {
    // se sessionStorage der erro (ex: modo privado em alguns browsers), apenas loga
    console.warn('[api] erro de autorização', e)
  }
  return cfg
}, err => Promise.reject(err))

// Helper para extrair mensagem segura
function safeMessageFromError(error, fallback = 'Erro na comunicação com o servidor.') {
  return error?.response?.data?.message || error?.message || fallback
}

/* -------------------------
   Funções públicas
   ------------------------- */

export async function listar(url) {
  console.log('[api] listar ->', url)
  try {
    const resp = await request.get(url)
    return resp.data
  } catch (error) {
    // const msg = safeMessageFromError(error, 'Erro ao listar.')
    if (error.message === 'Network Error') {
      toast.error('Erro de conexão.')
    } else {
      toast.error(error.response.data.mensagem)
    }
    console.error('[api.listar] erro:', error)
    throw error
  }
}

export async function add(url, data) {
  console.log('[api] add ->', url, data)
  try {
    const resp = await request.post(url, data)
    return resp.data
  } catch (error) {
    const msg = safeMessageFromError(error, 'Erro ao adicionar.')
    if (error.message === 'Network Error') {
      toast.error('Erro de conexão com o servidor.')
    } else {
      toast.error(msg)
    }
    console.error('[api.add] erro:', error)
    throw error
  }
}

export async function show(url) {
  console.log('[api] show ->', url)
  try {
    const resp = await request.get(url)
    return resp.data
  } catch (error) {
    const msg = safeMessageFromError(error, 'Erro ao buscar.')
    toast.error(msg)
    console.error('[api.show] erro:', error)
    throw error
  }
}

export async function update(url, data) {
  console.log('[api] update ->', url, data)
  try {
    const resp = await request.put(url, data)
    return resp.data
  } catch (error) {
    const msg = safeMessageFromError(error, 'Erro ao atualizar.')
    toast.error(msg)
    console.error('[api.update] erro:', error)
    throw error
  }
}

export async function destroy(url) {
  console.log('[api] destroy ->', url)
  try {
    const resp = await request.delete(url)
    return resp.data
  } catch (error) {
    const msg = safeMessageFromError(error, 'Erro ao excluir.')
    toast.error(msg)
    console.error('[api.destroy] erro:', error)
    throw error
  }
}

// Função específica: getEscola
export async function getEscola() {
  console.log('[api] getEscola chamado ->', `${BASE_URL}/escolas-get-escola`)
  try {
    const response = await request.get('escolas-get-escola')
    const escola = response.data || {}

    // Se a API não retornar cabecalhos como array, assegura array vazio
    if (!Array.isArray(escola.cabecalhos)) {
      escola.cabecalhos = []
    }

    return escola
  } catch (error) {
    const msg = safeMessageFromError(error, 'Erro ao buscar os dados da escola.')
    if (error.message === 'Network Error') {
      toast.error('Erro de conexão com o servidor.')
    } else {
      toast.error(msg)
    }
    console.error('[api.getEscola] erro:', error)
    throw error
  }
}

// export default para importar como `import api from '...'; api.getEscola()`
export default {
  listar,
  add,
  show,
  update,
  destroy,
  getEscola
}