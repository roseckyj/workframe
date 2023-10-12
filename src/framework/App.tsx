import "./styles/index.css";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { Workframe } from "./Workframe";
import P5 from "p5";
import { AppState, Tool } from "./AppState";
import { drawGrid } from "./utils/drawGrid";
import { Point } from "./types/Point";
import { transformFromScreen } from "./utils/transformToScreen";
import { observer } from "mobx-react";
import { Controls } from "./components/Controls";
import { InputOverlay, OVERLAY_ID } from "./components/InputOverlay";
import { AlgorithmControls } from "./components/AlgorithmControls";
import SyntaxHighlighter from "react-syntax-highlighter";
import { stackoverflowDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Box, IconButton } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { algorithms } from "../algorithms/algorithms";
import { getAlgorithmSource } from "./utils/getAlgorithmSource";

export interface IAppProps {
    workframe: Workframe;
    appState: AppState;
}

function App({ workframe, appState }: IAppProps) {
    function sketch(p5: P5) {
        p5.setup = () => {
            p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.P2D);
            appState.p5 = p5;

            workframe.resetAlgorithm();
        };

        p5.draw = () => {
            p5.background(20);

            drawGrid(p5, workframe, appState);

            workframe.draw(p5);
        };

        p5.windowResized = () => {
            p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        };

        p5.mousePressed = (event: MouseEvent) => {
            if (
                !event.target ||
                (event.target as HTMLDivElement).id !== OVERLAY_ID
            )
                return;

            if (appState.tool === Tool.Move) {
                const dragged = Point.fromP5Vector(
                    appState.reverseTransform(
                        transformFromScreen(
                            new P5.Vector(event.clientX, event.clientY),
                            p5
                        )
                    )
                );

                const filtered = workframe.points
                    .map((point, id) => ({ point, id }))
                    .filter((point) => point.point.distance(dragged) < 10);

                appState.setDraggingPoint(
                    filtered.length > 0 ? filtered[0].id : null
                );
            }
        };

        p5.mouseReleased = () => {
            appState.setDraggingPoint(null);
        };

        p5.mouseDragged = (event: MouseEvent) => {
            if (
                !event.target ||
                (event.target as HTMLDivElement).id !== OVERLAY_ID
            )
                return;

            if (event.buttons === 4 || appState.tool === Tool.Pan) {
                appState.drag(
                    new P5.Vector(-event.movementX, -event.movementY)
                );
            }
            if (appState.tool === Tool.Move) {
                const dragged = Point.fromP5Vector(
                    appState.reverseTransform(
                        transformFromScreen(
                            new P5.Vector(event.clientX, event.clientY),
                            p5
                        )
                    )
                );

                workframe.points = workframe.points.map((point, id) => {
                    if (id === appState.draggingPoint) {
                        return dragged;
                    } else {
                        return point;
                    }
                });
                workframe.resetAlgorithm();
            }
        };

        p5.mouseClicked = (event: MouseEvent) => {
            if (
                !event.target ||
                (event.target as HTMLDivElement).id !== OVERLAY_ID
            )
                return;

            if (event.button === 0) {
                const clicked = Point.fromP5Vector(
                    appState.reverseTransform(
                        transformFromScreen(
                            new P5.Vector(event.clientX, event.clientY),
                            p5
                        )
                    )
                );

                if (appState.tool === Tool.Add) {
                    workframe.points.push(clicked);
                    workframe.resetAlgorithm();
                } else if (appState.tool === Tool.Remove) {
                    workframe.points = workframe.points.filter(
                        (point) => point.distance(clicked) > 10
                    );
                    workframe.resetAlgorithm();
                }
            }
        };

        p5.mouseWheel = (event: WheelEvent) => {
            appState.zoom(-event.deltaY * appState.scale * 0.001);
        };
    }

    if (appState.showCode && appState.selectedAlgorithm) {
        return (
            <Box bg="#141414" position="fixed" inset="0" overflowY="auto">
                <SyntaxHighlighter
                    language="typescript"
                    style={stackoverflowDark}
                >
                    {getAlgorithmSource(appState.selectedAlgorithm)}
                </SyntaxHighlighter>
                <IconButton
                    position="fixed"
                    top="20px"
                    right="20px"
                    aria-label="Close code view"
                    icon={<BiX />}
                    onClick={() => appState.toggleCode()}
                />
            </Box>
        );
    } else {
        return (
            <>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: -1,
                    }}
                >
                    <ReactP5Wrapper sketch={sketch} />
                </div>
                <InputOverlay appState={appState} />
                <Controls workframe={workframe} appState={appState} />
                <AlgorithmControls workframe={workframe} appState={appState} />
            </>
        );
    }
}

export default observer(App);
