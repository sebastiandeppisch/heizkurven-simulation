
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import HeatingSystem from '../models/HeatingSystem';
import Room from '../models/Room';
import Simulation from '../models/Simulation';
import House from '../models/House';


// Eingabeparameter
const outsideTemperature = ref(5);
const slope = ref(1.5);
const offset = ref(30);
const simulationSpeed = ref(1);

const flowTemperature = ref(60);

// Räume initialisieren
const rooms = ref([
  { name: 'Wohnzimmer', setPoint: 22, currentTemperature: 20, heatingPowerPercentage: 0 },
  { name: 'Schlafzimmer', setPoint: 20, currentTemperature: 18, heatingPowerPercentage: 0 },
  { name: 'Küche', setPoint: 21, currentTemperature: 19, heatingPowerPercentage: 0 },
  { name: 'Bad', setPoint: 24, currentTemperature: 22, heatingPowerPercentage: 0 },
]);

// Heizsystem-Instanz
let heatingSystem = new HeatingSystem(slope.value, offset.value);
flowTemperature.value = heatingSystem.getFlowTemperature(outsideTemperature.value).toFixed(2);
let house = new House();
let simulation: Simulation | null = null;

rooms.value.forEach(room => {
  const newRoom = new Room(room.name, room.currentTemperature, 5000, 200, room.setPoint);
  house.addRoom(newRoom);
  house.addOutsideConnection(room.name, 100, outsideTemperature.value);
});

house.setNeighbors('Wohnzimmer', 'Schlafzimmer', 50); // Wärmeübertragung zwischen Wohnzimmer und Schlafzimmer
house.setNeighbors('Wohnzimmer', 'Küche', 40);       // Wärmeübertragung zwischen Wohnzimmer und Küche
house.setNeighbors('Küche', 'Bad', 30);  

// Simulationsstart-Funktion
const runSimulation = () => {

  heatingSystem.setSlope(slope.value);
  heatingSystem.setOffset(offset.value);

  // Simulation initialisieren und laufen lassen
  simulation = new Simulation(heatingSystem, house, outsideTemperature.value);

  house.getRooms().forEach((room, index) => {
    room.setTargetTemperature(rooms.value[index].setPoint);
  });

  simulation.run(simulationSpeed.value, simulationSpeed.value);

  house.getRooms().forEach((room, index) => {
    rooms.value[index].heatingPowerPercentage = room.getCurrentHeatingPowerFactor() * 100;
    rooms.value[index].currentTemperature = room.getCurrentTemperature();
  });

  flowTemperature.value = heatingSystem.getFlowTemperature(outsideTemperature.value).toFixed(2);

};

const interval = ref<number | null>(null);

onMounted(() => {
  interval.value = setInterval(() => {
    runSimulation();
  }, 100);
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});

</script>
<template>
  <div class="heating-simulation">
    <h2>Heizungssteuerung Simulation</h2>

    <div class="inputs">
      <h3>Eingaben</h3>
      <div>
        <label>Außentemperatur (°C):</label>
        <input v-model.number="outsideTemperature" type="number" />
      </div>
      <div>
        <label>Neigung:</label>
        <input v-model.number="slope" type="number" />
      </div>
      <div>
        <label>Verschiebung:</label>
        <input v-model.number="offset" type="number" />
      </div>
      <div v-for="(room, index) in rooms" :key="index">
        <label>{{ room.name }} Soll-Temperatur (°C):</label>
        <input v-model.number="room.setPoint" type="number" />
      </div>
      <div>
        <label>Simulationsgeschwindigkeit (in Sekunden pro Schritt):</label>
        <input v-model.number="simulationSpeed" type="number" />
      </div>
      <button @click="startSimulation">Simulation Starten</button>
    </div>

    <div class="outputs">
      <h3>Ausgaben</h3>

      <p>Heizungsvorlauftemperatur (°C): {{ flowTemperature }}</p>

      <div v-for="(room, index) in rooms" :key="index">
        <p>{{ room.name }} Ist-Temperatur (°C): {{ room.currentTemperature.toFixed(2) }}</p>
        <p>{{ room.name }} Heizleistung (%): {{ room.heatingPowerPercentage.toFixed(2) }}%</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.heating-simulation {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.inputs, .outputs {
  margin-bottom: 20px;
}

.inputs div, .outputs div {
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>
