// React functional component, that overlays the whole screen and sets users cursor

import { observer } from "mobx-react";
import { AppState, Tool } from "../AppState";

export interface IInputOverlayProps {
    appState: AppState;
}

export const OVERLAY_ID = "__overlay";

export const InputOverlay = observer(({ appState }: IInputOverlayProps) => {
    return (
        <div
            id={OVERLAY_ID}
            style={{
                cursor: {
                    [Tool.Pan]: "grab",
                    [Tool.Add]: "crosshair",
                    [Tool.Remove]: "not-allowed",
                    [Tool.Move]: "move",
                }[appState.tool],
                position: "fixed",
                inset: 0,
            }}
        ></div>
    );
});
