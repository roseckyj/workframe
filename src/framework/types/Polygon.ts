import { AbstractGeometry } from "./AbstractGeometry";
import { Point } from "./Point";
import P5 from "p5";
import { AppState } from "../AppState";
import { transformToScreen } from "../utils/transformToScreen";

export class Polygon extends AbstractGeometry {
    public points: Point[];

    constructor(points: Point[], color?: P5.Color) {
        super(color);

        this.points = points;
    }

    public get edges(): Point[] {
        const edges: Point[] = [];

        for (let i = 0; i < this.points.length; i++) {
            edges.push(this.points[i].subtract(this.points[i + 1]));
        }

        return edges;
    }

    public get length(): number {
        return this.points.reduce((acc, point, i) => {
            return acc + point.distance(this.points[i + 1]);
        }, 0);
    }

    public deepCopy(): Polygon {
        return new Polygon(this.points.map((p) => p.copy()));
    }

    public copy(): Polygon {
        return new Polygon(this.points);
    }

    public equals(polygon: Polygon): boolean {
        return (
            this.points.length === polygon.points.length &&
            this.points.every((p, i) => p.equals(polygon.points[i]))
        );
    }

    public toString(): string {
        return this.points.map((p) => p.toString()).join(", ");
    }

    public draw(p5: P5, appState: AppState) {
        const stroke = this.color || p5.color(100);
        const fill = this.color || p5.color(100);
        fill.setAlpha(20);

        p5.stroke(stroke);
        p5.strokeWeight(2);
        p5.fill(fill);
        p5.beginShape();
        this.points.forEach((p) => {
            const point = transformToScreen(
                appState.transform(p.toP5Vector()),
                p5
            );
            p5.vertex(point.x, point.y);
        });
        p5.endShape(p5.CLOSE);
    }
}
