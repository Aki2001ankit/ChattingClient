import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import Chatprovider from "./context/chatprovider";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Chatprovider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Chatprovider>
  </BrowserRouter>
);
