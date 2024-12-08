<script setup lang="ts">
import { ref, computed } from 'vue'
import SimulationPage from './../Pages/SimulationPage.vue'
import Methodology from './Methodology.vue';
import Changelog from './Changelog.vue';
const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  const key = currentPath.value || '#';

  if(key === '#methodik') {
    return Methodology;
  }

  if(key === '#changelog') {
    return Changelog;
  }

  return SimulationPage;
});
</script>

<template>
  <component :is="currentView" />
</template>