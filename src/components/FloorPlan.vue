<template>
	<div class="floorplan-container" ref="floorplan">
		<div class="flex">
			<div v-for="(room, index) in rooms.slice(0, 2)" :key="index" class="border border-black-200">
				<div :class="['room', room.bgColor, 'p-4', 'items-center', 'justify-center', 'flex']"
					:style="{ width: room.width + 'px', height: room.height + 'px', backgroundColor: deviationColors[index] }">
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
							<input v-model.number="room.setPoint" type="number" @change="e => changeSetPoint(index, e.target.value)"
								class="w-16 text-center rounded-md border border-gray-300" />
						</div>

						<!-- Ist-Temperatur Anzeige -->
						<div class="text-center">
							<p class="text-sm">Ist: {{ currentTemperature[index].toFixed(1) }}°C</p>
						</div>
						<div class="text-center">
							<p class="text-sm">Leistung: {{ heatingPowerFactor[index] }}%</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex">
			<div v-for="(room, index) in rooms.slice(2, 4)" :key="index" class="border border-black-200">
				<div :class="['room', room.bgColor, 'p-4', 'items-center', 'justify-center', 'flex']"
					:style="{ width: room.width + 'px', height: room.height + 'px', backgroundColor: deviationColors[index +2] }">
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
							<input v-model.number="room.setPoint" type="number" @change="e => changeSetPoint(index+2, e.target.value)"
								class="w-16 text-center rounded-md border border-gray-300" />
						</div>

						<!-- Ist-Temperatur Anzeige -->
						<div class="text-center">
							<p class="text-sm">Ist: {{ currentTemperature[index+2].toFixed(1) }}°C</p>
						</div>

						<div class="text-center">
							<p class="text-sm">Leistung: {{ heatingPowerFactor[index+2] }}%</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCouch, faBed, faUtensils, faBath } from '@fortawesome/free-solid-svg-icons';
import type { RoomInfo } from '@/models/Room';

const floorplan = ref<HTMLElement>(null);

const rooms = ref([]);

onMounted(() => {
	const width = floorplan.value.clientWidth;
	rooms.value = generateRooms(width, width);
})

const props = defineProps<{
	dimensions: number[];
	rooms: RoomInfo[];
}>();


const roomLabels: Array<RoomType, { name: string, icon: string }> = {
	'livingroom': { name: 'Wohnzimmer', icon: faCouch },
	'bedroom': { name: 'Schlafzimmer', icon: faBed },
	'kitchen': { name: 'Küche', icon: faUtensils },
	'bathroom': { name: 'Bad', icon: faBath },
};

const emit = defineEmits(['changeSetPoint']);


function changeSetPoint(index: number, value: number) {
	emit('changeSetPoint', index, value);
}

const currentTemperature = computed( () => props.rooms.map(room => room.currentTemperature));

const deviationColors = computed( () => props.rooms.map(room => getRoomDeviationColor(room)));

const heatingPowerFactor = computed( () => props.rooms.map(room => (room.heatingPowerFactor * 100).toFixed(0) ));

// Funktion zur Generierung eines zufälligen Grundrisses mit vier unterschiedlich großen Räumen, versetzt angeordnet
function generateRooms (width: number, height: number){
	const rooms = [];

	const widths = [
		props.dimensions[0] * width,
		width - props.dimensions[0] * width,
		props.dimensions[2] * width,
		width - props.dimensions[2] * width,
	];

	const heights = [
		props.dimensions[2] * width,
		props.dimensions[2] * width,
		height - props.dimensions[2] * width,
		height - props.dimensions[2] * width,
	];

	for(let i = 0; i < 4; i++){
		const room = props.rooms[i];
		rooms.push({
			name: roomLabels[room.name].name,
			icon: roomLabels[room.name].icon,
			width: widths[i],
			height: heights[i],
			currentTemperature: room.currentTemperature,
			setPoint: room.setPoint,
			deviationColor: getRoomDeviationColor(room),
			heatingPowerFactor: (room.heatingPowerFactor * 100)
		});
	}

	return rooms;
};


const getRoomDeviationColor = (room: RoomInfo) => {
	const deviation = room.currentTemperature - room.setPoint;

	const red = [255, 205, 210]; 
	const blue = [187, 222, 251];
	const white = [255, 255, 255]; 

	const maxIntensity = 5; 

	const multiplicator = Math.max(-1, Math.min(deviation / maxIntensity, 1));

	if (deviation > 0) {
		return `rgb(${white.map((color, index) =>
			Math.round(color + multiplicator * (red[index] - color))
		).join(',')})`;
	} else {
		return `rgb(${white.map((color, index) =>
			Math.round(color + Math.abs(multiplicator) * (blue[index] - color))
		).join(',')})`;
	}
};
</script>
