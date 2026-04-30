<template>
    <div class="loader-container">
      <div class="loader"></div>
      <p class="mt-3">Carregando...</p>
    </div>
</template>

<style>
  .loader-container {
    padding-top: 80px;
    text-align: center;
  }

  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>