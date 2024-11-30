<script lang="ts" setup>
import Slider from './Slider.vue';

const props = defineProps<{
	min: number;
	max: number;
	optimal : number;
}>();

const optimalTemperature = props.optimal;
const minTemperature = props.min;
const maxTemperature = props.max;
const percentageOfWhite =  (optimalTemperature - minTemperature) / (maxTemperature - minTemperature) * 100;



</script>
<template>
	<Slider :min="minTemperature" :max="maxTemperature" class="colored-slider" />
</template>

<style>

.colored-slider > input[type="range"] {
	background: linear-gradient(to right, 
		rgb(187, 222, 251),
		 white v-bind(percentageOfWhite + '%'),
		 rgb(255, 205, 210)
	) !important;
}

</style>