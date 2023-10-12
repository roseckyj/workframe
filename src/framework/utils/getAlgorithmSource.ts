import { algorithms } from "../../algorithms/algorithms";

export function getAlgorithmSource(name: string): string {
    const raw = algorithms[name].source;

    const deWindowsed = raw.replaceAll("\r\n", "\n");

    const filtered = deWindowsed.replaceAll(
        /^\s*?(\/\/\s*<\s*hide\s*>).*?(\/\/\s*<\/\s*hide\s*>)\n/gms,
        ""
    );

    return filtered;
}
