import { Edge } from "../framework/types/Edge";
import { Point } from "../framework/types/Point";
import { Ray } from "../framework/types/Ray";
import { AbstractAlgorithm } from "./AbstractAlgorithm";
import { DelaunayTriangulation } from "./DelaunayTriangulation";

/**
 * Implementation of the Voronoi diagram using the delaunay triangulation
 * Complexity: O(n^2)
 */
export class VoronoiFromDelaunay extends AbstractAlgorithm {
    public DT: Edge[] = [];
    public VD: (Edge | Ray)[] = [];

    private remainingOrientedEdges: Edge[] = [];
    private edgeCenterMap: Map<String, Point> = new Map();
    private edgeCases: Edge[] = [];

    public setup(): boolean {
        // Solve the trivial cases
        if (this.workframe.points.length < 3) {
            return true;
        }

        const delaunay = new DelaunayTriangulation(this.workframe);
        delaunay.setup();
        while (!delaunay.step());

        this.DT = delaunay.DT;

        // Create the remqining oriented edges
        this.DT.forEach((edge) => {
            this.remainingOrientedEdges.push(edge.reverse());
            this.remainingOrientedEdges.push(edge);
        });
        return false;
    }

    public step(): boolean {
        if (this.remainingOrientedEdges.length === 0) {
            // Solve the edge cases
            this.edgeCases.forEach((edge) => {
                const center = this.edgeCenterMap.get(edge.reverse().valueof());

                const tangent = edge.start.subtract(edge.end).normalize();
                const normal = new Point(-tangent.y, tangent.x);

                this.VD.push(new Ray(center!, normal));
            });
            return true;
        }

        const evaluatedEdge = this.remainingOrientedEdges.shift()!;

        const triangle = this.findTriangle(evaluatedEdge);
        if (triangle === null) {
            // <hide>
            this.workframe.addGeometry(
                evaluatedEdge.copy(this.workframe.colors.med)
            );
            // </hide>
            this.edgeCases.push(evaluatedEdge);
            return false;
        }

        const [e1, e2, e3] = triangle;
        // <hide>
        this.workframe.addGeometry(
            e1.copy(this.workframe.colors.sci),
            e2.copy(this.workframe.colors.sci),
            e3.copy(this.workframe.colors.sci)
        );
        // </hide>

        const { center } = DelaunayTriangulation.circumCircle(
            e1.start,
            e1.end,
            e2.end
        );
        this.edgeCenterMap.set(e1.valueof(), center);
        this.edgeCenterMap.set(e2.valueof(), center);
        this.edgeCenterMap.set(e3.valueof(), center);
        // <hide>
        this.workframe.addGeometry(center.copy(this.workframe.colors.med));
        // </hide>

        // Pop edges from the remaining edges
        this.remainingOrientedEdges = this.remainingOrientedEdges.filter(
            (e) => !(e.equals(e1) || e.equals(e2) || e.equals(e3))
        );

        // Add the voronoi edges
        // Check if the inverse edge is already in the VD
        const e1Inverse = e1.reverse().valueof();
        const e2Inverse = e2.reverse().valueof();
        const e3Inverse = e3.reverse().valueof();

        if (this.edgeCenterMap.has(e1Inverse)) {
            this.VD.push(new Edge(center, this.edgeCenterMap.get(e1Inverse)!));
        }
        if (this.edgeCenterMap.has(e2Inverse)) {
            this.VD.push(new Edge(center, this.edgeCenterMap.get(e2Inverse)!));
        }
        if (this.edgeCenterMap.has(e3Inverse)) {
            this.VD.push(new Edge(center, this.edgeCenterMap.get(e3Inverse)!));
        }

        return false;
    }

    private findTriangle(edge: Edge) {
        const from = edge.end;
        const to = edge.start;

        const edgesFrom = this.remainingOrientedEdges.filter((e) =>
            e.start.equals(from)
        );
        const edgesTo = this.remainingOrientedEdges.filter((e) =>
            e.end.equals(to)
        );

        const edgeFrom = edgesFrom.find(
            (e) =>
                edgesTo.some((e2) => e2.start.equals(e.end)) &&
                DelaunayTriangulation.edgeFunction(e.start, e.end, edge.start) <
                    0
        );

        if (edgeFrom === undefined) {
            return null;
        }

        const edgeTo = edgesTo.find(
            (e) =>
                edgesFrom.some((e2) => e2.end.equals(e.start)) &&
                DelaunayTriangulation.edgeFunction(e.start, e.end, edge.end) < 0
        )!;

        return [edge, edgeFrom, edgeTo];
    }

    // <hide>
    public draw(): void {
        // Draw the delaunay in blue
        if (this.remainingOrientedEdges.length === 0) {
            this.DT.forEach((edge) => {
                this.workframe.addGeometry(
                    edge.copy(this.workframe.colors.phil)
                );
            });
            this.workframe.points.forEach((point) => {
                this.workframe.addGeometry(
                    point.copy(this.workframe.colors.phil)
                );
            });
        } else {
            this.remainingOrientedEdges.forEach((edge) => {
                this.workframe.addGeometry(
                    edge.copy(this.workframe.colors.phil)
                );
            });
            this.workframe.points.forEach((point) => {
                this.workframe.addGeometry(
                    point.copy(this.workframe.colors.phil)
                );
            });
        }

        // Draw the voronoi in red
        this.VD.forEach((edge) => {
            this.workframe.addGeometry(edge.copy(this.workframe.colors.fi));
            this.workframe.addGeometry(
                edge.start.copy(this.workframe.colors.fi)
            );
        });

        return;
    }
    // </hide>
}
