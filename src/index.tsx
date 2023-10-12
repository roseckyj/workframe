import React from "react";
import ReactDOM from "react-dom/client";
import App from "./framework/App";
import { Workframe, WorkframeConfig } from "./framework/Workframe";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { algorithms } from "./algorithms/algorithms";

const config: WorkframeConfig = {
    grid: {
        primary: 100,
        secondary: 20,
    },
};
const workframe = new Workframe(config);

const appState = workframe.appState;
appState.setSelectedAlgorithm(Object.keys(algorithms)[0]);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <ChakraProvider theme={theme}>
        <App workframe={workframe} appState={appState} />
    </ChakraProvider>
);
