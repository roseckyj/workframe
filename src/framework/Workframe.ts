import P5 from "p5";
import { AbstractAlgorithm } from "../algorithms/AbstractAlgorithm";
import { algorithms } from "../algorithms/algorithms";
import { AppState } from "./AppState";
import { AbstractGeometry } from "./types/AbstractGeometry";
import { Edge } from "./types/Edge";
import { Point } from "./types/Point";

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
    public algorithm: AbstractAlgorithm | null = null;

    public setAlgorithm(algorithm: string): void {
        this.appState.setSelectedAlgorithm(algorithm);
        this.resetAlgorithm();
    }

    public resetAlgorithm(): void {
        if (this.appState.selectedAlgorithm === null) {
            return;
        }

        this.algorithm = new algorithms[this.appState.selectedAlgorithm].class(
            this
        );
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
            this.appState.incrementAlgorithmStep();
        } while (!this.algorithm.step());

        this.appState.setAlgorithmFinished(true);

        this.clearGeometries();
        this.algorithm.draw();
    }

    public get colors() {
        if (!this.appState.p5) {
            throw new Error("P5 not initialized");
        }
        return {
            default: this.appState.p5.color(100),
            light: this.appState.p5.color(200),
            muni: this.appState.p5.color(0, 0, 220),
            law: this.appState.p5.color(145, 0, 220),
            med: this.appState.p5.color(240, 25, 40),
            sci: this.appState.p5.color(0, 175, 63),
            fi: this.appState.p5.color(242, 212, 92),
            fss: this.appState.p5.color(0, 122, 83),
            fsps: this.appState.p5.color(90, 200, 175),
            phil: this.appState.p5.color(75, 200, 255),
            ped: this.appState.p5.color(255, 115, 0),
            econ: this.appState.p5.color(185, 0, 110),
            pharm: this.appState.p5.color(86, 120, 141),
        };
    }
}
