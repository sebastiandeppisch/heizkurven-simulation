<script lang="ts" setup>
  import { ref, watch } from 'vue';
  
const props = withDefaults(defineProps<{
	modelValue: number;
	min: number;
	max: number;
	step?: number;
	[key: string]: any;
}>(), {
	step: 1
});
  
  const emit = defineEmits(['update:modelValue']);
  
  const value = ref(parseFloat(props.modelValue as any));
  
  watch(value, (newValue) => {
	emit('update:modelValue',parseFloat(newValue as any));
  });
  
  const decrease = () => {
	if (props.min !== undefined && value.value <= props.min) return;


	value.value = parseFloat(value.value as any) - props.step;
  };
  
  const increase = () => {
	if (props.max !== undefined && value.value >= props.max) return;
	value.value = parseFloat(value.value as any) + props.step;
  };
  
  const inputAttrs = {
	...props
  };




  </script>
<template>
	<div class="flex items-center space-x-2">
		<button @click="decrease" class="border border-gray-500 w-8 h-8 rounded font-bold">-</button>
		<input type="range" v-bind="inputAttrs" v-model="value"/>
		<button @click="increase" class="border border-gray-500 w-8 h-8 rounded font-bold">+</button>
	</div>
</template>
  
  
<style scoped>

input[type="range"] {
	flex: 1;
	-webkit-appearance: none;
	appearance: none;
	height: 0.5rem;
	background: #d1d5db;
	border-radius: 0.25rem;
	outline: none;
	font-size: 0rem;
}

input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	background: #1f2937;
	cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	background: #1f2937;
	cursor: pointer;
}
</style>
