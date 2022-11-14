import Hive from './hive.js';
import { monthLength, yearLength, simulationYearsI, updateFrequencyI } from './utils.js';
const canvas = document.querySelector('#canvas');
const simulationButton = document.querySelector('#run');
const overlay = document.querySelector('#overlay');
const closeB = document.querySelector('#close');
const results = document.querySelector('#results');
closeB.addEventListener('click', close);
simulationButton.addEventListener('click', run);
if (!canvas)
    throw new Error();
let data;
let hive;
let t;
let timeout;
let simulationYears;
let dt;
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    hive.simulateDay(t, dt);
    const pop = hive.getPopulation();
    const workers = hive.workers.length;
    const drones = hive.drones.length;
    (_b = (_a = data.datasets[0]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.push({ x: t, y: pop });
    (_d = (_c = data.datasets[1]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.push({ x: t, y: workers });
    (_f = (_e = data.datasets[2]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.push({ x: t, y: drones });
    (_h = (_g = data.datasets[3]) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.push({ x: t, y: hive.honey });
    (_j = data.labels) === null || _j === void 0 ? void 0 : _j.push(t);
    if (t % (monthLength * 2) == 0)
        drawChart();
    if (pop <= 1 || t > yearLength * simulationYears) {
        drawChart();
        results.innerText = pop <= 1 ? 'The colony died' : 'Maximum simulation time reached';
        results.innerText +=
            ' - Number of times predators found the hive: ' + hive.numberOfPredatorAttacks;
        const avgFlowersVisitedPerYear = Math.round(hive.numberOfFlowersVisitedEachYear.reduce((sum, cur) => sum + cur, 0) /
            hive.numberOfFlowersVisitedEachYear.length);
        results.innerText +=
            ' - Average number of flowers visited per year: ' + avgFlowersVisitedPerYear;
        console.log('Done');
        return;
    }
    t += dt;
    timeout = requestAnimationFrame(simulate);
};
let chart;
const drawChart = () => {
    if (chart)
        chart.destroy();
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
