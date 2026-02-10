<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const items = computed(() => {
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
		{
			label: "Logout",
			icon: "i-lucide-log-out",
			onSelect: handleLogout,
			class: "flex sm:hidden",
			ui: {
				link: "text-red-400 hover:text-red-600 hover:bg-red-400/10",
				linkLeadingIcon: "text-red-400",
				linkLabel: "text-red-400",
			},
		},
	];
});

const handleLogout = async () => {
	await supabase.auth.signOut();
	await navigateTo("/auth");
};

const avatarSrc = ref<string | undefined>(undefined);

watch(
	() => user.value,
	(user) => {
		if (user && !avatarSrc.value) {
			avatarSrc.value = user.user_metadata?.avatar_url ?? undefined;
		}
	},
	{ immediate: true },
);

console.log({ avatarSrc: avatarSrc.value });
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

		<UNavigationMenu
			:items="items"
			:ui="{
				list: 'gap-2',
			}"
		/>

		<template #right>
			<UColorModeButton />

			<ClientOnly>
				<UPopover
					v-if="user"
					class="hidden md:block"
					side="bottom"
					align="end"
					:side-offset="8"
				>
					<Avatar :src="avatarSrc" size="sm" class="cursor-pointer" />
					<template #content>
						<div class="w-56 p-3 space-y-3">
							<div class="flex items-center gap-3">
								<RouterLink to="/profile">
									<Avatar :src="avatarSrc" size="md" />
								</RouterLink>
								<div class="min-w-0">
									<p class="text-sm font-medium truncate">
										{{
											user.user_metadata?.full_name ??
											"User"
										}}
									</p>
									<p class="text-xs text-muted truncate">
										{{ user.email }}
									</p>
								</div>
							</div>

							<USeparator />

							<UButton
								variant="ghost"
								color="error"
								block
								@click="handleLogout"
							>
								Logout
							</UButton>
						</div>
					</template>
				</UPopover>
			</ClientOnly>
		</template>

		<template #body>
			<ClientOnly>
				<div
					v-if="user"
					class="md:hidden px-4 py-4 flex items-center gap-3 border-b border-b-blue-900 mb-4"
				>
					<RouterLink to="/profile">
						<Avatar :src="avatarSrc" size="md" />
					</RouterLink>
					<div class="min-w-0">
						<p class="text-sm font-medium truncate">
							{{ user.user_metadata?.full_name ?? "User" }}
						</p>
						<p class="text-xs text-muted truncate">
							{{ user.email }}
						</p>
					</div>
				</div>
				<UNavigationMenu
					:items="items"
					orientation="vertical"
					class="-mx-2.5"
				/>
			</ClientOnly>
		</template>
	</UHeader>
</template>
