<script lang="ts" setup>
import { useCssVar } from "@vueuse/core";
import { computed, ref } from "vue";
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

// Register Chart.js components
ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
);

const legendSpacingPlugin = {
	id: "legendSpacingPlugin",
	beforeInit(chart: Chart) {
		const fitValue = chart.legend?.fit;
		if (!fitValue) {
			return;
		}

		chart.legend.fit = function fit() {
			fitValue.bind(chart.legend)();
			this.height += 14;
		};
	},
};

const budgetColor = useCssVar("--ui-primary");
const spendColor = useCssVar("--ui-secondary");
const chartTextColor = useCssVar("--ui-text-muted");
const colorMode = useColorMode();
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

const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			stacked: false,
			ticks: {
				color: chartTextColor.value,
			},
		},
		y: {
			beginAtZero: true,
			ticks: {
				color: chartTextColor.value,
				callback: function (tickValue: string | number) {
					return `$${tickValue}`;
				},
			},
		},
	},
	plugins: {
		legend: {
			position: "top" as const,
			labels: {
				color: chartTextColor.value,
				padding: 12,
				usePointStyle: true,
				pointStyle: "rectRounded",
				boxWidth: 8,
				boxHeight: 8,
			},
		},
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
}));
</script>

<template>
	<div class="h-40 md:h-60">
		<Bar
			:key="`budget-chart-${colorMode.value}`"
			:data="chartData"
			:options="chartOptions"
			:plugins="[legendSpacingPlugin]"
		/>
	</div>
</template>

