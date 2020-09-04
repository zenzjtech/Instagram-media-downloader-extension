import "../css/popup.css";
import Greeting from "js/popup/index";
import React from "react";
import { render } from "react-dom";

render(
  <Greeting/>,
  window.document.getElementById("app-container")
);
