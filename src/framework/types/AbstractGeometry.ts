import P5 from "p5";
import { AppState } from "../AppState";

export abstract class AbstractGeometry {
    public color?: P5.Color;

    public abstract draw(p5: P5, appState: AppState): void;
    public abstract copy(): AbstractGeometry;

    constructor(color?: P5.Color) {
        this.color = color;
    }
}
