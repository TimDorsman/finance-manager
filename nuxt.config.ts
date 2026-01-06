// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},
	devtools: { enabled: false },
	modules: ["@nuxt/ui", "@nuxtjs/supabase", "nuxt-lucide-icons"],
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
	imports: {
		dirs: ["~/repositories", "~/services"],
	},
});
