import Hive from './hive.js';
import { monthLength, yearLength } from './utils.js';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
if (!canvas) throw new Error();
const data: Chart.ChartData = {
	datasets: [
		{ data: [], backgroundColor: '#ff0000', label: 'Population' },
		{ data: [], backgroundColor: '#00ff00', label: 'Workers' },
		{ data: [], backgroundColor: '#0000ff', label: 'Drones' },
		{ data: [], backgroundColor: '#d39f50', label: 'Honey' },
	],
	labels: [],
};

let t = 0; // Time in days
const start = new Date().getTime();

const hive = new Hive(t);
hive.initialize(20000, 0);

const simulate = () => {
	hive.simulateDay(t);
	const pop = hive.getPopulation();
	const workers = hive.workers.length;
	const drones = hive.drones.length;

	data.datasets![0]?.data?.push({x: t, y: pop});
	data.datasets![1]?.data?.push({x: t, y: workers});
	data.datasets![2]?.data?.push({x: t, y: drones});
	data.datasets![3]?.data?.push({x: t, y: hive.honey});
	data.labels?.push(t);

	if (t % (monthLength * 4) == 0) drawChart();
	if (pop <= 1 || t > yearLength * 20) {
		drawChart();
		console.log('Done');
		return;
	}
	t++;
	timeout = requestAnimationFrame(simulate);
};

let timeout = requestAnimationFrame(simulate);
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
					max: t;
				}
			},
			spanGaps: true,
			showLine: false,
			parsing: false
		},
	});
};
