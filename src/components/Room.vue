<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import type { RoomInfoUI } from '@/models/Room';
import SetTemperatureGauge from './Thermostat.vue';
import { computed } from 'vue';


const props = defineProps<{
	room: RoomInfoUI;
	proportionalSize: boolean;
}>();

const model = defineModel();

const style = computed(() => {
	return {
		width: props.proportionalSize? props.room.width + 'px' : 'inherit',
		height: props.proportionalSize? props.room.height + 'px' : 'inherit',
		backgroundColor: props.room.color
	};
});

</script>
<template>
	<div :class="['room', 'p-4', 'items-center', 'justify-center', 'flex']"
		:style>
		<div class="">
			<!-- Raum-Icon -->
			<div class="flex items-center justify-center mb-2">
				<font-awesome-icon :icon="room.icon" class="text-gray-700 text-2xl" />
			</div>

			<!-- Raumname -->
			<h3 class="text-lg font-bold text-center mb-2">{{ room.name }}</h3>

			<div class="flex">
				<div>
					<!-- Soll-Temperatur Input -->
					<div class="text-center mb-2" data-tour="set-temperature">
						<label class="text-sm text-gray-800 block">Soll (°C):</label>
						<input v-model="model" type="number"
							class="w-16 text-center rounded-md border border-gray-300" min="12" max="28" step="0.5" />
					</div>
					<!-- Ist-Temperatur Anzeige -->
					<div class="text-center">
						<p class="text-sm">Ist: {{ room.currentTemperature.toFixed(1) }}°C</p>
					</div>
					<div class="text-center" data-tour="valve-position">
						<p class="text-sm">Ventilstellung: {{ room.heatingPowerFactor.toFixed(0) }}%</p>
					</div>
				</div>
				<div>
				</div>
			</div>



		</div>
	</div>
</template>