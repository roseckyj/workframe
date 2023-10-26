import { Point } from "../../framework/types/Point";

export function splitPolygon(points: Point[], point1: Point, point2: Point) {
    const index1 = points.indexOf(point1);
    const index2 = points.indexOf(point2);

    const indexMin = Math.min(index1, index2);
    const indexMax = Math.max(index1, index2);

    const first = points.slice(indexMin, indexMax);
    const second = [...points.slice(indexMax), ...points.slice(0, indexMin)];

    return [first, second];
}
