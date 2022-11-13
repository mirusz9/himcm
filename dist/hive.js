import { flowerBloomStartI, flowerBloomEndI, honeyProducedPerDayPerWorkerI, percentOfWorkersWorkingI, honeyConsumedPerDayPerWorkerI, honeyConsumedPerDayPerDroneI, percentageOfFertilizedEggsI, honeyConsumedPerDayPerQueenI, maxHoneyCapacityI, maxNumberOfDronesI, maxNumberOfWorkersI, numberOfBeesEatenPerDayI, percentChanceThatHiveIsFoundPerDayI, amountOfHoneyEatenIfHiveIsFoundI, yearLength, getWorkerMaxLifespanSummer, getWorkerMaxLifespanWinter, getDroneMaxLifespan, isBloomingSeason, isQueenLayingEggs, reset, } from './utils.js';
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
let numberOfBeesEatenPerDay;
let percentChanceThatHiveIsFoundPerDay;
let amountOfHoneyEatenIfHiveIsFound;
export default class Hive {
    constructor() {
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
        numberOfBeesEatenPerDay = numberOfBeesEatenPerDayI();
        percentChanceThatHiveIsFoundPerDay = percentChanceThatHiveIsFoundPerDayI();
        amountOfHoneyEatenIfHiveIsFound = amountOfHoneyEatenIfHiveIsFoundI();
        this.workers = [];
        this.workersMaxLifespanSummer = [];
        this.workersMaxLifespanWinter = [];
        this.drones = [];
        this.dronesMaxLifespan = [];
        this.queen = 0;
        this.queenMaxLifespan = yearLength * (2 + Math.floor(Math.random() * 4)) + flowerBloomStart;
        this.honey = 0;
    }
    getPopulation() {
        return this.workers.length + this.drones.length + 1;
    }
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
    simulateDay(t) {
        const years = Math.floor(t / yearLength) * yearLength;
        const survivorWorkers = [];
        const survivorWorkersMaxLifespanSummer = [];
        const survivorWorkersMaxLifespanWinter = [];
        const survivorDrones = [];
        const survivorDronesMaxLifespan = [];
        this.honey -= honeyConsumedPerDayPerQueen;
        // Update the workers
        for (let i = 0; i < Math.min(this.workers.length, maxNumberOfWorkers); i++) {
            const worker = this.workers[i];
            const workerMaxLifespanSummer = this.workersMaxLifespanSummer[i];
            const workerMaxLifespanWinter = this.workersMaxLifespanWinter[i];
            // The worker produces honey
            if (isBloomingSeason(t) && Math.random() < percentOfWorkersWorking) {
                this.honey += honeyProducedPerDayPerWorker;
            }
            // The worker consumes honey
            this.honey -= honeyConsumedPerDayPerWorker;
            // The bee dies if there wasn't enough honey to consume, or reaches death naturally
            if (this.honey < 0 ||
                t - worker > workerMaxLifespanWinter ||
                Math.min(t, flowerBloomEnd + years) - Math.max(worker, flowerBloomStart + years) >
                    workerMaxLifespanSummer) {
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
                this.honey -= honeyConsumedPerDayPerDrone;
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
        // Queen lays eggs
        if (isQueenLayingEggs(t)) {
            if (t - this.queen > this.queenMaxLifespan) {
                this.queen = t;
                this.queenMaxLifespan = yearLength * (2 + Math.floor(Math.random() * 4));
            }
            const amountOfEggsLaid = 1500 - Math.floor((t - this.queen) / yearLength) * 100;
            const numOfNewWorkers = amountOfEggsLaid * percentageOfFertilizedEggs;
            const numOfNewDrones = amountOfEggsLaid * (1 - percentageOfFertilizedEggs);
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
        let numberOfWorkersEaten = numberOfBeesEatenPerDay * percentageOfFertilizedEggs;
        let numberOfDronesEaten = numberOfBeesEatenPerDay * (1 - percentageOfFertilizedEggs);
        if (Math.random() < percentChanceThatHiveIsFoundPerDay) {
            this.honey -= amountOfHoneyEatenIfHiveIsFound;
            numberOfWorkersEaten += Math.floor(this.workers.length / 2);
            numberOfDronesEaten += Math.floor(this.drones.length / 2);
        }
        this.workers = this.workers.splice(0, this.workers.length - numberOfWorkersEaten);
        this.drones = this.drones.splice(0, this.drones.length - numberOfDronesEaten);
        this.honey = Math.max(Math.min(this.honey, maxHoneyCapacity), 0);
    }
}
