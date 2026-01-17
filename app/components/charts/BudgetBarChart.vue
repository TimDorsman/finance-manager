<script lang="ts" setup>
import { useCssVar } from "@vueuse/core";
import { ref } from "vue";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

const props = defineProps<{
	data: number[];
}>();

// Register Chart.js components
ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale
);

const budgetColor = useCssVar("--ui-primary");
const spendColor = useCssVar("--ui-secondary");
const chartData = ref({
	labels: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	datasets: [
		{
			label: "Budget",
			data: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
			backgroundColor: budgetColor.value,
			borderRadius: 6,
			grouped: false,
			order: 2,
		},
		{
			label: "Spent",
			data: props.data ?? [],
			backgroundColor: spendColor.value,
			borderRadius: 6,
			grouped: false,
			order: 1,
		},
	],
});

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			stacked: false,
			ticks: {
				color: "#6B7280", // X-axis label color
			},
		},
		y: {
			beginAtZero: true,
			ticks: {
				callback: function (tickValue: string | number) {
					return `$${tickValue}`;
				},
			},
			color: "#6B7280",
		},
	},
	plugins: {
		tooltip: {
			callbacks: {
				label: (ctx: any) => `${ctx.dataset.label}: $${ctx.raw}`,
			},
		},
	},
});
</script>

<template>
	<div class="h-40 md:h-60">
		<Bar :data="chartData" :options="chartOptions" />
	</div>
</template>
