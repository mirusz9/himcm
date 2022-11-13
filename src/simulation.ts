import Hive from './hive.js';
import { monthLength, yearLength } from './utils.js';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const simulationButton = document.querySelector<HTMLButtonElement>('#run')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
const closeB = document.querySelector<HTMLButtonElement>('#close')!;
closeB.addEventListener('click', close);
simulationButton.addEventListener('click', run);

if (!canvas) throw new Error();
let data: Chart.ChartData;
let hive: Hive;
let t: number;
let timeout: number;

function close() {
	cancelAnimationFrame(timeout);
	overlay.classList.add('hidden');
}

function run() {
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
	hive.simulateDay(t);
	const pop = hive.getPopulation();
	const workers = hive.workers.length;
	const drones = hive.drones.length;

	data.datasets![0]?.data?.push({ x: t, y: pop });
	data.datasets![1]?.data?.push({ x: t, y: workers });
	data.datasets![2]?.data?.push({ x: t, y: drones });
	data.datasets![3]?.data?.push({ x: t, y: hive.honey });
	data.labels?.push(t);

	if (t % (monthLength * 6) == 0) drawChart();
	if (pop <= 1 || t > yearLength * 5) {
		drawChart();
		console.log('Done');
		return;
	}
	t++;
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
