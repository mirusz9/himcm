import { flowerBloomStartI, flowerBloomEndI, honeyProducedPerDayPerWorkerI, percentOfWorkersWorkingI, honeyConsumedPerDayPerWorkerI, honeyConsumedPerDayPerDroneI, percentageOfFertilizedEggsI, honeyConsumedPerDayPerQueenI, maxHoneyCapacityI, maxNumberOfDronesI, maxNumberOfWorkersI, numberOfBeesEatenPerDayPerBirdI, numberOfBirdsI, percentChanceThatHiveIsFoundPerDayI, amountOfHoneyEatenIfHiveIsFoundI, yearLength, getWorkerMaxLifespanSummer, getWorkerMaxLifespanWinter, getDroneMaxLifespan, isBloomingSeason, isQueenLayingEggs, reset, numberOfFlowersVisitedPerDayPerBeeI, } from './utils.js';
let flowerBloomStart;
let flowerBloomEnd;
let honeyProducedPerDayPerWorker;
let percentOfWorkersWorking;
let honeyConsumedPerDayPerWorker;
let honeyConsumedPerDayPerDrone;
let percentageOfFertilizedEggs;
let honeyConsumedPerDayPerQueen;
let maxHoneyCapacity;
let maxNumberOfDrones;
let maxNumberOfWorkers;
let numberOfBirds;
let numberOfBeesEatenPerDayPerBird;
let percentChanceThatHiveIsFoundPerDay;
let amountOfHoneyEatenIfHiveIsFound;
let numberOfFlowersVisitedPerDayPerBee;
export default class Hive {
    constructor() {
        // When the simulation starts, get all the parameters from the inputs
        reset();
        flowerBloomStart = flowerBloomStartI();
        flowerBloomEnd = flowerBloomEndI();
        honeyProducedPerDayPerWorker = honeyProducedPerDayPerWorkerI();
        percentOfWorkersWorking = percentOfWorkersWorkingI();
        honeyConsumedPerDayPerWorker = honeyConsumedPerDayPerWorkerI();
        honeyConsumedPerDayPerDrone = honeyConsumedPerDayPerDroneI();
        percentageOfFertilizedEggs = percentageOfFertilizedEggsI();
        honeyConsumedPerDayPerQueen = honeyConsumedPerDayPerQueenI();
        maxHoneyCapacity = maxHoneyCapacityI();
        maxNumberOfDrones = maxNumberOfDronesI();
        maxNumberOfWorkers = maxNumberOfWorkersI();
        numberOfBirds = numberOfBirdsI();
        numberOfBeesEatenPerDayPerBird = numberOfBeesEatenPerDayPerBirdI();
        percentChanceThatHiveIsFoundPerDay = percentChanceThatHiveIsFoundPerDayI();
        amountOfHoneyEatenIfHiveIsFound = amountOfHoneyEatenIfHiveIsFoundI();
        numberOfFlowersVisitedPerDayPerBee = numberOfFlowersVisitedPerDayPerBeeI();
        // Initialize hive
        this.workers = [];
        this.workersMaxLifespanSummer = [];
        this.workersMaxLifespanWinter = [];
        this.drones = [];
        this.dronesMaxLifespan = [];
        this.queen = 0;
        this.queenMaxLifespan = yearLength * (2 + Math.floor(Math.random() * 4)) + flowerBloomStart;
        this.honey = 0;
        this.numberOfPredatorAttacks = 0;
        this.numberOfFlowersVisitedEachYear = [0];
    }
    getPopulation() {
        return this.workers.length + this.drones.length + 1;
    }
    // Initialize bees and honey
    initialize(numOfWorkers, numOfDrones, honey = 20000) {
        this.honey = honey;
        for (let i = 0; i < numOfWorkers; i++) {
            this.workers.push(0);
            this.workersMaxLifespanSummer.push(getWorkerMaxLifespanSummer());
            this.workersMaxLifespanWinter.push(getWorkerMaxLifespanWinter());
        }
        for (let i = 0; i < numOfDrones; i++) {
            this.drones.push(0);
            this.dronesMaxLifespan.push(getDroneMaxLifespan());
        }
    }
    // THis runs for every day
    simulateDay(t, dt) {
        const year = Math.floor(t / yearLength);
        const years = year * yearLength;
        const survivorWorkers = [];
        const survivorWorkersMaxLifespanSummer = [];
        const survivorWorkersMaxLifespanWinter = [];
        const survivorDrones = [];
        const survivorDronesMaxLifespan = [];
        // Record the number of flowers visited
        if (this.numberOfFlowersVisitedEachYear[year] === undefined)
            this.numberOfFlowersVisitedEachYear.push(0);
        // The queen consumes honey
        this.honey -= honeyConsumedPerDayPerQueen * dt;
        // Update the workers
        for (let i = 0; i < Math.min(this.workers.length, maxNumberOfWorkers); i++) {
            const worker = this.workers[i];
            const workerMaxLifespanSummer = this.workersMaxLifespanSummer[i];
            const workerMaxLifespanWinter = this.workersMaxLifespanWinter[i];
            // The worker produces honey
            if (isBloomingSeason(t) && Math.random() < percentOfWorkersWorking) {
                this.honey += honeyProducedPerDayPerWorker * dt;
                this.numberOfFlowersVisitedEachYear[year] += numberOfFlowersVisitedPerDayPerBee * dt;
            }
            // The worker consumes honey
            this.honey -= honeyConsumedPerDayPerWorker * dt;
            // The bee dies if there wasn't enough honey to consume, or reaches death naturally
            if (this.honey < 0 ||
                t - worker > workerMaxLifespanWinter ||
                Math.min(t, flowerBloomEnd + years) - Math.max(worker, flowerBloomStart + years) > workerMaxLifespanSummer) {
                if (this.honey < 0)
                    this.honey = 0;
            }
            else {
                survivorWorkers.push(worker);
                survivorWorkersMaxLifespanSummer.push(workerMaxLifespanSummer);
                survivorWorkersMaxLifespanWinter.push(workerMaxLifespanWinter);
            }
        }
        this.workers = survivorWorkers;
        this.workersMaxLifespanSummer = survivorWorkersMaxLifespanSummer;
        this.workersMaxLifespanWinter = survivorWorkersMaxLifespanWinter;
        // Update the drones
        if (isBloomingSeason(t)) {
            for (let i = 0; i < Math.min(this.drones.length, maxNumberOfDrones); i++) {
                const drone = this.drones[i];
                const droneMaxLifespan = this.dronesMaxLifespan[i];
                // The drone consumes honey
                this.honey -= honeyConsumedPerDayPerDrone * dt;
                // The bee dies if there wasn't enough honey to consume, or reaches death naturally
                if (this.honey < 0 || t - drone > droneMaxLifespan) {
                    if (this.honey < 0)
                        this.honey = 0;
                }
                else {
                    survivorDrones.push(drone);
                    survivorDronesMaxLifespan.push(droneMaxLifespan);
                }
            }
        }
        this.drones = survivorDrones;
        this.dronesMaxLifespan = survivorDronesMaxLifespan;
        // Update the queen
        if (isQueenLayingEggs(t)) {
            // If the queen dies, a new queen is born
            if (t - this.queen > this.queenMaxLifespan) {
                this.queen = t;
                this.queenMaxLifespan = yearLength * (2 + Math.floor(Math.random() * 4));
            }
            // Queen lays eggs
            const amountOfEggsLaid = 1500 - Math.floor((t - this.queen) / yearLength) * 100;
            const numOfNewWorkers = amountOfEggsLaid * percentageOfFertilizedEggs * dt;
            const numOfNewDrones = amountOfEggsLaid * (1 - percentageOfFertilizedEggs) * dt;
            for (let i = 0; i < numOfNewWorkers; i++) {
                this.workers.unshift(t);
                this.workersMaxLifespanSummer.unshift(getWorkerMaxLifespanSummer());
                this.workersMaxLifespanWinter.unshift(getWorkerMaxLifespanWinter());
            }
            for (let i = 0; i < numOfNewDrones; i++) {
                this.drones.unshift(t);
                this.dronesMaxLifespan.unshift(getDroneMaxLifespan());
            }
        }
        // Predators attack the hive
        let numberOfWorkersEaten = numberOfBeesEatenPerDayPerBird * numberOfBirds * percentageOfFertilizedEggs * dt;
        let numberOfDronesEaten = numberOfBeesEatenPerDayPerBird * numberOfBirds * (1 - percentageOfFertilizedEggs) * dt;
        if (Math.random() > (1 - percentChanceThatHiveIsFoundPerDay) ** dt) {
            this.numberOfPredatorAttacks++;
            this.honey -= amountOfHoneyEatenIfHiveIsFound;
            numberOfWorkersEaten += Math.floor(this.workers.length / 2);
            numberOfDronesEaten += Math.floor(this.drones.length / 2);
        }
        this.workers = this.workers.splice(0, this.workers.length - numberOfWorkersEaten);
        this.drones = this.drones.splice(0, this.drones.length - numberOfDronesEaten);
        this.honey = Math.max(Math.min(this.honey, maxHoneyCapacity), 0);
    }
}
