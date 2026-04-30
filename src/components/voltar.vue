<template>
    <button class="btn-back" @click="$router.back()">
        <i class="fas fa-arrow-left"></i>
    </button>
</template>

<style scoped>
    .btn-back {
        width: 25px;
        height: 25px;
        border: none !important;
        border-radius: 50%;     /* deixa redondo */
        background: transparent; /* sem preenchimento */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        position: relative;
        top: -2px;
    }

    .btn-back:hover {
        border-color: #000; /* escurece ao passar o mouse */
        background: rgba(0, 0, 0, 0.05); /* leve destaque opcional */
    }

    .btn-back i {
        font-size: 14px;
        color: #333;
    }
</style>