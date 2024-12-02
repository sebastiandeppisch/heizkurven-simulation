<script lang="ts" setup>
import Simulation from './components/Simulation.vue';
import { ref } from 'vue';
//import tourSteps from '@/tourConfig';
import { VTour } from '@globalhive/vuejs-tour';
import '@globalhive/vuejs-tour/dist/style.css';
import tourSteps from '@/tourConfig';
import { faHouse, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const tour = ref(); 

function startTour () {
  localStorage.removeItem('vjt-default');
  tour.value.startTour();
}

function restart () {
  window.location.reload();
}

</script>
<template>
  <VTour ref="tour" :steps="tourSteps" autostart :buttonLabels='{next: "Weiter", back: "Zurück", done: "Beenden", skip: "Überspringen"}'/>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-gray-800 text-white p-4 shadow-md" data-tour="start">
      <h1 class="text-3xl font-bold text-center">Heizungssteuerung Simulation</h1>
    </header>

    

    <main class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-5xl p-6 ">

        <div class="flex flex-row justify-end mb-4 gap-4">
          <button @click="restart" class="border border-gray-500 rounded font-bold bg-white p-2" date-tour="new-house"><font-awesome-icon :icon="faHouse" class="pr-2"/>Neues Haus erstellen</button>
          <button @click="startTour" class="border border-gray-500 rounded font-bold bg-white p-2"><font-awesome-icon :icon="faQuestion" class="pr-2"/>Tour starten</button>

        </div>
        
        <Simulation data-tour="test"/>

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