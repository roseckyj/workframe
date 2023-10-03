import { action, makeObservable, observable, runInAction } from "mobx";
import p5 from "p5";
import { Point } from "./types/Point";

export enum Tool {
    Pan = "pan",
    Add = "add",
    Move = "move",
    Remove = "remove",
}

export class AppState {
    public constructor() {
        makeObservable(this);
    }

    @observable
    public position: p5.Vector = new p5.Vector(0, 0);

    @observable
    public scale: number = 1;

    @observable
    public tool: Tool = Tool.Pan;

    @observable
    public draggingPoint: number | null = null;

    @observable
    public selectedAlgorithm: string | null = null;

    @observable
    public autorun: boolean = false;

    @observable
    public algorithmStep: number = 0;

    @observable
    public algorithmFinished: boolean = false;

    @action
    public resetAlgorithmStep(): void {
        runInAction(() => {
            this.algorithmStep = 0;
        });
    }

    @action
    public incrementAlgorithmStep(): void {
        runInAction(() => {
            this.algorithmStep++;
        });
    }

    @action
    public setAlgorithmFinished(finished: boolean): void {
        runInAction(() => {
            this.algorithmFinished = finished;
        });
    }

    @action
    public setAutorun(autorun: boolean): void {
        runInAction(() => {
            this.autorun = autorun;
        });
    }

    @action
    public setSelectedAlgorithm(algorithm: string | null): void {
        runInAction(() => {
            this.selectedAlgorithm = algorithm;
        });
    }

    @action
    public setDraggingPoint(point: number | null): void {
        runInAction(() => {
            this.draggingPoint = point;
        });
    }

    @action
    public setTool(tool: Tool): void {
        runInAction(() => {
            this.tool = tool;
        });
    }

    @action
    public async drag(delta: p5.Vector): Promise<void> {
        runInAction(() => {
            this.position.add(delta.mult(1 / this.scale));
        });
    }

    @action
    public async zoom(delta: number): Promise<void> {
        runInAction(() => {
            if (this.scale + delta > 0.1 && this.scale + delta < 1000) {
                this.scale += delta;
            }
        });
    }

    @action
    public async reset(): Promise<void> {
        runInAction(() => {
            this.position = new p5.Vector(0, 0);
            this.scale = 1;
        });
    }

    public transform(vector: p5.Vector): p5.Vector {
        return vector.copy().sub(this.position).mult(this.scale);
    }

    public reverseTransform(vector: p5.Vector): p5.Vector {
        return vector.copy().div(this.scale).add(this.position);
    }
}
