<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as Highcharts from 'highcharts';
import HeatingCurve from '@/models/HeatingCurve';

interface Curve {
	offset: number;
	slope: number;
	name: string;
}

const props = defineProps<{
	curves: Curve[];
	currentTemperature: number;
}>();

const chartContainer = ref<HTMLDivElement>();

function heatingCurve(offset: number, slope: number): (outsideTemp: number) => number {
	const calculator = new HeatingCurve(offset, slope);
	return (outsideTemp) => calculator.get(outsideTemp);
}


function getCurveData(offset: number, slope: number) {
	const data = [];

	const curve = new HeatingCurve(offset, slope);

	for (let tempOutside = -15; tempOutside <= 20; tempOutside += 5) {
		data.push([tempOutside, curve.get(tempOutside)]);
	}
	return {
		offset: offset,
		slope: slope,
		data: data
	};
}

const plotCurves = () => {
	if (chartContainer.value) {
		const series: any[] = [
			...props.curves.map(curve => ({
				name: curve.name,
				data: getCurveData(curve.offset, curve.slope).data,
				marker: {
					enabled: true
				},
				dataLabels: {
					enabled: true,
					format: '{y}°C'
				},
				animation: false
			})),
		];

		const lastCurve = props.curves[props.curves.length - 1];

		const flowTemp = heatingCurve(lastCurve.offset, lastCurve.slope)(props.currentTemperature);
		const currentTemp = props.currentTemperature;

		if(currentTemp <= 20){
			series.push({
				name: 'Aktueller Arbeitspunkt',
				type: 'scatter',
				data: [[currentTemp, flowTemp]],
				marker: {
					symbol: 'circle',
					radius: 5
				},
				animation: false
			})
		}


		Highcharts.chart(chartContainer.value, {
			/*colors: [ //triadic color scheme
				'#DB4332', '#BBDB32', '#1f2937'
			],*/
			/*colors: [ //quad color scheme
				'#DBA132','#45DB32', '#1f2937'
			],*/
			chart: {
				type: 'line'
			}, 
			title: {
				text: 'Heizkurven'
			},
			credits: {
				enabled: false
			},
			xAxis: {
				title: {
					text: 'Außentemperatur'
				},
				labels: {
					format: '{value}°C'
				},
				reversed: true,
				tickInterval: 5
			},
			yAxis: {
				title: {
					text: 'Vorlauftemperatur'
				},
				labels: {
					format: '{value}°C'
				},
				min: 20,
				max: 100
			},
			series
		});
	}
};

onMounted(() => {
	plotCurves();
});

watch(() => props.curves, plotCurves, { deep: true });
watch(() => props.currentTemperature, plotCurves);

</script>
<template>
	<div>
		<div ref="chartContainer"></div>
	</div>
</template>
