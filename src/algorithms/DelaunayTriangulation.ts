import { Edge } from "../framework/types/Edge";
import { Point } from "../framework/types/Point";
import { AbstractAlgorithm } from "./AbstractAlgorithm";

/**
 * Implementation of the Delaunay triangulation algorithm using the incremental approach
 * Complexity: O(n^2)
 */
export class DelaunayTriangulation extends AbstractAlgorithm {
    public AEL: Edge[] = [];
    public DT: Edge[] = [];

    public setup(): boolean {
        // Solve the trivial cases
        if (this.workframe.points.length < 3) {
            return true;
        }

        // p1 = random point from P, p2 = the closest point to p1
        let p1 = this.workframe.points[0];
        let p2 = this.findClosestPoint(p1);

        // create edge e = p1p2
        let e = new Edge(p1, p2);

        // p = dD(e), point with the smallest Delaunay distance left of e
        let p = this.closestDelaunayPoint(e);

        // if p = NULL, swap orientation e = p1p2 to e = p2p1 and repeat step 3
        if (p === null) {
            const tmp = p1;
            p1 = p2;
            p2 = tmp;
            e = new Edge(p1, p2);
            p = this.closestDelaunayPoint(e);
        }

        // e2 = p2p, e3 = pp1
        const e2 = new Edge(p2, p!);
        const e3 = new Edge(p!, p1);

        // add e, e2, e3 to AEL
        this.AEL.push(e, e2, e3);

        return false;
    }

    public step(): boolean {
        // while AEL is not empty
        if (this.AEL.length === 0) {
            return true;
        }

        // e = p1p2 first edge from AEL
        let e = this.AEL.shift()!;

        // swap orientation e = p1p2 to e = p2p1
        e = e.reverse();

        // p = dD(e), point with the smallest Delaunay distance left of e
        let p = this.closestDelaunayPoint(e);

        // if p != NULL
        if (p !== null) {
            // e2 = p2p, e3 = pp1
            const e2 = new Edge(e.end, p);
            const e3 = new Edge(p, e.start);

            // add e2, e3 to AEL (if not already in AEL - self or flipped)
            this.insertToAEL(e2);
            this.insertToAEL(e3);
        }

        // add e to DT
        this.DT.push(e);

        // remove e from AEL
        this.AEL = this.AEL.filter(
            (edge) => !edge.equals(e) && !edge.equals(e.reverse())
        );

        return false;
    }

    private insertToAEL(insert: Edge): void {
        if (
            this.AEL.find(
                (edge) => edge.equals(insert) || edge.equals(insert.reverse())
            )
        ) {
            return;
        }

        if (
            this.DT.find(
                (edge) => edge.equals(insert) || edge.equals(insert.reverse())
            )
        ) {
            return;
        }

        this.AEL.push(insert);
    }

    private findClosestPoint(p: Point): Point {
        let closest = this.workframe.points[0];
        if (closest.equals(p)) {
            closest = this.workframe.points[1];
        }

        for (const point of this.workframe.points) {
            if (point.equals(p)) continue;
            if (point.distance(p) < closest.distance(p)) {
                closest = point;
            }
        }
        return closest;
    }

    private closestDelaunayPoint(e: Edge): Point | null {
        // point with the smallest Delaunay distance left of e
        let closest: Point | null = null;
        let closestDistance = Infinity;
        for (const point of this.workframe.points) {
            if (point.equals(e.start) || point.equals(e.end)) continue;
            const distance = this.delaunayDistance(e.start, e.end, point);
            const isLeft =
                DelaunayTriangulation.edgeFunction(e.start, e.end, point) < 0;
            if (isLeft && distance < closestDistance) {
                closest = point;
                closestDistance = distance;
            }
        }
        return closest;
    }

    private delaunayDistance(a: Point, b: Point, c: Point): number {
        const { center, radius } = DelaunayTriangulation.circumCircle(a, b, c);

        // If the center is on the left side of the edge return radius
        // Otherwise return -radius
        if (DelaunayTriangulation.edgeFunction(a, b, center) < 0) {
            return radius;
        } else {
            return -radius;
        }
    }

    private static crossProduct(a: Point, b: Point): number {
        return a.x * b.y - a.y * b.x;
    }

    private static crossProduct3(a: Point, b: Point, c: Point): number {
        return this.crossProduct(b.subtract(a), c.subtract(a));
    }

    public static circumCircle(a: Point, b: Point, c: Point) {
        const cp = this.crossProduct3(a, b, c);

        if (cp === 0) {
            console.log(a, b, c);
            throw new Error("Points are colinear");
        }

        const aSq = a.length ** 2;
        const bSq = b.length ** 2;
        const cSq = c.length ** 2;
        const numX = aSq * (b.y - c.y) + bSq * (c.y - a.y) + cSq * (a.y - b.y);
        const cx = numX / (2 * cp);
        const numY = aSq * (c.x - b.x) + bSq * (a.x - c.x) + cSq * (b.x - a.x);
        const cy = numY / (2 * cp);

        return {
            center: new Point(cx, cy),
            radius: a.distance(new Point(cx, cy)),
        };
    }

    public static edgeFunction(a: Point, b: Point, c: Point): number {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }

    // <hide>
    public draw(): void {
        // Draw the edges in white
        this.DT.forEach((edge) => {
            this.workframe.addGeometry(edge.copy(this.workframe.colors.light));
        });

        // Draw the AEL edges in red
        this.AEL.forEach((edge) => {
            this.workframe.addGeometry(edge.copy(this.workframe.colors.fi));
        });

        return;
    }
    // </hide>
}
