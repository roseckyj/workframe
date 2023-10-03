import { Workframe } from "../framework/Workframe";

export abstract class AbstractAlgorithm {
    protected workframe: Workframe;

    constructor(workframe: Workframe) {
        this.workframe = workframe;
    }

    /**
     * Runs a single step of the algorithm.
     *
     * @returns Whether the algorithm is finished.
     */
    public abstract step(): boolean;

    /**
     * Sets up the algorithm.
     */
    public abstract setup(): boolean;

    /**
     * Draws a single frame of the algorithm.
     */
    public abstract draw(): void;
}
