import { AbstractGeometry } from "./AbstractGeometry";
import { Point } from "./Point";
import P5 from "p5";
import { AppState } from "../AppState";
import { transformToScreen } from "../utils/transformToScreen";

export class Ray extends AbstractGeometry {
    public start: Point;
    public direction: Point;

    constructor(start: Point, direction: Point, color: number = 150) {
        super(color);

        this.start = start;
        this.direction = direction.normalize();
    }

    public angleTo(point: Point): number {
        return this.direction.angleBetween(point.subtract(this.start));
    }

    public deepCopy(): Ray {
        return new Ray(this.start.copy(), this.direction.copy());
    }

    public copy(): Ray {
        return new Ray(this.start, this.direction.copy());
    }

    public equals(edge: Ray): boolean {
        return (
            this.start.equals(edge.start) &&
            this.direction.equals(edge.direction)
        );
    }

    public toString(): string {
        return `${this.start.toString()} |-> ${this.direction.toString()}`;
    }

    public draw(p5: P5, appState: AppState) {
        const start = transformToScreen(
            appState.transform(this.start.toP5Vector()),
            p5
        );

        const end = transformToScreen(
            appState.transform(
                this.start.add(this.direction.multiply(1000000)).toP5Vector()
            ),
            p5
        );

        p5.stroke(this.color);
        p5.strokeWeight(2);
        p5.noFill();
        p5.line(start.x, start.y, end.x, end.y);
    }
}
