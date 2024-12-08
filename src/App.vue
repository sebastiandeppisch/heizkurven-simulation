<script lang="ts" setup>
import Router from './components/Router.vue';
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-gray-800 text-white p-4 shadow-md" data-tour="start">
      <h1 class="text-3xl font-bold text-center">Heizungssteuerung Simulation</h1>
    </header>

    <main class="flex-1 flex justify-center">
      <div class="w-full max-w-5xl p-6">
        <Router />
      </div>
    </main>

    <footer class="bg-gray-800 text-white p-4 mt-6">
      <p class="text-center text-sm">© Sebastian Deppisch 2024 &ndash; <a href="https://sebastiandeppisch.de/impressum">Impressum</a> &ndash; <a href="https://Sebastiandeppisch.de/datenschutz">Datenschutzerklärung</a> </p>
    </footer>
  </div>
</template>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
}
</style>