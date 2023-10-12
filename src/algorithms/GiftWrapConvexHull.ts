import { Edge } from "../framework/types/Edge";
import { Point } from "../framework/types/Point";
import { Polygon } from "../framework/types/Polygon";
import { Ray } from "../framework/types/Ray";
import { AbstractAlgorithm } from "./AbstractAlgorithm";

/**
 * Implementation of the Gift wrapping Convex Hull algorithm
 * Complexity: O(n^2)
 */
export class GiftWrapConvexHull extends AbstractAlgorithm {
    private currentPoint!: Point;
    private startPoint!: Point;

    private hull: Point[] = [];

    public setup(): boolean {
        // Solve the trivial cases
        if (this.workframe.points.length === 0) {
            return true;
        }

        if (this.workframe.points.length === 1) {
            this.hull.push(this.workframe.points[0]);
            return true;
        }

        // Find the starting point with the highest y value
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
        //Measure the angle from this ray to each point
        const ray = new Ray(
            this.currentPoint,
            this.hull.length > 0
                ? this.currentPoint.subtract(this.hull[this.hull.length - 1])
                : new Point(1, 0)
        );
        // <hide>
        this.workframe.addGeometry(ray);
        // </hide>

        // Find the point with the smallest angle
        let rightMost = this.workframe.points[0];
        for (const point of this.workframe.points) {
            if (point === this.currentPoint) continue;
            if (ray.angleTo(point) > ray.angleTo(rightMost)) {
                rightMost = point;
            }
        }

        // <hide>
        this.workframe.addGeometry(
            new Ray(this.currentPoint, rightMost.subtract(this.currentPoint))
        );
        // </hide>

        // Add the point to the hull
        this.hull.push(this.currentPoint);
        this.currentPoint = rightMost;

        // Check if we are back at the start
        if (this.currentPoint === this.startPoint) {
            this.hull.push(this.currentPoint);
        }

        return this.currentPoint === this.startPoint;
    }

    // <hide>
    public draw(): void {
        this.workframe.addGeometry(...this.workframe.points);
        this.hull.forEach((point, index) => {
            if (index === 0) return;
            const nextPoint = this.hull[index - 1];
            this.workframe.addGeometry(
                new Edge(point, nextPoint, this.workframe.colors.fi)
            );
        });

        this.workframe.addGeometry(
            ...this.hull.map((point) => {
                point = point.copy();
                point.color = this.workframe.colors.fi;
                return point;
            })
        );

        if (
            this.hull.length > 1 &&
            this.hull[0].equals(this.hull[this.hull.length - 1])
        ) {
            this.workframe.addGeometry(
                new Polygon(this.hull, this.workframe.colors.fi)
            );
        }
    }
    // </hide>
}
