<script setup lang="ts">
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
<template>
<div class="flex flex-col gap-4">
	<div class="mb-4">
		<a role="button" href="#" class="border border-gray-500 rounded font-bold bg-white p-2 shadow">
			<font-awesome-icon :icon="faArrowLeft" class="mr-2" />
			Zurück
		</a>
	</div>
	<div class="w-full p-4 bg-white rounded-xl shadow-md flex flex-col gap-2">
		<slot></slot>
	</div>
</div>
</template>
