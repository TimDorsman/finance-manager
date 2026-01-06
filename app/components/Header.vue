<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const items = computed<NavigationMenuItem[]>(() => [
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
]);
</script>

<template>
	<UHeader>
		<template #title>
			<p>Finance Manager</p>
		</template>

		<UNavigationMenu :items="items" />

		<template #right>
			<UColorModeButton />
			<IconLogOut
				v-if="user"
				:size="20"
				class="cursor-pointer"
				@click="supabase.auth.signOut()"
			/>
		</template>
	</UHeader>
</template>
