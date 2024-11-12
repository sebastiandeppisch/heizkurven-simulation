<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

const props = defineProps<{
    setTemperature: number;
}>();

const chartContainer = ref<HTMLDivElement | null>(null);


const thermometerValue = computed(() => {
    return 3 + (props.setTemperature - 20) / 4;
});
function plot() {
    Highcharts.chart(chartContainer.value, {

        chart: {
            type: 'gauge',
            backgroundColor: 'transparent',
        },

        title: false,
        credits: false,
        pane: {
            startAngle: -150,
            endAngle: 150
        },

        yAxis: [{
            min: 1,
            max: 5,
            tickPosition: 'outside',
            lineColor: '#933',
            lineWidth: 2,
            minorTickPosition: 'outside',
            tickColor: '#933',
            minorTickColor: '#933',
            tickLength: 5,
            minorTickLength: 5,
            labels: {
                distance: 11,
                rotation: 'auto'
            },
            offset: -20,
            endOnTick: false
        }],

        series: [{
            name: 'Thermostatstellung',
            data: [thermometerValue.value],
            animation: false,
            tooltip: false
        }]

    });
}


onMounted(() => {
    plot();
});
watch(() => props.setTemperature, plot);

</script>
<template>
    <div ref="chartContainer"></div>
</template>