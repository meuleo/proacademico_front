<template>
  <navbar />
  <sidebar />

  <div class="main-content">
      Termo dopsa Nivel 3
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import * as api from '@/api/api.js';
import * as request from '@/api/request.js';


export default {
  components: { navbar, sidebar },
  data() {
    return {
      termo: [],
    };
  },

  async created() {
    await api.listar('')
  },

  async mounted() {
    
  },

  methods: {
    
  },

};
</script>

<style>
  
</style>