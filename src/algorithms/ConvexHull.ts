import { Point } from "../framework/types/Point";
import { randomPoints } from "../framework/utils/randomPoints";
import { AbstractAlgorithm } from "./AbstractAlgorithm";

export class ConvexHull extends AbstractAlgorithm {
    public setup(): void {}

    public step(): boolean {
        return true;
    }

    public draw(): void {
        console.log("Draw");

        this.workframe.addGeometry(...this.workframe.points);
    }
}
