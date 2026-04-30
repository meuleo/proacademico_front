<template>
  <navbar />
  <sidebar />

  <div class="main-content">
    <div class="container-fluid">
    
          <!-- Cabeçalho -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="fas fa-edit me-2"></i>Ver...</h2>
          </div>

          <div class="co">

          </div>
    
        </div>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue';
import sidebar from '@/components/sidebar.vue';
import * as api from '../../api/api.js';
import * as request from '../../api/request.js';


export default {
  components: { navbar, sidebar },
  data() {
    return {
      certificado: [],
    };
  },

  created() {
    
  },

  async mounted() {
    
  },

  methods: {
    
  },

};
</script>
<style>
  
</style>