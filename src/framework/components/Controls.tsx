import { IconButton, Spacer, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import {
    BiDice5,
    BiHome,
    BiMinus,
    BiMove,
    BiPlus,
    BiShapePolygon,
    BiSolidHand,
    BiSolidMap,
    BiTrash,
    BiX,
} from "react-icons/bi";
import { GiftWrapConvexHull } from "../../algorithms/GiftWrapConvexHull";
import { AppState, Tool } from "../AppState";
import { Workframe } from "../Workframe";
import { randomPoints } from "../utils/randomPoints";

interface IControlsProps {
    workframe: Workframe;
    appState: AppState;
}

export const Controls = observer(function Controls({
    workframe,
    appState,
}: IControlsProps) {
    return (
        <div style={{ position: "fixed", top: 20, left: 20, zIndex: 100 }}>
            <VStack spacing={2} align="stretch">
                <IconButton
                    aria-label="Home"
                    icon={<BiHome />}
                    onClick={() => {
                        appState.reset();
                    }}
                />
                <IconButton
                    aria-label="Zoom in"
                    icon={<BiPlus />}
                    onClick={() => {
                        appState.zoom(0.1 * appState.scale);
                    }}
                />
                <IconButton
                    aria-label="Zoom out"
                    icon={<BiMinus />}
                    onClick={() => {
                        appState.zoom(-0.1 * appState.scale);
                    }}
                />
                <Spacer mt={6} />
                <IconButton
                    aria-label="Pan"
                    icon={<BiSolidHand />}
                    colorScheme={appState.tool === Tool.Pan ? "blue" : "gray"}
                    onClick={() => {
                        appState.setTool(Tool.Pan);
                    }}
                />
                <IconButton
                    aria-label="Add a point"
                    icon={<BiSolidMap />}
                    colorScheme={appState.tool === Tool.Add ? "blue" : "gray"}
                    onClick={() => {
                        appState.setTool(Tool.Add);
                    }}
                />
                <IconButton
                    aria-label="Remove points"
                    icon={<BiX />}
                    colorScheme={
                        appState.tool === Tool.Remove ? "blue" : "gray"
                    }
                    onClick={() => {
                        appState.setTool(Tool.Remove);
                    }}
                />
                <IconButton
                    aria-label="Move points"
                    icon={<BiMove />}
                    colorScheme={appState.tool === Tool.Move ? "blue" : "gray"}
                    onClick={() => {
                        appState.setTool(Tool.Move);
                    }}
                />
                <Spacer mt={6} />
                <IconButton
                    aria-label="Random points"
                    icon={<BiDice5 />}
                    onClick={() => {
                        workframe.points.push(...randomPoints(10, 500));
                        workframe.resetAlgorithm();
                    }}
                />
                <IconButton
                    aria-label="Random polygon"
                    icon={<BiShapePolygon />}
                    onClick={() => {
                        workframe.points = randomPoints(30, 500);
                        const algorithm = workframe.appState.selectedAlgorithm;
                        workframe.setAlgorithm("Convex Hull (Gift wrapping)");
                        workframe.run();
                        const hull = (workframe.algorithm as GiftWrapConvexHull)
                            .hull;
                        workframe.points = hull.slice(0, hull.length - 2);
                        workframe.setAlgorithm(algorithm!);
                    }}
                />
                <Spacer mt={6} />
                <IconButton
                    aria-label="Clear screen"
                    icon={<BiTrash />}
                    onClick={() => {
                        workframe.points = [];
                        workframe.resetAlgorithm();
                    }}
                />
            </VStack>
        </div>
    );
});
