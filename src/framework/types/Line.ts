import { AbstractGeometry } from "./AbstractGeometry";
import { Point } from "./Point";
import P5 from "p5";
import { AppState } from "../AppState";
import { transformToScreen } from "../utils/transformToScreen";

export class Line extends AbstractGeometry {
    public start: Point;
    public direction: Point;

    constructor(start: Point, direction: Point, color?: P5.Color) {
        super(color);

        this.start = start;
        this.direction = direction.normalize();
    }

    public angleTo(point: Point): number {
        return this.direction.angleBetween(point.subtract(this.start));
    }

    public deepCopy(color?: P5.Color): Line {
        return new Line(
            this.start.copy(),
            this.direction.copy(),
            color || this.color
        );
    }

    public copy(color?: P5.Color): Line {
        return new Line(this.start, this.direction.copy(), color || this.color);
    }

    public equals(edge: Line): boolean {
        // TODO: This is not correct
        return (
            this.start.equals(edge.start) &&
            this.direction.equals(edge.direction)
        );
    }

    public toString(): string {
        return `${this.start.toString()} <-> ${this.direction.toString()}`;
    }

    public draw(p5: P5, appState: AppState) {
        const start = transformToScreen(
            appState.transform(
                this.start
                    .subtract(this.direction.multiply(1000000))
                    .toP5Vector()
            ),
            p5
        );

        const end = transformToScreen(
            appState.transform(
                this.start.add(this.direction.multiply(1000000)).toP5Vector()
            ),
            p5
        );

        p5.stroke(this.color || p5.color(100));
        p5.strokeWeight(2);
        p5.noFill();
        p5.line(start.x, start.y, end.x, end.y);
    }
}
