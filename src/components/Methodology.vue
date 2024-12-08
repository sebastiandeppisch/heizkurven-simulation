<script setup lang="ts">
import InfoPage from './InfoPage.vue';
</script>
<template>
	<InfoPage>
		<h2 class="font-semibold text-2xl">Methodik</h2>
		<p class="">
			Die Simulation bildet ein thermisches Netzwerk aus Räumen und einem Außenbereich ab.
			Dabei hängen die Vorlauftemperatur der Heizung, der Wärmeaustausch zwischen den Knoten
			sowie die individuell geregelte Heizleistung in jedem Raum zusammen. Jeder Raum enthält
			zudem eine interne Wärmequelle (250W, modelliert Abwärme von Menschen und Geräten), die kontinuierlich
			Wärmeenergie ins System einbringt.
		</p>

		<h3 class="font-semibold text-l">Heizkurve</h3>
		<p>
			Die Vorlauftemperatur <span class="italic">T<sub>flow</sub></span> wird anhand einer
			Heizkurve bestimmt, die von der Außentemperatur
			<span class="italic">T<sub>outside</sub></span> abhängt. Hierfür wird eine
			Referenz-Raumtemperatur <span class="italic">T<sub>set</sub></span> verwendet, die
			einer häufig in realen Heizungsanlagen konfigurierbaren Zielraumtemperatur entspricht. Aus
			der Außentemperatur ergibt sich zunächst die Temperaturdifferenz (DAR):
		</p>
		<pre><code>T<sub>set</sub> := 22°C
DAR = T<sub>outside</sub> - T<sub>set</sub></code></pre>
		<p>
			Anschließend wird die Vorlauftemperatur mithilfe von Niveau und Neigung wie folgt berechnet:
		</p>
		<pre><code>T<sub>flow</sub> = T<sub>set</sub> + Niveau - (Neigung&thinsp;·&thinsp;DAR&thinsp;·&thinsp;(1,4347&thinsp;+&thinsp;0,021&thinsp;·&thinsp;DAR&thinsp;+&thinsp;247,9&thinsp;·&thinsp;10<sup>-6</sup>&thinsp;·&thinsp;DAR<sup>2</sup>))</code></pre>
		<p>
			Quelle: <a
				href="https://community.viessmann.de/t5/Gas/Mathematische-Formel-fuer-Vorlauftemperatur-aus-den-vier/m-p/68890#"
				target="_blank" class="text-blue-500 underline">Viessmann Community Forum</a>
		</p>
		<h3 class="font-semibold text-l">Wärmeübertragung</h3>
		<p>
			Die Räume sind über Wärmeleitwerte (G in [W/K]) miteinander
			und mit dem Außenknoten verbunden. Pro Zeitschritt wird die übertragene Energie berechnet als:
		</p>
		<pre class="bg-white rounded overflow-auto"><code>E_Transfer = G · (T_main - T_other) · Δt</code></pre>

		<p>
			Dabei fungiert der Außenknoten als Wärmesenke bzw. -quelle mit konstanter Temperatur.
			Für jeden Raum wird G aus der Raumgröße und Jahrestypischen Dämmung (U-Wert) berechnet. Der Simulierte
			Bungalow hat dabei eine Grundfläche von 10m x 10m.<br>
			Die Heizkörper haben ebenfalls einen Wärmeleitwert, der aus einer Auslege-Vorlauftemperatur und dem
			Wärmeleitwert der Außenwände berechnet wird. Die Auslege-Vorlauftemperatur ist dabei bei älteren größere als
			bei neueren und hat eine zufällige Komponente.
		</p>

		<h3 class="font-semibold text-l">Raumseitige Regelung</h3>
		<p>
			Die tatsächlich zugeführte Wärmemenge für jeden Raum wird durch einen PI-Regler bestimmt. Dieser regelt die
			Wärmeabgabe des Heizkörpers entsprechend ab (Ventilstellung).
		</p>

		<h3 class="font-semibold text-l">Gesamtdynamik</h3>
		<p>
			Durch das Zusammenwirken von berechneter Vorlauftemperatur (Heizkurve),
			temperaturabhängigem Wärmeaustausch zwischen Räumen und Außenbereich,
			individueller Innentemperaturregelung sowie
			interner Wärmequellen entsteht ein zeitabhängiges Gleichgewicht.
		</p>
	</InfoPage>
</template>
<style scoped>
h3 {
	margin-top: 1rem;
}
</style>