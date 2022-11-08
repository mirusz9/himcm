import Worker from './worker';
import Drone from './drone';
import Queen from './queen';

export default class Hive {
	workers: Worker[];
	drones: Drone[];
	queens: Queen[];

	constructor() {
		this.workers = [];
		this.drones = [];
		this.queens = [new Queen(0)];
	}

	getPopulation() {
		return this.workers.length + this.drones.length + this.queens.length;
	}

	initialize(numOfWorkers: number, numOfDrones: number) {
		for (let i = 0; i < numOfWorkers; i++) {
			this.workers.push(new Worker(0));
		}
		for (let i = 0; i < numOfDrones; i++) {
			this.workers.push(new Drone(0));
		}
	}

	simulateDay() {
		for (const worker of this.workers) {
			worker.update();
		}

		for (const drone of this.drones) {
			drone.update();
		}
	}
}
