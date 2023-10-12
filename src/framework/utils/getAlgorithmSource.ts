import { AbstractAlgorithm } from "../../algorithms/AbstractAlgorithm";

export function getAlgorithmSource(
    algorithm: typeof AbstractAlgorithm
): string {
    const raw = require(`!!raw-loader!/src/algorithms/${algorithm.name}.ts`)
        .default as string;

    const deWindowsed = raw.replaceAll("\r\n", "\n");

    const filtered = deWindowsed.replaceAll(
        /^\s*?(\/\/\s*<\s*hide\s*>).*?(\/\/\s*<\/\s*hide\s*>)\n/gms,
        ""
    );

    return filtered;
}
