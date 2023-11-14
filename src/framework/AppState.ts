import { action, makeObservable, observable, runInAction } from "mobx";
import P5 from "p5";

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
    public position: P5.Vector = new P5.Vector(0, 0);

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

    @observable
    public showCode: boolean = false;

    @observable
    public showPolygon: boolean = false;

    @action
    public toggleShowPolygon(): void {
        runInAction(() => {
            this.showPolygon = !this.showPolygon;
        });
    }

    @action
    public toggleCode(): void {
        runInAction(() => {
            this.showCode = !this.showCode;
            this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
        });
    }

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
    public async drag(delta: P5.Vector): Promise<void> {
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
            this.position = new P5.Vector(0, 0);
            this.scale = 1;
        });
    }

    public transform(vector: P5.Vector): P5.Vector {
        return vector.copy().sub(this.position).mult(this.scale);
    }

    public reverseTransform(vector: P5.Vector): P5.Vector {
        return vector.copy().div(this.scale).add(this.position);
    }

    public p5!: P5;
}
