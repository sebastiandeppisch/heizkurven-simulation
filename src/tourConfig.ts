import type { ITourStep } from "node_modules/@globalhive/vuejs-tour/dist/Types";

const steps: Array<ITourStep> = [
	{
		target: '[data-tour="start"]',
		content: 'Willkommen zur Heizkurven-Simulation. Falls Du nicht weißt, was eine Heizkurve ist, schaue dir am besten dieses YouTube-Video an: <br> <a href="https://youtu.be/Q4MRvyNMEDk" target="_blank" style="text-decoration:underline;">Energiesparkommissar - Heizkurve</a>',
		placement: 'top',
		backdrop: true,

	},
	{
		target: '[data-tour="curve"]',
		content: 'Deine Aufgabe ist es, hier die optimale Heizkurve zu finden. Es ist eine zufällige Heizkurve eingestellt, und es wird simuliert, wie ein zufälliges Haus auf diese Heizkurve reagiert.',
		highlight: true,
		noScroll: true,

	},
	{
		target: '[data-tour="curve-parameter"]',
		content: 'Hier kannst Du das Niveau und Neigung der Kurve verstellen.',
		placement: 'bottom',
	},
	{
		target: '[data-tour="outside-temperature"]',
		content: 'Hier kannst du die aktuelle Außentemperatur einstellen. Dies simuliert die Außentemperatur, der das Haus ausgesetzt ist.',
		highlight: true,
	},
	{
		target: '[data-tour="work-point"]',
		content: 'Aus der Heizkurve und der Außentemperatur ergibt sich die Vorlauftemperatur. Diesen Arbeitspunkt siehst Du auch oben in der Grafik.',
		highlight: true,
	},
	{
		target: '[data-tour="rooms"]',
		content: 'Das ist der Grundriss eines Beispielhauses. Du kannst hier die Solltemperaturen der einzelnen Räume einstellen.',
		highlight: true,

	},
	{
		target: '[data-tour="room"]',
		content: 'In blau oder rot siehst Du, ob es im Raum zu warm oder zu kalt ist. In den Räumen sind Regler-Thermostate verbaut, die - vorausgesetzt die Heizkurve ist hoch genug - die Temperatur auf die passende Temperatur regeln.',
		highlight: true,
	},
	{
		target: '[data-tour="set-temperature"]',
		content: 'Hier kannst Du die Soll-Temperatur des Raums einstellen (Elektronisches Thermostat). <br >Entspricht den Werten 1 bis 5 bei manuellen Thermostaten.',
		highlight: true,
	},
	{
		target: '[data-tour="valve-position"]',
		content: 'Nur für Expert:innen relevant. <br>Diesen Wert siehst Du in der Realität nicht so einfach. Er zeigt wie weit das Ventil (der Stift) im Ventil geöffnet ist und ist somit den Durchfluss kontrolliert <br> <span class="font-bold">Bitte nicht mit der Thermostat-Stellung (1-5) verwechseln</span>',
		highlight: true,
	},
	{
		target: '[data-tour="simulation-speed"]',
		content: 'Falls Dir das Aufheizen oder Abkühlen zu lange dauert, kannst Du hier die Geschwindigkeit der Simulation erhöhen.',
		highlight: true,
	},
	{
		target: '[date-tour="new-house"]',
		content: 'Wenn Du die Seite neu lädst, kannst Du ein neues Haus mit neuen Parametern generieren.'
	}
];

export default steps;