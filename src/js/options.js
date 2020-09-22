import React from "react";
import { render } from "react-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Option from "js/option/index";
require('chrome-extension-async');

render(
	<React.Fragment>
		<CssBaseline/>
		<Option/>
	</React.Fragment>,
	window.document.getElementById("app-container")
);
