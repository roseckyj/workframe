import P5 from "p5";
import { AppState } from "../AppState";
import { transformToScreen } from "../utils/transformToScreen";
import { AbstractGeometry } from "./AbstractGeometry";
import { Point } from "./Point";

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

    public deepCopy(color?: P5.Color): Edge {
        return new Edge(
            this.start.copy(),
            this.end.copy(),
            color || this.color
        );
    }

    public copy(color?: P5.Color): Edge {
        return new Edge(this.start, this.end, color || this.color);
    }

    public reverse(): Edge {
        return new Edge(this.end, this.start, this.color);
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

        // Draw an arrow
        const direction = this.end.subtract(this.start).normalize();
        const arrowStart = this.end.subtract(direction.multiply(20));

        p5.strokeWeight(8);
        p5.line(
            transformToScreen(appState.transform(arrowStart.toP5Vector()), p5)
                .x,
            transformToScreen(appState.transform(arrowStart.toP5Vector()), p5)
                .y,
            end.x,
            end.y
        );
    }

    public valueof(): string {
        return `${this.start.toString()} -> ${this.end.toString()}`;
    }
}
