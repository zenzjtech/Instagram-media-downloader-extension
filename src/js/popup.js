import "../css/popup.css";
import Popup from "js/popup/index";
import React from "react";
import { render } from "react-dom";
import { CssBaseline } from '@material-ui/core';
require('chrome-extension-async');

render(
	<React.Fragment>
		<CssBaseline/>
		<Popup/>
	</React.Fragment>,
  window.document.getElementById("app-container")
);
