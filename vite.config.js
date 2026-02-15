import { defineConfig } from 'vite';

export default defineConfig({
	root: ".",
	base: '/SCB/',
	publicDir: 'public',
	build: {
		outDir: "docs",
		emptyOutDir: true
	}
});