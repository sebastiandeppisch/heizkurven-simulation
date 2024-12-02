<template>
	<div class="floorplan-container" ref="floorplan" >
		<div class="flex flex-col md:flex-row">
			<div v-for="(room, index) in rooms.slice(0, 2)" :key="index" class="border border-black-200">

				<Room :room="{
					name: room.name,
					icon: room.icon,
					width: room.width,
					height: room.height,
					currentTemperature: currentTemperature[index],
					setPoint: room.setPoint,
					color: deviationColors[index],
					heatingPowerFactor: heatingPowerFactor[index]
				}"
					v-model="room.setPoint"
					@change="(e: any) => changeSetPoint(index, e.target.value)"
					:proportionalSize="proportionalSize"
				/>
			</div>
		</div>
		<div class="flex flex-col  md:flex-row">
			<div v-for="(room, index) in rooms.slice(2, 4)" :key="index" class="border border-black-200">

				<Room :room="{
					name: room.name,
					icon: room.icon,
					width: room.width,
					height: room.height,
					currentTemperature: currentTemperature[index+2],
					setPoint: room.setPoint,
					color: deviationColors[index+2],
					heatingPowerFactor: heatingPowerFactor[index+2]
				}"
					v-model="room.setPoint"
					@change="(e: any) => changeSetPoint(index+2, e.target.value)"
					:proportionalSize="proportionalSize"
				/>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCouch, faBed, faUtensils, faBath, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { RoomInfo, RoomInfoUI, RoomType } from '@/models/Room';
import { useIsWindowsSizeGreaterThan, useOnResize, useWindowWidth } from '@/composables';
import Room from './Room.vue';
import RoomDimensions from '@/models/RoomDimensions';
const floorplan = ref<HTMLElement | null>(null);

const rooms = ref<RoomInfoUI[]>([]);

const viewPortSiz = ref(0);

const proportionalSize = useIsWindowsSizeGreaterThan('md')

useOnResize(() => {
	if(!floorplan.value) return;
	const width = floorplan.value.clientWidth;
	rooms.value = generateRooms(width, width);
	viewPortSiz.value = width;
});

const props = defineProps<{
	dimensions: number[];
	rooms: RoomInfo[];
}>();


const roomLabels: Record<RoomType, { name: string, icon: IconDefinition }> = {
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

const heatingPowerFactor = computed( () => props.rooms.map(room => (room.heatingPowerFactor * 100) ));

function generateRooms (width: number, height: number): RoomInfoUI[] {
	const rooms = [] as RoomInfoUI[];

	const dims = new RoomDimensions(width, height, props.dimensions);

	for(let i = 0; i < 4; i++){
		const room = props.rooms[i];

		const name = room.name as RoomType;

		rooms.push({
			name: roomLabels[name].name,
			icon: roomLabels[name].icon,
			width: dims.getWidth(i),
			height: dims.getHeight(i),
			currentTemperature: room.currentTemperature,
			setPoint: room.setPoint,
			color: getRoomDeviationColor(room),
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
<style scoped>
.floorplan-container{
	/*min-width: 500px;*/
}
</style>