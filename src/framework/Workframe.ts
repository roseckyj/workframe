import { AbstractAlgorithm } from "../algorithms/AbstractAlgorithm";
import { AppState } from "./AppState";
import { AbstractGeometry } from "./types/AbstractGeometry";
import P5 from "p5";
import { Point } from "./types/Point";
import { Edge } from "./types/Edge";
import { algorithms } from "../algorithms/algorithms";

export type WorkframeConfig = {
    grid: {
        primary: number;
        secondary: number;
    };
};

export class Workframe {
    public appState: AppState = new AppState();

    public config: WorkframeConfig;

    constructor(config: WorkframeConfig) {
        this.config = config;
    }

    // Input
    public points: Point[] = [];
    public edges: Edge[] = [];

    // Geometries
    private _geometries: AbstractGeometry[] = [];

    public get geometries(): AbstractGeometry[] {
        return this._geometries;
    }

    public addGeometry(...geometries: AbstractGeometry[]): void {
        this._geometries.push(...geometries);
    }

    public clearGeometries(): void {
        this._geometries = [];
    }

    public draw(p5: P5): void {
        if (this.appState.autorun) {
            this.resetAlgorithm();
            this.run();
        }

        this.geometries.forEach((geometry) => {
            geometry.draw(p5, this.appState);
        });
    }

    // Algorithm
    private algorithm: AbstractAlgorithm | null = null;

    public setAlgorithm(algorithm: string): void {
        this.appState.setSelectedAlgorithm(algorithm);
        this.resetAlgorithm();
    }

    public resetAlgorithm(): void {
        if (this.appState.selectedAlgorithm === null) {
            return;
        }

        this.algorithm = new algorithms[this.appState.selectedAlgorithm](this);
        this.appState.setAlgorithmFinished(false);
        this.appState.resetAlgorithmStep();
        const setupResult = this.algorithm!.setup();
        this.clearGeometries();
        this.algorithm!.draw();

        if (setupResult) {
            this.appState.setAlgorithmFinished(true);
        }
    }

    public step(): void {
        if (this.appState.algorithmFinished) return;
        this.clearGeometries();

        if (this.algorithm === null) {
            return;
        }

        this.appState.setAlgorithmFinished(this.algorithm.step());
        this.appState.incrementAlgorithmStep();
        this.algorithm.draw();

        if (this.appState.algorithmFinished) {
            this.clearGeometries();
            this.algorithm.draw();
        }
    }

    public run(): void {
        if (this.appState.algorithmFinished) return;
        if (this.algorithm === null) {
            return;
        }

        do {
            this.appState.algorithmStep++;
        } while (!this.algorithm.step());

        this.appState.setAlgorithmFinished(true);

        this.clearGeometries();
        this.algorithm.draw();
    }
}
