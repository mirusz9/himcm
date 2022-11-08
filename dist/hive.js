"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = __importDefault(require("./worker"));
const drone_1 = __importDefault(require("./drone"));
const queen_1 = __importDefault(require("./queen"));
class Hive {
    constructor() {
        this.workers = [];
        this.drones = [];
        this.queens = [new queen_1.default(0)];
    }
    getPopulation() {
        return this.workers.length + this.drones.length + this.queens.length;
    }
    initialize(numOfWorkers, numOfDrones) {
        for (let i = 0; i < numOfWorkers; i++) {
            this.workers.push(new worker_1.default(0));
        }
        for (let i = 0; i < numOfDrones; i++) {
            this.workers.push(new drone_1.default(0));
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
exports.default = Hive;
