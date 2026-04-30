<template>
    <button type="submit" class="btn btn-secondary">
        <span class="loader me-2"></span> Guardando
    </button>
</template>


<style scoped>
.loader {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
    vertical-align: middle;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>