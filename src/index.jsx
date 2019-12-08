import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./App";

const domElement = document.getElementById('root');
const ReactElement = () => <App/>

if (domElement.hasChildNodes()) {
    ReactDOM.hydrate(<ReactElement/>, domElement);
} else {
    ReactDOM.render(<ReactElement/>, domElement);
}
