<script lang="ts" setup>

import { defineProps, defineModel } from 'vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import type { RoomInfoUI } from '@/models/Room';


const props = defineProps<{
	room: RoomInfoUI;
}>();

const model = defineModel();

</script>
<template>
<div :class="['room', 'p-4', 'items-center', 'justify-center', 'flex']"
	:style="{ width: room.width + 'px', height: room.height + 'px', backgroundColor: room.color }">
	<div class="">
		<!-- Raum-Icon -->
		<div class="flex items-center justify-center mb-2">
			<font-awesome-icon :icon="room.icon" class="text-gray-700 text-2xl" />
		</div>

		<!-- Raumname -->
		<h3 class="text-lg font-bold text-center mb-2">{{ room.name }}</h3>

		<!-- Soll-Temperatur Input -->
		<div class="text-center mb-2">
			<label class="text-sm text-gray-800 block">Soll (°C):</label>
			<input v-model="model" type="number"
				class="w-16 text-center rounded-md border border-gray-300" />
		</div>

		<!-- Ist-Temperatur Anzeige -->
		<div class="text-center">
			<p class="text-sm">Ist: {{ room.currentTemperature.toFixed(1) }}°C</p>
		</div>
		<div class="text-center">
			<p class="text-sm">Leistung: {{ room.heatingPowerFactor.toFixed(0) }}%</p>
		</div>
	</div>
</div>
</template>