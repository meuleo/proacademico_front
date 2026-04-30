export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : false
}

// Tables Backup
// Os dados destas tabelas serão buscados,
// Sempre que instalar a versão offline numa nova Maquina
export const tables = [
  {
    "perfil": "director_geral",
    "tables": [
      "alunos",
      "turmas",
      "alunos_turmas",
      "notas",
      ""
    ] 
  },
  {
    "perfil": "director_pedagogico",
    "tables": [
      "alunos",
      "turmas",
      "alunos_turmas",
      "notas",
      ""
    ] 
  },
  {
    "perfil": "director_administrativo",
    "tables": [
      "alunos",
      "turmas",
      "alunos_turmas",
      "notas",
      ""
    ] 
  },
  {
    "perfil": "secretaria",
    "tables": [
      "alunos",
      "turmas",
      "alunos_turmas",
      "notas",
      ""
    ] 
  },
  {
    "perfil": "professor",
    "tables": [
      "alunos",
      "turmas",
      "alunos_turmas",
      "notas",
      ""
    ]
  },
  {
    "perfil": "estudante",
    "tables": [
      "alunos",
      "turmas",
      "alunos_turmas",
      "notas",
      ""
    ] 
  },

]
