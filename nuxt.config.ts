// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: "2026-01-07",
	future: {
		compatibilityVersion: 4,
	},
	devtools: { enabled: false },
	modules: [
		"@nuxt/ui",
		"@nuxtjs/supabase",
		"nuxt-lucide-icons",
		"@nuxt/icon",
	],
	supabase: {
		redirect: false,
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
	},
	lucide: {
		namePrefix: "Icon",
	},
	css: ["./app/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	typescript: {
		typeCheck: true,
	},
	devServer: {
		host: "0.0.0.0",
		port: 3000,
	},
	imports: {
		dirs: [
			"~/repositories",
			"~/services",
			"shared/types",
			"shared/types/**",
			"~/composables",
			"~/composables/**",
			"features/**/composables",
		],
	},
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
		{
			path: "~/features",
			pattern: "**/components/*.vue",
			pathPrefix: false,
		},
	],
});
