<script lang="ts" setup>
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale
);

const props = defineProps<{
	labels: string[];
	datasets: {
		label: string;
		borderColor: string;
		data: number[];
		fill?: boolean;
		tension?: number;
	}[];
}>();

const chartData = ref({
	labels: props.labels,
	datasets: props.datasets,
});

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: false,
});
</script>

<template>
	<div>
		<Line :data="chartData" :options="chartOptions" />
	</div>
</template>

<style scoped lang="css"></style>
