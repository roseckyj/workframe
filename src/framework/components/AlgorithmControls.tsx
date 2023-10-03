import { observer } from "mobx-react";
import { AppState } from "../AppState";
import { Workframe } from "../Workframe";
import {
    VStack,
    IconButton,
    Select,
    HStack,
    Spacer,
    Text,
} from "@chakra-ui/react";
import { BiPlay, BiRepeat, BiSkipNext, BiFastForward } from "react-icons/bi";
import { algorithms } from "../../algorithms/algorithms";

interface IAlgorithmControlsProps {
    workframe: Workframe;
    appState: AppState;
}

export const AlgorithmControls = observer(function AlgorithmControls({
    workframe,
    appState,
}: IAlgorithmControlsProps) {
    return (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
            <VStack spacing={2} align="stretch">
                <Select
                    bg="gray.100"
                    value={appState.selectedAlgorithm || undefined}
                    onChange={(event) => {
                        appState.setSelectedAlgorithm(event.target.value);
                        workframe.resetAlgorithm();
                    }}
                >
                    {Object.entries(algorithms).map(([name]) => (
                        <option value={name}>{name}</option>
                    ))}
                </Select>
                <HStack spacing={2} align="start">
                    <IconButton
                        aria-label="Run one step of the algorithm"
                        icon={<BiSkipNext />}
                        isDisabled={
                            !appState.selectedAlgorithm ||
                            appState.autorun ||
                            appState.algorithmFinished
                        }
                        onClick={() => {
                            workframe.step();
                        }}
                    />
                    <IconButton
                        aria-label="Run the algorithm"
                        icon={<BiPlay />}
                        isDisabled={
                            !appState.selectedAlgorithm || appState.autorun
                        }
                        onClick={() => {
                            workframe.run();
                        }}
                    />
                    <IconButton
                        aria-label="Autorun the algorithm"
                        icon={<BiFastForward />}
                        isDisabled={!appState.selectedAlgorithm}
                        colorScheme={appState.autorun ? "blue" : "gray"}
                        onClick={() => {
                            appState.setAutorun(!appState.autorun);
                        }}
                    />
                    <Spacer mr={3} />
                    <IconButton
                        aria-label="Reset the algorithm"
                        icon={<BiRepeat />}
                        isDisabled={
                            !appState.selectedAlgorithm || appState.autorun
                        }
                        onClick={() => {
                            workframe.resetAlgorithm();
                        }}
                    />
                </HStack>
                <Text color="gray.100" textAlign="right">
                    Step {appState.algorithmStep}{" "}
                    {appState.algorithmFinished && "(finished)"}
                </Text>
            </VStack>
        </div>
    );
});
