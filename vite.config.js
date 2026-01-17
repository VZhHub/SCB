import { defineConfig } from 'vite';

export default defineConfig({
	root: ".",
	base: '/SCB/',
	build: {
		outDir: "dist",
		emptyOutDir: true
	}
});