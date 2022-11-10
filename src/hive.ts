import {
	flowerBloomEnd,
	flowerBloomStart,
	getDroneMaxLifespan,
	getWorkerMaxLifespanSummer,
	getWorkerMaxLifespanWinter,
	honeyConsumedPerDayPerDrone,
	honeyConsumedPerDayPerQueen,
	honeyConsumedPerDayPerWorker,
	honeyProducedPerDayPerWorker,
	isBloomingSeason,
	isQueenLayingEggs,
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

	constructor(startDay: number) {
		this.startDay = startDay;
		this.workers = [];
		this.workersMaxLifespanSummer = [];
		this.workersMaxLifespanWinter = [];
		this.drones = [];
		this.dronesMaxLifespan = [];
		this.queens = [startDay];
		this.honey = 0;
	}

	getPopulation() {
		return this.workers.length + this.drones.length + this.queens.length;
	}

	initialize(numOfWorkers: number, numOfDrones: number, honey: number = 20000) {
		this.honey = honey;
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

		this.honey -= honeyConsumedPerDayPerQueen;

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
				Math.min(t, flowerBloomEnd) - Math.max(worker, flowerBloomStart) > workerMaxLifespanSummer
			) {
				if (this.honey < 0) this.honey = 0;
			} else {
				survivorWorkers.push(worker);
				survivorWorkersMaxLifespanSummer.push(workerMaxLifespanSummer);
				survivorWorkersMaxLifespanWinter.push(workerMaxLifespanWinter);
			}
		}
		this.workers = survivorWorkers;
		this.workersMaxLifespanSummer = survivorWorkersMaxLifespanSummer;
		this.workersMaxLifespanWinter = survivorWorkersMaxLifespanWinter;

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
		this.dronesMaxLifespan = survivorDronesMaxLifespan;

		// Queen lays eggs
		if (isQueenLayingEggs(t)) {
			const amountOfEggsLaid = 1500 - Math.floor(t / yearLength) * 100;
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
	}
}
