import React from "react";
import { render } from "react-dom";
import Option from "js/option/index";
import { CssBaseline } from '@material-ui/core';
require('chrome-extension-async');

render(
	<React.Fragment>
		<CssBaseline/>
		<Option/>
	</React.Fragment>,
	window.document.getElementById("app-container")
);
