import { computed, onMounted, onUnmounted, ref } from "vue";

export function useOnResize(callback: () => void) {
	onMounted(() => {
		window.addEventListener("resize", callback);
		callback();
	});
	onUnmounted(() => {
		window.removeEventListener("resize", callback);
	});
}

export function useWindowWidth() {
	const width = ref(window.innerWidth);
	useOnResize(() => {
		width.value = window.innerWidth;
	});
	return width;
}

/*

Breakpoint prefix	Minimum width	CSS
sm	640px	@media (min-width: 640px) { ... }
md	768px	@media (min-width: 768px) { ... }
lg	1024px	@media (min-width: 1024px) { ... }
xl	1280px	@media (min-width: 1280px) { ... }
2xl	1536px	@media (min-width: 1536px) { ... }
*/

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = {
	"sm": 640,
	"md": 768,
	"lg": 1024,
	"xl": 1280,
	"2xl": 1536,
};

export function useIsWindowsSizeLessThan(breakpoint: Breakpoint) {
	const width = useWindowWidth();

	return computed(() => {
		return width.value < breakpoints[breakpoint];
	});
}

export function useIsWindowsSizeGreaterThan(breakpoint: Breakpoint) {
	const width = useWindowWidth();

	return computed(() => {
		return width.value >= breakpoints[breakpoint];
	});
}