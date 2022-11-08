import Hive from './hive.js';

const canvas = document.querySelector('#canvas');
const population = document.querySelector<HTMLParagraphElement>('#population');
if (!population || !canvas) throw new Error();

let t = 0; // Time in days

const hive = new Hive(t);
hive.initialize(20000, 7500);

const simulate = () => {
	hive.simulateDay(t);
	population.innerText = '' + hive.getPopulation();
	animationFrame = requestAnimationFrame(simulate);
};

let animationFrame = requestAnimationFrame(simulate);

export default {}