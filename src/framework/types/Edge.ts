import { AbstractGeometry } from "./AbstractGeometry";
import { Point } from "./Point";
import P5 from "p5";
import { AppState } from "../AppState";
import { transformToScreen } from "../utils/transformToScreen";

export class Edge extends AbstractGeometry {
    public start: Point;
    public end: Point;

    constructor(start: Point, end: Point, color?: P5.Color) {
        super(color);

        this.start = start;
        this.end = end;
    }

    public get length(): number {
        return this.start.distance(this.end);
    }

    public deepCopy(): Edge {
        return new Edge(this.start.copy(), this.end.copy());
    }

    public copy(): Edge {
        return new Edge(this.start, this.end);
    }

    public equals(edge: Edge): boolean {
        return this.start.equals(edge.start) && this.end.equals(edge.end);
    }

    public toString(): string {
        return `${this.start.toString()} -> ${this.end.toString()}`;
    }

    public draw(p5: P5, appState: AppState) {
        const start = transformToScreen(
            appState.transform(this.start.toP5Vector()),
            p5
        );

        const end = transformToScreen(
            appState.transform(this.end.toP5Vector()),
            p5
        );

        p5.stroke(this.color || p5.color(100));
        p5.strokeWeight(2);
        p5.noFill();
        p5.line(start.x, start.y, end.x, end.y);
    }
}
