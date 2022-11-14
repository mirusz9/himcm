import { createSetting } from './settings.js';
const monthLength = 30;
const yearLength = monthLength * 12;
const simulationYearsI = createSetting('The maximum number of years the simulation should be run for', 10, 0);
const updateFrequencyI = createSetting('How often the simulation recalculates the population', 2, 1, 5, 'By default, the simulation updates every day. High values will result in a faster but less accurate simulation');
const flowerBloomStartI = createSetting('Flower Bloom Start Date', 85, 0, yearLength); // March 1
const flowerBloomEndI = createSetting('Flower Bloom End date', 255, 0, yearLength); // September 1
const honeyProducedPerDayPerWorkerI = createSetting('Honey produced Per Day Per Worker (grams)', 0.0302, 0, 1); // Grams
const numberOfFlowersVisitedPerDayPerBeeI = createSetting('Number of flowers visited per day per bee', 2000, 0);
const honeyConsumedPerDayPerWorkerI = createSetting('Honey Consumed Per Day Per worker (grams)', 0.011, 0, 1); // Grams
const workerMaxLifespanLowerBoundSummerI = createSetting('Worker Max Lifespan In Summer Lower Bound', 15, 0); // Workers during the summer live 15-38 days
const workerMaxLifespanUpperBoundSummerI = createSetting('Worker Max Lifespan In Summer Upper Bound', 38, 0);
const workerMaxLifespanLowerBoundWinterI = createSetting('Worker Max Lifespan In Winter Lower Bound', 150, 0); // Workers during the winter live 150 - 200 days
const workerMaxLifespanUpperBoundWinterI = createSetting('Worker Max Lifespan In Winter Upper Bound', 200, 0);
const percentOfWorkersWorkingI = createSetting('Percentage of all workers working', 0.9, 0, 1);
const honeyConsumedPerDayPerDroneI = createSetting('Honey consumed per day per drone (grams)', 0.0183, 0); // Grams
const droneMaxLifespanLowerBoundI = createSetting('Drone Max Lifespan Lower Bound', 80, 0); // Drones live for around 90 days if not dead before
const droneMaxLifespanUpperBoundI = createSetting('Drone Max Lifespan Upper Bound', 100, 0);
const percentageOfFertilizedEggsI = createSetting('The percentage of eggs that get fertilized', 0.94, 0, 1);
const honeyConsumedPerDayPerQueenI = createSetting('Honey consumed per day per queen (grams)', 0.01925, 0); // Grams
const queenEggLayingStartI = createSetting('The day the queen starts laying eggs', 85, 0, yearLength);
const queenEggLayingEndI = createSetting('The day the queen stops laying eggs', 255, 0, yearLength); // September 1
const maxHoneyCapacityI = createSetting('The maximum amount of honey the hive can hold (grams)', 100000, 0); // Grams
const maxNumberOfWorkersI = createSetting('The maximum number of workers a hive can hold', Math.floor(80000 * percentageOfFertilizedEggsI()), 0);
const maxNumberOfDronesI = createSetting('The maximum number of drones a hive can hold', Math.floor(80000 * (1 - percentageOfFertilizedEggsI())), 0);
const numberOfBirdsI = createSetting('The number of birds near the hive', 5, 0);
const numberOfBeesEatenPerDayPerBirdI = createSetting('The number of bees eaten per bird per day', 11, 0);
const percentChanceThatHiveIsFoundPerDayI = createSetting('The chance that the hive gets found per day by a predator', 0.001, 0);
const amountOfHoneyEatenIfHiveIsFoundI = createSetting('The amount of honey eaten if the hive is found (grams)', 50000, 0); // Grams
let flowerBloomEnd = flowerBloomEndI();
let flowerBloomStart = flowerBloomStartI();
let queenEggLayingEnd = queenEggLayingEndI();
let queenEggLayingStart = queenEggLayingStartI();
let workerMaxLifespanLowerBoundSummer = workerMaxLifespanLowerBoundSummerI();
let workerMaxLifespanUpperBoundSummer = workerMaxLifespanUpperBoundSummerI();
let workerMaxLifespanLowerBoundWinter = workerMaxLifespanLowerBoundWinterI();
let workerMaxLifespanUpperBoundWinter = workerMaxLifespanUpperBoundWinterI();
let droneMaxLifespanLowerBound = droneMaxLifespanLowerBoundI();
let droneMaxLifespanUpperBound = droneMaxLifespanUpperBoundI();
export const reset = () => {
    flowerBloomEnd = flowerBloomEndI();
    flowerBloomStart = flowerBloomStartI();
    queenEggLayingEnd = queenEggLayingEndI();
    queenEggLayingStart = queenEggLayingStartI();
    workerMaxLifespanLowerBoundSummer = workerMaxLifespanLowerBoundSummerI();
    workerMaxLifespanUpperBoundSummer = workerMaxLifespanUpperBoundSummerI();
    workerMaxLifespanLowerBoundWinter = workerMaxLifespanLowerBoundWinterI();
    workerMaxLifespanUpperBoundWinter = workerMaxLifespanUpperBoundWinterI();
    droneMaxLifespanLowerBound = droneMaxLifespanLowerBoundI();
    droneMaxLifespanUpperBound = droneMaxLifespanUpperBoundI();
};
export const isBloomingSeason = (t) => {
    t = t % yearLength;
    return t >= flowerBloomStart && t < flowerBloomEnd;
};
export const isQueenLayingEggs = (t) => {
    t = t % yearLength;
    return t >= queenEggLayingStart && t < queenEggLayingEnd;
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
export { monthLength, yearLength, simulationYearsI, flowerBloomStartI, flowerBloomEndI, honeyProducedPerDayPerWorkerI, percentOfWorkersWorkingI, honeyConsumedPerDayPerWorkerI, honeyConsumedPerDayPerDroneI, droneMaxLifespanLowerBoundI, droneMaxLifespanUpperBoundI, percentageOfFertilizedEggsI, honeyConsumedPerDayPerQueenI, maxHoneyCapacityI, maxNumberOfDronesI, maxNumberOfWorkersI, numberOfBeesEatenPerDayPerBirdI, numberOfBirdsI, percentChanceThatHiveIsFoundPerDayI, amountOfHoneyEatenIfHiveIsFoundI, updateFrequencyI, numberOfFlowersVisitedPerDayPerBeeI, };
