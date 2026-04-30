<template>
  <div>
    Conexão: {{ conectado ? 'Online' : 'Offline' }} <br>
  </div>
</template>

<script>
import { tables, isOnline } from '../../assets/js/util.js'

export default {
    data() {
        return {
          conectado: isOnline(),
        }
    },

    created() {
      if(this.conectado) {
        //guarda online
        alert("Estou Online" + tables)
        // Se Response success
        // Guarda Offiline comentado
      } else {
        alert("Estou Offline")
        // Guarda Offiline comentado
      } 
    }
}
</script>
