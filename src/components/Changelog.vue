<script setup lang="ts">
import InfoPage from './InfoPage.vue';
</script>
<template>
	<InfoPage>
		<h2 class="font-semibold text-2xl">Changelog</h2>
		<h3>09.01.2025
			<ul class="list-disc pl-6">
				<li>Der Code ist jetzt auf GitHub verfügbar</li>
			</ul>
		</h3>
		<h3>08.12.2024</h3>
		<ul class="list-disc pl-6">
			<li>Realistischere Heizkörper-Auslegung bzw. Vorlauftemperatur</li>
			<li>Fehler in der Heizungsregelung beseitigt</li>
			<li>Parameter des Hauses werden aus einem zufälligen Baujahr erzeugt</li>
			<li>Methodik & Changelog hinzugefügt</li>
		</ul>
		<h3>03.12.2024</h3>
		<ul class="list-disc pl-6">
			<li>Erste veröffentlichte Version</li>
		</ul>
	</InfoPage>
</template>
<style scoped>
h3 {
	margin-top: 1rem;
	font-weight: 600;
}
</style>