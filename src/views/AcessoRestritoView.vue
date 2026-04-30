<template>
    <div style="height: 98vh; display: flex; justify-content: center; align-items: center;">
        <div class="text-center alert alert-danger card p-4">
            <div class="mb-3">
                <i class="fas fa-times-circle"></i>
            </div>
            <h1 >Acesso Negado</h1>
            <p style="opa">Não tem permissão para acessar esta àrea</p>
            <div style="font-size: 14px;">
                <router-link to="/login">
                    Voltar
                </router-link>
            </div>
        </div>
    </div>
</template>