
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import HeatingSystem from '../models/HeatingSystem';
import Room from '../models/Room';
import Simulation from '../models/Simulation';
import House from '../models/House';
import RandomLevel from '../models/RandomLevel';
import FloorPlan from './FloorPlan.vue';
// Eingabeparameter

const simulationSpeed = ref(1);


const level = new RandomLevel();

const roomInfos = ref(level.rooms.map( room => room.getInfo() ));
const dimensions = ref(level.dimensions);

const outsideTemperature = ref(level.outsideTemperature);
const slope = ref(0.1);
const offset = ref(30);

const roomSetPoints = ref(level.rooms.map(room => room.getInfo().setPoint));

function changeSetPoint(index: number, value: number) {
  if(value !== roomSetPoints.value[index]){
    roomSetPoints.value[index] = value;
  }
}

const heatingSystem = level.getHeatingSystem();
const house = level.house;
const flowTemperature = ref(heatingSystem.getFlowTemperature(outsideTemperature.value).toFixed(2));

// Simulationsstart-Funktion
const runSimulation = () => {

  heatingSystem.setSlope(slope.value);
  heatingSystem.setOffset(offset.value);

  // Simulation initialisieren und laufen lassen
  const simulation = new Simulation(heatingSystem, house, outsideTemperature.value);
  simulation.setOutsideTemperature(outsideTemperature.value);

  house.getRooms().forEach((room, index) => {
    room.setTargetTemperature(roomSetPoints.value[index]);
  });

  simulation.run(simulationSpeed.value, 0.1);

  roomInfos.value = house.getRooms().map( room => room.getInfo());

  /*house.getRooms().forEach((room, index) => {
    rooms.value[index].heatingPowerPercentage = room.getCurrentHeatingPowerFactor() * 100;
    rooms.value[index].currentTemperature = room.getCurrentTemperature();
  });*/
  //roomInfo.value = house.getRooms().map( room => room.getInfo());


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
    <div class="inputs">
      <h3>Eingaben</h3>

      <div class="mb-4">
        <label for="temperature" class="mb-2">Außentemperatur:</label>
        <span class="font-bold">{{ outsideTemperature.toFixed(1) }}°C</span>
        <input id="temperature" type="range" min="-13" max="40" value="0" class="w-full" v-model.number="outsideTemperature" >
      </div>


      <div class="mb-4">
        <label for="offset" class="mb-2">Niveau (-13 bis 40): </label> <span class="font-bold"> {{ offset }}</span>
        <input id="offset" type="range" min="-13" max="40" value="0" class="w-full" v-model.number="offset" >
      </div>
    
      <div class="mb-4">
        <label for="slope" class="mb-2">Neigung (0.2 bis 3.5): </label><span class="font-bold">{{ slope }}</span>

        <input id="slope" type="range" min="0.2" max="3.5" step="0.1" value="1" class="w-full" v-model.number="slope">
        <div>
          0.3 bis 0.5: Gut isoliertes Haus mit Fußbodenheizung<br>
          1.0 bis 1.2: Gut isoliertes Haus mit Radiatoren <br>
          1.4 bis 1.6: älteres Haus mit Radiatoren<br>
        </div>
      </div>

      <div>
        <label class="mb-2">Simulationsgeschwindigkeit:</label>
        <input type="range" min="1" max="10" class="w-full" v-model.number="simulationSpeed" />
      </div>
    </div>

    <div class="outputs">
      <p>Heizungsvorlauftemperatur: <span class="font-bold"> {{ flowTemperature }}°C</span></p>
    </div>
    <FloorPlan :rooms="roomInfos" :dimensions="dimensions" @changeSetPoint="changeSetPoint" />
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
