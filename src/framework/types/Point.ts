import * as P5 from "p5";
import { AbstractGeometry } from "./AbstractGeometry";
import { AppState } from "../AppState";
import { transformToScreen } from "../utils/transformToScreen";

export class Point extends AbstractGeometry {
    public x: number;
    public y: number;

    constructor(x: number, y: number, color: number = 150) {
        super(color);

        this.x = x;
        this.y = y;
    }

    public add(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y);
    }

    public subtract(point: Point): Point {
        return new Point(this.x - point.x, this.y - point.y);
    }

    public multiply(scale: number): Point {
        return new Point(this.x * scale, this.y * scale);
    }

    public divide(scale: number): Point {
        return new Point(this.x / scale, this.y / scale);
    }

    public normalize(): Point {
        return this.divide(this.length);
    }

    public get length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public angleBetween(point: Point): number {
        return Math.atan2(point.y, point.x) - Math.atan2(this.y, this.x);
    }

    public distance(point: Point): number {
        return Math.sqrt(
            Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)
        );
    }

    public equals(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }

    public copy(): Point {
        return new Point(this.x, this.y);
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    public toP5Vector(): P5.Vector {
        return new P5.Vector(this.x, this.y);
    }

    public static fromP5Vector(vector: P5.Vector): Point {
        return new Point(vector.x, vector.y);
    }

    public draw(p5: P5, appState: AppState) {
        const transformed = transformToScreen(
            appState.transform(this.toP5Vector()),
            p5
        );

        p5.noStroke();
        p5.fill(this.color);
        p5.circle(transformed.x, transformed.y, 10);
    }
}
