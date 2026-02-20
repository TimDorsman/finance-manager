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

import type { Chart, ChartEvent, ActiveElement } from "chart.js";
import { Bar } from "vue-chartjs";

const props = defineProps<{
	data: number[];
}>();

const emit = defineEmits<{
	(
		event: "bar-clicked",
		value: { month: number; budget: number; spent: number },
	): void;
}>();

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
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
				color: "#6B7280",
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
				label: (ctx: any) => `${ctx.dataset.label}: €${ctx.raw}`,
			},
		},
	},
	onClick(_: ChartEvent, elements: ActiveElement[], chart: Chart): void {
		const element = elements[0];
		if (!element) return;

		const { datasetIndex, index } = element;

		const labels = chart.data.labels;
		const dataset = chart.data.datasets[datasetIndex];

		if (!labels || !dataset) return;

		const rawValue = dataset.data[index];
		const budget = typeof rawValue === "number" ? rawValue : 0;

		emit("bar-clicked", {
			month: index,
			budget,
			spent: props.data[index] ?? 0,
		});
	},
});
</script>

<template>
	<div class="h-40 md:h-60">
		<Bar :data="chartData" :options="chartOptions" />
	</div>
</template>
