import { Point } from "../types/Point";

export function randomPoints(amount: number, maxDistance: number): Point[] {
    const points = [];

    for (let i = 0; i < amount; i++) {
        points.push(
            new Point(
                Math.random() * maxDistance * 2 - maxDistance,
                Math.random() * maxDistance * 2 - maxDistance
            )
        );
    }

    return points;
}
