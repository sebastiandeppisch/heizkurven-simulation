<script lang="ts" setup>
import FloorPlan from './components/FloorPlan.vue';
import Simulation from './components/Simulation.vue';
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 text-white p-4 shadow-md">
      <h1 class="text-3xl font-bold text-center">Heizungssteuerung Simulation</h1>
    </header>

    <!-- Hauptinhalt -->
    <main class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <Simulation />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4 mt-6">
      <p class="text-center text-sm">TODO</p>
    </footer>
  </div>
</template>

<style scoped>
/* Optional: Anpassungen für eine bessere Darstellung */
body {
  font-family: 'Arial', sans-serif;
}
</style>