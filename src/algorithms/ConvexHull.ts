import { Edge } from "../framework/types/Edge";
import { Point } from "../framework/types/Point";
import { Polygon } from "../framework/types/Polygon";
import { Ray } from "../framework/types/Ray";
import { AbstractAlgorithm } from "./AbstractAlgorithm";

export class ConvexHull extends AbstractAlgorithm {
    private currentPoint!: Point;
    private startPoint!: Point;

    private hull: Point[] = [];

    public setup(): boolean {
        if (this.workframe.points.length === 0) {
            return true;
        }

        let currentY = this.workframe.points[0].y;
        this.currentPoint = this.workframe.points[0];
        for (const point of this.workframe.points) {
            if (point.y > currentY) {
                this.currentPoint = point;
                currentY = point.y;
            }
        }

        this.startPoint = this.currentPoint;
        return false;
    }

    public step(): boolean {
        const ray = new Ray(
            this.currentPoint,
            this.hull.length > 0
                ? this.currentPoint.subtract(this.hull[this.hull.length - 1])
                : new Point(1, 0)
        );
        this.workframe.addGeometry(ray);

        const sorted = this.workframe.points
            .filter(
                (point) =>
                    this.hull.indexOf(point) <= 0 && point !== this.currentPoint
            )
            .sort((a, b) => ray.angleTo(b) - ray.angleTo(a));

        this.workframe.addGeometry(
            new Ray(this.currentPoint, sorted[0].subtract(this.currentPoint))
        );

        this.hull.push(this.currentPoint);
        this.currentPoint = sorted[0];

        if (this.currentPoint === this.startPoint) {
            this.hull.push(this.currentPoint);
        }

        return this.currentPoint === this.startPoint;
    }

    public draw(): void {
        console.log("Draw");

        this.workframe.addGeometry(...this.workframe.points);
        this.hull.forEach((point, index) => {
            if (index === 0) return;
            const nextPoint = this.hull[index - 1];
            this.workframe.addGeometry(
                new Edge(
                    point,
                    nextPoint,
                    this.workframe.appState.p5.color(242, 212, 92)
                )
            );
        });

        this.workframe.addGeometry(
            ...this.hull.map((point) => {
                point = point.copy();
                point.color = this.workframe.appState.p5.color(242, 212, 92);
                return point;
            })
        );

        if (
            this.hull.length > 1 &&
            this.hull[0].equals(this.hull[this.hull.length - 1])
        ) {
            this.workframe.addGeometry(
                new Polygon(
                    this.hull,
                    this.workframe.appState.p5.color(242, 212, 92)
                )
            );
        }
    }
}
