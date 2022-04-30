import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
//import App from "./App";

// context
import { ContextProvider } from "./context/ContextProvider";
import { GraphicConfigProvider } from "./context/GraphicConfig";
import { AudioConfigProvider } from "./context/AudioConfig";
import { OffCanvasProvider } from "./context/OffCanvas";
import { AudioControllerProvider } from "./context/AudioController";
import { LanguageProvider } from "./context/Language";

// styles
import "./index.css";
import "./components/Kenburns/kenburns.css";

import Test from "./test";

const container = document.getElementById("root");

// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  <StrictMode>
    <LanguageProvider>
      <ContextProvider>
        <GraphicConfigProvider>
          <AudioConfigProvider>
            <OffCanvasProvider>
              <AudioControllerProvider>
                {/*<App />*/}
                <Test />
              </AudioControllerProvider>
            </OffCanvasProvider>
          </AudioConfigProvider>
        </GraphicConfigProvider>
      </ContextProvider>
    </LanguageProvider>
  </StrictMode>
);
