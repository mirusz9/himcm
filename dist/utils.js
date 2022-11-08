const monthLength = 30;
const yearLength = monthLength * 12;
const flowerBloomStart = 60; // March 1
const flowerBloomEnd = 240; // September 1
const honeyProducedPerDayPerWorker = 0.8 / 26.5; // Grams
const honeyConsumedPerDayPerWorker = 0.011; // Grams
const workerMaxLifespanLowerBoundSummer = 15; // Workers during the summer live 15-38 days
const workerMaxLifespanUpperBoundSummer = 38;
const workerMaxLifespanLowerBoundWinter = 150; // Workers during the winter live 15-38 days
const workerMaxLifespanUpperBoundWinter = 200;
const percentOfWorkersWorking = 0.9;
const honeyConsumedPerDayPerDrone = 0.011; // Grams
const droneMaxLifespanLowerBound = 80; // Drones live for around 90 days if not dead before
const droneMaxLifespanUpperBound = 100;
const percentageOfFertilizedEggs = 0.85;
export const isBloomingSeason = (t) => {
    return t >= flowerBloomStart && t < flowerBloomEnd;
};
export const getWorkerMaxLifespanSummer = () => {
    return (Math.floor(Math.random() * (workerMaxLifespanUpperBoundSummer - workerMaxLifespanLowerBoundSummer)) + workerMaxLifespanLowerBoundSummer);
};
export const getWorkerMaxLifespanWinter = () => {
    return (Math.floor(Math.random() * (workerMaxLifespanUpperBoundWinter - workerMaxLifespanLowerBoundWinter)) + workerMaxLifespanLowerBoundWinter);
};
export const getDroneMaxLifespan = () => {
    return (Math.floor(Math.random() * (droneMaxLifespanUpperBound - droneMaxLifespanLowerBound)) +
        droneMaxLifespanLowerBound);
};
export { monthLength, yearLength, flowerBloomStart, flowerBloomEnd, honeyProducedPerDayPerWorker, percentOfWorkersWorking, honeyConsumedPerDayPerWorker, honeyConsumedPerDayPerDrone, droneMaxLifespanLowerBound, droneMaxLifespanUpperBound, percentageOfFertilizedEggs, };
