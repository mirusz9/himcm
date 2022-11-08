import Hive from './hive.js';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const population = document.querySelector<HTMLParagraphElement>('#population');
if (!population || !canvas) throw new Error();
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

const hive = new Hive(t);
hive.initialize(20000, 7500);

const simulate = () => {
	hive.simulateDay(t);
	const pop = hive.getPopulation();
	const workers = hive.workers.length;
	const drones = hive.drones.length;

	data.datasets![0]?.data?.push(pop);
	data.datasets![1]?.data?.push(workers);
	data.datasets![2]?.data?.push(drones);
	data.datasets![3]?.data?.push(hive.honey);
	data.labels?.push(t);

	console.log(t, hive.honey, pop);
	if (pop <= 1) return drawChart();
	animationFrame = requestAnimationFrame(simulate);
	t++;
};

let animationFrame = requestAnimationFrame(simulate);

const drawChart = () => {
	const chart = new Chart(canvas, { type: 'line', data });
};
