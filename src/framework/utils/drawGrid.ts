import P5 from "p5";
import { AppState } from "../AppState";
import { transformToScreen } from "./transformToScreen";
import { Workframe } from "../Workframe";

export function drawGrid(
    p5: P5,
    workframe: Workframe,
    appState: AppState
): void {
    const center = transformToScreen(
        appState.transform(new P5.Vector(0, 0)),
        p5
    );

    p5.strokeWeight(1);

    const drawVerticalLine = (x: number) => {
        const position = new P5.Vector(x, 0);
        p5.line(position.x, 0, position.x, p5.height);
    };
    const drawHorizontalLine = (y: number) => {
        const position = new P5.Vector(0, y);
        p5.line(0, position.y, p5.width, position.y);
    };
    const drawGridEvery = (every: number) => {
        for (let x = center.x; x < p5.width; x += every * appState.scale) {
            drawVerticalLine(x);
        }
        for (let x = center.x; x > 0; x -= every * appState.scale) {
            drawVerticalLine(x);
        }

        for (let y = center.y; y < p5.height; y += every * appState.scale) {
            drawHorizontalLine(y);
        }
        for (let y = center.y; y > 0; y -= every * appState.scale) {
            drawHorizontalLine(y);
        }
    };

    if (appState.scale > 0.5) {
        p5.stroke(30);
        drawGridEvery(workframe.config.grid.secondary);
    }

    p5.stroke(50);
    drawGridEvery(workframe.config.grid.primary);

    p5.stroke(80);
    p5.line(center.x, 0, center.x, p5.height);
    p5.line(0, center.y, p5.width, center.y);
}
