<template>
  <div class="p-5 rounded-xl shadow-md bg-white">
    <h2>{{ title }}</h2>
    <div class="flex gap-2 md:flex-row flex-col">
      <div class="md:w-1/3  gap-5 flex flex-col ">
        <slot name="inputs"></slot>
      </div>

      <div class="md:w-2/3">
        <slot name="outputs"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  title: string;
}>();
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>