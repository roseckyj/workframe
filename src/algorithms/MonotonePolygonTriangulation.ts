import { Edge } from "../framework/types/Edge";
import { Line } from "../framework/types/Line";
import { Point } from "../framework/types/Point";
import { AbstractAlgorithm } from "./AbstractAlgorithm";
import { splitPolygon } from "./utils/splitPolygon";

type MarkedPoint = { point: Point; path: "left" | "right" };

/**
 * Implementation of the algorithm to triangulate monotone polygons
 * Complexity: O(n log n)
 */
export class MonotonePolygonTriangulation extends AbstractAlgorithm {
    private sorted: MarkedPoint[] = [];

    private currentPointIndex = 0;
    private stack: MarkedPoint[] = [];

    public edges: Edge[] = [];

    public setup(): boolean {
        // Solve the trivial cases
        if (this.workframe.points.length === 0) {
            return true;
        }

        // Put all the input edges into the edges array
        this.workframe.points.forEach((point, index) => {
            this.edges.push(
                new Edge(
                    point,
                    this.workframe.points[
                        (index + 1) % this.workframe.points.length
                    ],
                    this.workframe.colors.fi
                )
            );
        });

        // Mark the points as left or right path (since we do not have the doubly connected edge list)
        const sortedByX = [...this.workframe.points].sort((a, b) => a.y - b.y);
        const top = sortedByX[0];
        const bottom = sortedByX[sortedByX.length - 1];
        let [right, left] = splitPolygon(this.workframe.points, top, bottom);
        const markedPoints: MarkedPoint[] = [
            ...left.map((point) => ({ point, path: "left" } as MarkedPoint)),
            ...right.map((point) => ({ point, path: "right" } as MarkedPoint)),
        ];

        // Sort the points by y || x value
        this.sorted = markedPoints.sort(
            (a, b) => a.point.y - b.point.y || a.point.x - b.point.x
        );

        // Push the first two points to the stack
        this.stack.push(this.sorted[0]);
        this.stack.push(this.sorted[1]);
        this.currentPointIndex = 2;

        return false;
    }

    public step(): boolean {
        const currentPoint = this.sorted[this.currentPointIndex];

        if (currentPoint.path === this.stack[this.stack.length - 1].path) {
            // The point and the top of the stack are on the same path
            // Pop the other vertices from stack as long as the diagonals from current to them are inside the polygon
            let lastPopped = this.stack.pop();
            while (
                this.edgeFunction(
                    currentPoint.point,
                    this.stack[this.stack.length - 1].point,
                    lastPopped!.point
                ) *
                    (currentPoint.path === "left" ? -1 : 1) >
                    0 &&
                this.stack.length > 1
            ) {
                this.edges.push(
                    new Edge(
                        currentPoint.point,
                        this.stack[this.stack.length - 1].point,
                        this.workframe.colors.fi
                    )
                );
                lastPopped = this.stack.pop()!;
            }
            // Push the last popped element back to the stack with the current point
            this.stack.push(lastPopped!);
            this.stack.push(currentPoint);
        } else {
            // The point and the top of the stack are on different paths
            // Insert diagonals from all the stacked vertices except for the bottom one
            for (let i = this.stack.length - 1; i > 0; i--) {
                this.edges.push(
                    new Edge(
                        currentPoint.point,
                        this.stack[i].point,
                        this.workframe.colors.fi
                    )
                );
            }
            // Remove all the stacked vertices except for the top and the current one
            this.stack = [this.stack[this.stack.length - 1], currentPoint];
        }

        // <hide>
        // Draw the sweep line
        this.workframe.addGeometry(
            new Line(currentPoint.point, new Point(1, 0))
        );
        // </hide>

        this.currentPointIndex++;
        return this.finished;
    }

    // <hide>
    public draw(): void {
        // Draw all the edges
        this.workframe.addGeometry(...this.edges);

        // Draw the processed vertices
        this.sorted
            .filter((_, i) => i < this.currentPointIndex)
            .forEach((point) => {
                this.workframe.addGeometry(
                    point.point.copy(this.workframe.colors.fi)
                );
            });

        // Draw the stack vertices
        this.stack.forEach((point) => {
            this.workframe.addGeometry(
                point.point.copy(this.workframe.colors.phil)
            );
        });
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
