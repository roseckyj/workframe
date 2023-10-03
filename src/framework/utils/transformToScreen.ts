import P5 from "p5";

export function transformToScreen(vector: P5.Vector, p5: P5): P5.Vector {
    return vector.copy().add(p5.width / 2, p5.height / 2);
}

export function transformFromScreen(vector: P5.Vector, p5: P5): P5.Vector {
    return vector.copy().sub(p5.width / 2, p5.height / 2);
}
