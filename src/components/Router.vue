<script setup lang="ts">
import { ref, computed } from 'vue'
import SimulationPage from './../Pages/SimulationPage.vue'


const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  const key = currentPath.value || '#';


  return SimulationPage;
});
</script>

<template>
  <component :is="currentView" />
</template>