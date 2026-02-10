<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const items = computed<NavigationMenuItem[]>(() => {
	if (!user.value) {
		return [];
	}

	return [
		{
			label: "Overview",
			icon: "i-lucide-home",
			to: "/",
		},
		{
			label: "Budget planner",
			icon: "i-lucide-pie-chart",
			to: "/budget/overview",
		},
		{
			label: "Shopping",
			icon: "i-lucide-shopping-cart",
			children: [
				{
					label: "Catalog",
					icon: "i-lucide-box",
					description: "Browse supplies to manage your inventory",
					to: "/catalog",
				},
				{
					label: "Out of stock",
					icon: "i-lucide-alert-circle",
					description: "View and manage out of stock supplies",
					to: "/out-of-stock",
				},
			],
		},
	];
});

const handleLogout = async () => {
	await supabase.auth.signOut();
	await navigateTo("/auth");
};
</script>

<template>
	<UHeader
		:toggle="{
			color: 'primary',
			variant: 'subtle',
			class: 'rounded-full',
		}"
	>
		<template #title>
			<div class="flex items-center gap-2 w-auto">
				<img src="/images/logo.png" alt="logo" class="w-8 h-8" />
				<p>Finance Manager</p>
			</div>
		</template>

		<ClientOnly>
			<UNavigationMenu
				:items="items"
				:ui="{
					list: 'gap-2',
				}"
			/>
		</ClientOnly>

		<template #right>
			<UColorModeButton />
			<IconLogOut
				v-if="user"
				:size="20"
				class="cursor-pointer"
				@click="handleLogout"
			/>
		</template>

		<template #body>
			<ClientOnly>
				<UNavigationMenu
					:items="items"
					orientation="vertical"
					class="-mx-2.5"
				/>
			</ClientOnly>
		</template>
	</UHeader>
</template>
