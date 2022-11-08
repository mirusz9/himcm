import { honeyConsumedPerDayPerDrone, honeyConsumedPerDayPerWorker, honeyProducedPerDayPerWorker, isBloomingSeason, percentOfWorkersWorking, } from './utils.js';
export default class Hive {
    constructor(startDay, honey = 0) {
        this.startDay = startDay;
        this.workers = [];
        this.drones = [];
        this.queens = [startDay];
        this.honey = honey;
    }
    getPopulation() {
        return this.workers.length + this.drones.length + this.queens.length;
    }
    initialize(numOfWorkers, numOfDrones) {
        for (let i = 0; i < numOfWorkers; i++) {
            this.workers.push(this.startDay);
        }
        for (let i = 0; i < numOfDrones; i++) {
            this.drones.push(this.startDay);
        }
    }
    simulateDay(t) {
        const survivorWorkers = [];
        const survivorDrones = [];
        for (const worker of this.workers) {
            // The worker produces honey
            if (isBloomingSeason(t) && Math.random() < percentOfWorkersWorking) {
                this.honey += honeyProducedPerDayPerWorker;
            }
            // The worker consumes honey
            this.honey -= honeyConsumedPerDayPerWorker;
            if (this.honey < 0) {
                this.honey = 0;
            }
            else {
                survivorWorkers.push(worker);
            }
        }
        for (const drone of this.drones) {
            // The drone consumes honey
            this.honey -= honeyConsumedPerDayPerDrone;
            if (this.honey < 0) {
                this.honey = 0;
            }
            else {
                survivorDrones.push(drone);
            }
        }
    }
}
