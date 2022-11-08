import Hive from './hive.js';
const canvas = document.querySelector('#canvas');
const population = document.querySelector('#population');
if (!population || !canvas)
    throw new Error();
const data = {
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    hive.simulateDay(t);
    const pop = hive.getPopulation();
    const workers = hive.workers.length;
    const drones = hive.drones.length;
    (_b = (_a = data.datasets[0]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.push(pop);
    (_d = (_c = data.datasets[1]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.push(workers);
    (_f = (_e = data.datasets[2]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.push(drones);
    (_h = (_g = data.datasets[3]) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.push(hive.honey);
    (_j = data.labels) === null || _j === void 0 ? void 0 : _j.push(t);
    console.log(t, hive.honey, pop);
    if (pop <= 1)
        return drawChart();
    animationFrame = requestAnimationFrame(simulate);
    t++;
};
let animationFrame = requestAnimationFrame(simulate);
const drawChart = () => {
    const chart = new Chart(canvas, { type: 'line', data });
};
