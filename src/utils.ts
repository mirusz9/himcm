const monthLength = 30;
const yearLength = monthLength * 12;
const flowerBloomStart = 60; // March 1
const flowerBloomEnd = 240; // September 1
const honeyProducedPerDayPerWorker = 0.8 / 26.5; // Grams
const honeyConsumedPerDayPerWorker = 0.011; // Grams
const percentOfWorkersWorking = 0.9;
const honeyConsumedPerDayPerDrone = 0.011; // Grams

export const isBloomingSeason = (t: number) => {
	return t >= flowerBloomStart && t < flowerBloomEnd;
};

export {
	monthLength,
	yearLength,
	flowerBloomStart,
	flowerBloomEnd,
	honeyProducedPerDayPerWorker,
	percentOfWorkersWorking,
	honeyConsumedPerDayPerWorker,
	honeyConsumedPerDayPerDrone,
};
