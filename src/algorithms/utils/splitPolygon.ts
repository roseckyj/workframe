import { Point } from "../../framework/types/Point";

export function splitPolygon(points: Point[], point1: Point, point2: Point) {
    const index1 = points.indexOf(point1);
    const index2 = points.indexOf(point2);

    let from1to2: Point[];
    let from2to1: Point[];

    if (index1 < index2) {
        from1to2 = points.slice(index1, index2 + 1);
        from2to1 = points.slice(index2).concat(points.slice(0, index1 + 1));
    } else {
        from1to2 = points.slice(index1).concat(points.slice(0, index2 + 1));
        from2to1 = points.slice(index2, index1 + 1);
    }

    return [from1to2, from2to1];
}
