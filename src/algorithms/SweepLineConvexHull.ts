import { Line } from "../framework/types/Line";
import { Point } from "../framework/types/Point";
import { drawPolygon, drawPolyline } from "../framework/utils/drawPolyline";
import { AbstractAlgorithm } from "./AbstractAlgorithm";

/**
 * Implementation of the Sweep line Convex Hull algorithm
 * Complexity: O(n log n)
 */
export class SweepLineConvexHull extends AbstractAlgorithm {
    private upperHull: Point[] = [];
    private lowerHull: Point[] = [];

    private sorted: Point[] = [];
    private currentPointIndex = 0;

    public setup(): boolean {
        // Solve the trivial cases
        if (this.workframe.points.length === 0) {
            return true;
        }

        if (this.workframe.points.length === 1) {
            this.upperHull.push(this.workframe.points[0]);
            this.lowerHull.push(this.workframe.points[0]);
            return true;
        }

        // Sort the points by x value
        this.sorted = [...this.workframe.points].sort((a, b) => a.x - b.x);

        return false;
    }

    public step(): boolean {
        const currentPoint = this.sorted[this.currentPointIndex];

        // Add the point to both parts of the hull
        this.upperHull.push(currentPoint);
        this.lowerHull.push(currentPoint);

        // Fix the upper hull if not convex
        const removedPointsUpper: Point[] = []; // For drawing only
        while (
            this.upperHull.length > 2 &&
            this.edgeFunction(
                this.upperHull[this.upperHull.length - 3],
                this.upperHull[this.upperHull.length - 2],
                this.upperHull[this.upperHull.length - 1]
            ) < 0
        ) {
            removedPointsUpper.push(
                ...this.upperHull.splice(this.upperHull.length - 2, 1)
            );
        }

        // Fix the lower hull if not convex
        const removedPointsLower: Point[] = []; // For drawing only
        while (
            this.lowerHull.length > 2 &&
            this.edgeFunction(
                this.lowerHull[this.lowerHull.length - 3],
                this.lowerHull[this.lowerHull.length - 2],
                this.lowerHull[this.lowerHull.length - 1]
            ) > 0
        ) {
            removedPointsLower.push(
                ...this.lowerHull.splice(this.lowerHull.length - 2, 1)
            );
        }

        // <hide>
        // Draw the sweep line
        this.workframe.addGeometry(new Line(currentPoint, new Point(0, 1)));

        // Draw the removed points
        const upperColor = this.workframe.colors.phil;
        upperColor.setAlpha(100);
        if (removedPointsUpper.length > 0) {
            this.workframe.addGeometry(
                ...drawPolyline(
                    false,
                    upperColor,
                    [currentPoint],
                    removedPointsUpper,
                    [this.upperHull[this.upperHull.length - 2]]
                )
            );
        }
        const lowerColor = this.workframe.colors.sci;
        lowerColor.setAlpha(100);
        if (removedPointsLower.length > 0) {
            this.workframe.addGeometry(
                ...drawPolyline(
                    false,
                    lowerColor,
                    [currentPoint],
                    removedPointsLower,
                    [this.lowerHull[this.lowerHull.length - 2]]
                )
            );
        }
        // </hide>

        this.currentPointIndex++;
        return this.finished;
    }

    // <hide>
    public draw(): void {
        // Draw lines
        this.workframe.addGeometry(
            ...drawPolyline(false, this.workframe.colors.phil, this.upperHull)
        );
        this.workframe.addGeometry(
            ...drawPolyline(false, this.workframe.colors.sci, this.lowerHull)
        );

        // Draw points
        this.workframe.addGeometry(
            ...this.upperHull.map((point) =>
                point.copy(
                    this.lowerHull.includes(point)
                        ? this.workframe.colors.light
                        : this.workframe.colors.phil
                )
            )
        );
        this.workframe.addGeometry(
            ...this.lowerHull.map((point) =>
                point.copy(
                    this.upperHull.includes(point)
                        ? this.workframe.colors.light
                        : this.workframe.colors.sci
                )
            )
        );

        // Fill the polygon
        if (this.finished) {
            this.workframe.addGeometry(
                drawPolygon(
                    true,
                    this.workframe.colors.fi,
                    this.upperHull,
                    [...this.lowerHull].reverse()
                )
            );
        }
    }
    // </hide>

    // Utility functions
    private edgeFunction(a: Point, b: Point, c: Point): number {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }

    private get finished() {
        return this.currentPointIndex >= this.sorted.length;
    }
}
