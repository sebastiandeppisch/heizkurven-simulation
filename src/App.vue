<script lang="ts" setup>
import Simulation from './components/Simulation.vue';
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-gray-800 text-white p-4 shadow-md">
      <h1 class="text-3xl font-bold text-center">Heizungssteuerung Simulation</h1>
    </header>

    <main class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-5xl p-6 ">
        <Simulation />
      </div>
    </main>

    <footer class="bg-gray-800 text-white p-4 mt-6">
      <p class="text-center text-sm">© Sebastian Deppisch 2024 &ndash; <a href="https://sebastiandeppisch.de/impressum">Impressum</a> &ndash; <a href="https://Sebastiandeppisch.de/datenschutz">Datenschutzerklärung</a> </p>
    </footer>
  </div>
</template>

<style scoped>
/* Optional: Anpassungen für eine bessere Darstellung */
body {
  font-family: 'Arial', sans-serif;
}
</style>