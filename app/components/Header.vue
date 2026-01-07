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
			to: "/overview",
		},
		{
			label: "Catalog",
			to: "/catalog",
		},
		{
			label: "Out of stock",
			to: "/out-of-stock",
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

		<UNavigationMenu :items="items" />

		<template #right>
			<UColorModeButton />
			<IconLogOut
				v-if="user"
				:size="20"
				class="cursor-pointer"
				@click="handleLogout"
			/>
		</template>
	</UHeader>
</template>
