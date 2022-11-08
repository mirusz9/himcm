import {
	flowerBloomEnd,
	flowerBloomStart,
	getDroneMaxLifespan,
	getWorkerMaxLifespanSummer,
	getWorkerMaxLifespanWinter,
	honeyConsumedPerDayPerDrone,
	honeyConsumedPerDayPerWorker,
	honeyProducedPerDayPerWorker,
	isBloomingSeason,
	percentageOfFertilizedEggs,
	percentOfWorkersWorking,
	yearLength,
} from './utils.js';

export default class Hive {
	startDay: number;
	workers: number[];
	workersMaxLifespanSummer: number[];
	workersMaxLifespanWinter: number[];
	drones: number[];
	dronesMaxLifespan: number[];
	queens: number[];
	honey: number;

	constructor(startDay: number, honey: number = 20000) {
		this.startDay = startDay;
		this.workers = [];
		this.workersMaxLifespanSummer = [];
		this.workersMaxLifespanWinter = [];
		this.drones = [];
		this.dronesMaxLifespan = [];
		this.queens = [startDay];
		this.honey = honey;
	}

	getPopulation() {
		return this.workers.length + this.drones.length + this.queens.length;
	}

	initialize(numOfWorkers: number, numOfDrones: number) {
		for (let i = 0; i < numOfWorkers; i++) {
			this.workers.push(this.startDay);
			this.workersMaxLifespanSummer.push(getWorkerMaxLifespanSummer());
			this.workersMaxLifespanWinter.push(getWorkerMaxLifespanWinter());
		}
		for (let i = 0; i < numOfDrones; i++) {
			this.drones.push(this.startDay);
			this.dronesMaxLifespan.push(getDroneMaxLifespan());
		}
	}

	simulateDay(t: number) {
		const years = Math.floor(t / yearLength) * yearLength;
		const survivorWorkers: number[] = [];
		const survivorWorkersMaxLifespanSummer: number[] = [];
		const survivorWorkersMaxLifespanWinter: number[] = [];
		const survivorDrones: number[] = [];
		const survivorDronesMaxLifespan: number[] = [];

		// Update the workers
		for (let i = 0; i < this.workers.length; i++) {
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
			if (
				this.honey < 0 ||
				t - worker > workerMaxLifespanWinter ||
				t - Math.min(Math.max(worker, flowerBloomStart + years), flowerBloomEnd + years) >
					workerMaxLifespanSummer
			) {
				if (this.honey < 0) this.honey = 0;
			} else {
				survivorWorkers.push(worker);
				survivorWorkersMaxLifespanSummer.push(workerMaxLifespanSummer);
				survivorWorkersMaxLifespanWinter.push(workerMaxLifespanWinter);
			}
		}
		this.workers = survivorWorkers;

		// Update the drones
		for (let i = 0; i < this.drones.length; i++) {
			const drone = this.drones[i];
			const droneMaxLifespan = this.dronesMaxLifespan[i];

			// The drone consumes honey
			this.honey -= honeyConsumedPerDayPerDrone;

			// The bee dies if there wasn't enough honey to consume, or reaches death naturally
			if (this.honey < 0 || t - drone > droneMaxLifespan) {
				if (this.honey < 0) this.honey = 0;
			} else {
				survivorDrones.push(drone);
				survivorDronesMaxLifespan.push(droneMaxLifespan);
			}
		}
		this.drones = survivorDrones;

		// Queen lays eggs
		if (isBloomingSeason(t)) {
			const numOfNewWorkers = 1350 * percentageOfFertilizedEggs;
			const numOfNewDrones = 1350 * (1 - percentageOfFertilizedEggs);

			for (let i = 0; i < numOfNewWorkers; i++) {
				this.workers.push(t);
				this.workersMaxLifespanSummer.push(getWorkerMaxLifespanSummer());
				this.workersMaxLifespanWinter.push(getWorkerMaxLifespanWinter());
			}
			for (let i = 0; i < numOfNewDrones; i++) {
				this.drones.push(t);
				this.dronesMaxLifespan.push(getDroneMaxLifespan());
			}
		}
	}
}
