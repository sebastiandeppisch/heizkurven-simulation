<script lang="ts" setup>
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import HeatingSystem from '../models/HeatingSystem';
import Room from '../models/Room';
import Simulation from '../models/Simulation';
import House from '../models/House';
import RandomLevel from '../models/RandomLevel';
import FloorPlan from './FloorPlan.vue';
import Curves from './Curves.vue';
import Slider from './Slider.vue';
import TemperatureSlider from './TemperatureSlider.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import offsetImage from '@/assets/offset.svg';
import slopeImage from '@/assets/slope.svg';
const simulationSpeed = ref(1);


const level = new RandomLevel();


const roomInfos = ref(level.rooms.map(room => room.getInfo()));
const dimensions = ref(level.dimensions);

const outsideTemperature = ref(level.outsideTemperature);

const orgSlope = level.heatingSystem.getSlope();
const orgOffset = level.heatingSystem.getOffset();

const slope = ref(orgSlope);
const offset = ref(orgOffset);

const roomSetPoints = ref(level.rooms.map(room => room.getInfo().setPoint));


const maxOutsideTemperature = computed(() => {
  return Math.ceil(Math.max(...roomSetPoints.value));
});


function changeSetPoint(index: number, value: number) {
  if (value !== roomSetPoints.value[index]) {
    roomSetPoints.value[index] = value;
  }
}

const heatingSystem = level.heatingSystem;
const house = level.house;
const flowTemperature = ref(heatingSystem.getFlowTemperature(outsideTemperature.value).toFixed(2));

// Simulationsstart-Funktion
const runSimulation = () => {

  heatingSystem.setSlope(slope.value);
  heatingSystem.setOffset(offset.value);

  // Simulation initialisieren und laufen lassen
  const simulation = new Simulation(heatingSystem, house, level.outside);
  simulation.setOutsideTemperature(outsideTemperature.value);

  house.getRooms().forEach((room, index) => {
    room.setTargetTemperature(roomSetPoints.value[index]);
  });

  simulation.run(simulationSpeed.value, 0.01); //TODO fine tuning

  roomInfos.value = house.getRooms().map(room => room.getInfo());

  /*house.getRooms().forEach((room, index) => {
    rooms.value[index].heatingPowerPercentage = room.getCurrentHeatingPowerFactor() * 100;
    rooms.value[index].currentTemperature = room.getCurrentTemperature();
  });*/
  //roomInfo.value = house.getRooms().map( room => room.getInfo());


  flowTemperature.value = heatingSystem.getFlowTemperature(outsideTemperature.value).toFixed(2);

};

const interval = ref<any|null>(null);

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

const curves = computed(() => {
  return [
    { offset: orgOffset, slope: orgSlope, name: 'Voreingestellte Kurve' },
    { offset: offset.value, slope: slope.value, name: 'Aktuelle Kurve' }
  ];
});


</script>
<template>
  <div class="gap-4 flex flex-col">

    <div class="card">
      <h2>Einstellung der Heizkurve</h2>
      <div class="flex gap-1">
        <div class="w-1/3 gap-5 flex flex-col">
          <div>
            <label for="offset" class="mb-2 font-bold">
              <img :src="offsetImage" alt="Offset" class="w-6 h-6 mb-1 inline" />
              Niveau: </label> <span > {{ offset.toFixed(0) }}</span>
            <Slider v-model="offset" :min="-13" :max="40" />

          
          </div>

          <div>
            <label for="slope" class="mb-2 font-bold">
              <img :src="slopeImage" alt="Slope" class="w-6 h-6 mb-1 inline" />
              Neigung: </label><span class="">{{ slope.toFixed(1) }}</span>

            <Slider v-model="slope" :min="0.2" :max="3.5" :step="0.1" />
            

          </div>

          <div>
                <div class="font-bold">
                  <font-awesome-icon :icon="faArrowDown" />
                  Niedrige Neigung:
                </div>
                Fußbodenheizung, gut gedämmte Häuser
                <div class="font-bold">
                  <font-awesome-icon :icon="faArrowUp" />
                  Hohe Neigung:
                </div>
                Radiatoren, schlecht gedämmte Häuser
              <div class="text-gray-700">  (Tendenz, kann abweichen)</div>
            </div>

        </div>
        <div class="w-2/3">
          <Curves :curves="curves" :currentTemperature="outsideTemperature" />
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Gebäudesimulation</h2>
      <div class="flex gap-3">
        <div class="w-1/3 flex flex-col">
          <div>
            <label for="temperature" class="mb-2">Außentemperatur:</label>
            <span class="font-bold">{{ outsideTemperature.toFixed(1) }}°C</span>

            <TemperatureSlider v-model="outsideTemperature" :min="-13" :max="25" :optimal="20" />
            <p>Heizungsvorlauftemperatur: <span class="font-bold"> {{ flowTemperature }}°C</span></p>
          </div>
          <div class="grow flex flex-col justify-end">
              <label class="mb-2">Simulationsgeschwindigkeit:</label>
              <Slider v-model="simulationSpeed" :min="1" :max="10" />
          </div>
        </div>

        <div class="w-2/3">
          <FloorPlan :rooms="roomInfos" :dimensions="dimensions" @changeSetPoint="changeSetPoint" />

        </div>
      </div>
    </div>







  </div>
</template>


<style scoped>
.inputs,
.outputs {
  margin-bottom: 20px;
}

.inputs div,
.outputs div {
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
