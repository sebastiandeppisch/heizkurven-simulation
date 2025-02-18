<script lang="ts" setup>
import Simulation from './../components/Simulation.vue';
import { ref } from 'vue';
import { VTour } from '@globalhive/vuejs-tour';
import '@globalhive/vuejs-tour/dist/style.css';
import tourSteps from '@/tourConfig';
import { faHouse, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const tour = ref();

function startTour() {
	localStorage.removeItem('vjt-default');
	tour.value.startTour();
}

const softwareBuildDate = BUILD_DATE;
const formattedBuildDate = new Date(softwareBuildDate).toLocaleDateString('de-DE');
const key = ref(0);

function storeSeed(seed: number) {
	localStorage.setItem('house-seed', seed.toString());
}

function retrieveSeed(): number | null {
	const seed = localStorage.getItem('house-seed');
	return seed ? parseInt(seed) : null;
}

function restart() {
	const newSeed = RandomLevel.generateNewSeed();
	storeSeed(newSeed);
	key.value++;
}

const initialSeed = retrieveSeed();
if (initialSeed !== null) {
	storeSeed(initialSeed);
} else {
	const newSeed = RandomLevel.generateNewSeed();
	storeSeed(newSeed);
}
</script>
<template>
	<div>
		<VTour ref="tour" :steps="tourSteps" autostart
			:buttonLabels='{ next: "Weiter", back: "Zurück", done: "Beenden", skip: "Überspringen" }' />
		<div class="flex flex-row justify-end mb-4 gap-4 items-center">
			<p class="">Letzte Änderung: {{ formattedBuildDate }}
				
			</p>
			<a href="#changelog" class="underline">Changelog</a>
			<a href="#methodik" class="underline mr-auto">Methodik</a>
			<button @click="restart" class="border border-gray-500 rounded font-bold bg-white p-2"
				date-tour="new-house"><font-awesome-icon :icon="faHouse" class="pr-2" />Neues Haus erstellen</button>
			<button @click="startTour" class="border border-gray-500 rounded font-bold bg-white p-2"><font-awesome-icon
					:icon="faQuestion" class="pr-2" />Tour starten</button>
		</div>
		<Simulation data-tour="test" :key="key" />
	</div>
</template>
