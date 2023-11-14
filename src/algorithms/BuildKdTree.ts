import { Edge } from "../framework/types/Edge";
import { Point } from "../framework/types/Point";
import { AbstractAlgorithm } from "./AbstractAlgorithm";

type KdTree = {
    point: Point;
    lesser: KdTree | null;
    greater: KdTree | null;
};

/**
 * Implementation of the algorithm for building a kd-tree
 * Complexity: O(n^2)
 */
export class BuildKdTree extends AbstractAlgorithm {
    private tree!: KdTree | null;

    public setup(): boolean {
        return false;
    }

    private buildKdTree(points: Point[], depth: number): KdTree | null {
        if (points.length === 0) return null;

        if (points.length === 1)
            return {
                point: points[0],
                lesser: null,
                greater: null,
            };

        const isVertical = depth % 2 === 0;
        points.sort((a, b) => {
            if (isVertical) {
                return a.x - b.x;
            } else {
                return a.y - b.y;
            }
        });
        const medianIndex = Math.floor(points.length / 2);
        const median = points[medianIndex];
        const lesser = points.slice(0, medianIndex);
        const greater = points.slice(medianIndex + 1);

        return {
            point: median,
            lesser: this.buildKdTree(lesser, depth + 1),
            greater: this.buildKdTree(greater, depth + 1),
        };
    }

    public step(): boolean {
        // This algorithm is recursive -> solved in the first pass
        this.tree = this.buildKdTree(this.workframe.points, 0);
        console.log(this.tree);
        return true;
    }

    // <hide>
    private drawKdTree(
        tree: KdTree | null,
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        depth: number
    ): void {
        if (!tree) return;

        const isVertical = depth % 2 === 0;
        const isLeaf = tree.lesser === null && tree.greater === null;

        if (isLeaf) return;

        // this.workframe.addGeometry(
        //     new Line(tree.point, isVertical ? new Point(0, 1) : new Point(1, 0))
        // );

        if (isVertical) {
            this.workframe.addGeometry(
                new Edge(
                    new Point(tree.point.x, minY),
                    new Point(tree.point.x, maxY),
                    this.workframe.colors.med
                )
            );

            this.drawKdTree(
                tree.lesser,
                minX,
                tree.point.x,
                minY,
                maxY,
                depth + 1
            );
            this.drawKdTree(
                tree.greater,
                tree.point.x,
                maxX,
                minY,
                maxY,
                depth + 1
            );
        } else {
            this.workframe.addGeometry(
                new Edge(
                    new Point(minX, tree.point.y),
                    new Point(maxX, tree.point.y),
                    this.workframe.colors.phil
                )
            );

            this.drawKdTree(
                tree.lesser,
                minX,
                maxX,
                minY,
                tree.point.y,
                depth + 1
            );
            this.drawKdTree(
                tree.greater,
                minX,
                maxX,
                tree.point.y,
                maxY,
                depth + 1
            );
        }
    }

    public draw(): void {
        this.drawKdTree(this.tree, -1000000, 1000000, -1000000, 1000000, 0);
    }
    // </hide>
}
