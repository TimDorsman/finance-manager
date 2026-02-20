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

const navigationMenuUi = {
	list: "gap-2",
	link: "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/60 transition-colors",
	linkLeadingIcon:
		"text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white transition-colors",
	linkLabel: "text-inherit",
	childLink:
		"text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/60 rounded-md transition-colors",
	childLinkIcon:
		"text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white transition-colors",
	childLinkLabel: "text-inherit",
};

watch(
	() => user.value,
	(user) => {
		if (user && !avatarSrc.value) {
			avatarSrc.value = user.user_metadata?.avatar_url ?? undefined;
		}
	},
	{ immediate: true },
);
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
			variant="link"
			highlight
			highlight-color="success"
			color="neutral"
			:ui="navigationMenuUi"
		/>

		<template #right>
			<UColorModeButton
				color="neutral"
				variant="ghost"
				class="text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/60"
			/>

			<ClientOnly>
				<UPopover
					v-if="user"
					class="hidden md:block"
					side="bottom"
					align="end"
					:side-offset="8"
					:dismissible="true"
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
					variant="link"
					highlight
					highlight-color="success"
					color="neutral"
					class="-mx-2.5"
					:ui="navigationMenuUi"
				/>
			</ClientOnly>
		</template>
	</UHeader>
</template>

