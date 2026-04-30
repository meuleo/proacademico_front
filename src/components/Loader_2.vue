<template>
  <div class="loader-overlay">
    <div>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <div class="mt-1" style="margin-left: -25px;">
        Aplicando...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style scoped>
.loader-overlay {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  /* background: rgba(255, 255, 255, 0.8); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

@media (min-width: 999px) {
  .loader-overlay {
    left: 50%;
    transform: translateX(-40%);
  }
}

</style>
