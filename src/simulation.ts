import Hive from './hive.js';
import { monthLength, yearLength, simulationYearsI, updateFrequencyI } from './utils.js';

// Get DOM elements
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const simulationButton = document.querySelector<HTMLButtonElement>('#run')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
const closeB = document.querySelector<HTMLButtonElement>('#close')!;
const results = document.querySelector<HTMLParagraphElement>('#results')!;
closeB.addEventListener('click', close);
simulationButton.addEventListener('click', run);

if (!canvas) throw new Error();
let data: Chart.ChartData;
let hive: Hive;
let t: number;
let timeout: number;
let simulationYears: number;
let dt: number;

function close() {
	results.innerText = '';
	cancelAnimationFrame(timeout);
	overlay.classList.add('hidden');
}

function run() {
	simulationYears = simulationYearsI();
	dt = updateFrequencyI();
	overlay.classList.remove('hidden');
	data = {
		datasets: [
			{ data: [], backgroundColor: '#A63F03', label: 'Population' },
			{ data: [], backgroundColor: '#888888', label: 'Workers' },
			{ data: [], backgroundColor: '#444444', label: 'Drones' },
			{ data: [], backgroundColor: '#D99C2B', label: 'Honey' },
		],
		labels: [],
	};

	t = 0; // Time in days
	hive = new Hive();
	hive.initialize(20000, 0);
	timeout = requestAnimationFrame(simulate);
}

const simulate = () => {
	hive.simulateDay(t, dt);
	const pop = hive.getPopulation();
	const workers = hive.workers.length;
	const drones = hive.drones.length;

	// Record the data
	data.datasets![0]?.data?.push({ x: t, y: pop });
	data.datasets![1]?.data?.push({ x: t, y: workers });
	data.datasets![2]?.data?.push({ x: t, y: drones });
	data.datasets![3]?.data?.push({ x: t, y: hive.honey });
	data.labels?.push(t);

	// Update the chart every other month
	if (t % (monthLength * 2) == 0) drawChart();

	// Check if the simulation is over
	if (pop <= 1 || t > yearLength * simulationYears) {
		drawChart();

		results.innerText = pop <= 1 ? 'The colony died' : 'Maximum simulation time reached';
		results.innerText += ' - Number of times predators found the hive: ' + hive.numberOfPredatorAttacks;
		const avgFlowersVisitedPerYear = Math.round(
			hive.numberOfFlowersVisitedEachYear.reduce((sum, cur) => sum + cur, 0) / hive.numberOfFlowersVisitedEachYear.length
		);
		results.innerText += ' - Average number of flowers visited per year: ' + avgFlowersVisitedPerYear;

		console.log('Done');
		return;
	}
	t += dt;
	timeout = requestAnimationFrame(simulate);
};

let chart: Chart;
const drawChart = () => {
	if (chart) chart.destroy();
	chart = new Chart(canvas, {
		type: 'line',
		data,
		options: {
			animation: false,
			normalized: true,
			scales: {
				x: {
					type: 'linear',
					min: 0,
					max: t,
					title: {
						display: true,
						text: 'Time (days)',
					},
				},
				y: {
					type: 'linear',
					min: 0,
					title: {
						display: true,
						text: 'Number of bees & Amount of honey (grams)',
					},
				},
			},
			spanGaps: true,
			showLine: false,
			parsing: false,
			layout: {
				padding: 20,
			},
		},
	});
};
