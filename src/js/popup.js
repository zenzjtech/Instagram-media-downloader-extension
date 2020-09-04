import "../css/popup.css";
import Popup from "js/popup/index";
import React from "react";
import { render } from "react-dom";
require('chrome-extension-async');

render(
  <Popup/>,
  window.document.getElementById("app-container")
);
