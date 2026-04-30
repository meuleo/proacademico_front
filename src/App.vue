<template>
  <Loader v-if="$store.state.carregando" />
  <router-view v-else />
</template>

<script>
import Loader from './components/Loader.vue'

export default {
  name: 'App',
  components: { Loader }
}
</script>