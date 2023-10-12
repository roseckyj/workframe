import { Color } from "p5";
import { Edge } from "../types/Edge";
import { Point } from "../types/Point";
import { Polygon } from "../types/Polygon";

export function drawPolyline(
    overlap: boolean,
    color: Color,
    ...points: Point[][]
) {
    return points
        .map((p) => (overlap ? p.slice(1) : p))
        .flat()
        .map((point, index, all) => {
            if (index === 0) return null;
            const nextPoint = all[index - 1];
            return new Edge(point, nextPoint, color);
        })
        .filter((edge) => edge !== null) as Edge[];
}

export function drawPolygon(
    overlap: boolean,
    color: Color,
    ...points: Point[][]
) {
    return new Polygon(
        points.map((p) => (overlap ? p.slice(1) : p)).flat(),
        color
    );
}
