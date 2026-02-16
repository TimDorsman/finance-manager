<template>
	<div
		class="mt-6 p-4 bg-default/70 backdrop-blur border border-default rounded-lg shadow-sm"
	>
		<div class="flex flex-row justify-between gap-2 align-start">
			<h4 class="text-lg font-medium text-primary">
				<Skeleton class="h-2 w-24" />
			</h4>
			<div class="cursor-pointer self-start">
				<UButton
					size="sm"
					variant="soft"
					color="primary"
					class="cursor-pointer self-start"
					icon="i-lucide-eye"
					:disabled="true"
				>
					<span class="hidden sm:inline">View details</span>
				</UButton>
			</div>
		</div>
		<p class="font-medium mt-2">This month:</p>
		<ul class="list-disc pl-5">
			<li>Budget: <USkeleton class="ml-1 inline-block h-2 w-12" /></li>
			<li>Spent: €<USkeleton class="ml-1 inline-block h-2 w-12" /></li>
		</ul>

		<USkeleton class="h-32 w-full mt-4" />
	</div>
</template>
