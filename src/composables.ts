import { onMounted, onUnmounted } from "vue";

export function useOnResize(callback: () => void) {
	onMounted(() => {
		window.addEventListener("resize", callback);
		callback();
	});
	onUnmounted(() => {
		window.removeEventListener("resize", callback);
	});
}