import React, {useEffect, useState} from "react"
import Switch from '@material-ui/core/Switch'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {KEY_APP_VISIBILITY} from '../../../constants'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
}));

const Main = props =>  {
	const [appState, setAppState] = useState(true);
	const classes = Object.assign({}, props.classes, useStyles());
	
	useEffect(() => {
		(async () => {
			const result = await chrome.storage.sync.get({[KEY_APP_VISIBILITY] : true});
			console.log(result);
			if (result[KEY_APP_VISIBILITY] !== undefined)
				setAppState(result[KEY_APP_VISIBILITY]);
		})();
	}, [])
	
	const handleChange = async () => {
		await chrome.storage.sync.set({ [KEY_APP_VISIBILITY]: !appState});
		setAppState(!appState);
	};
	
	return (
		<Grid container
					direction={"row"}
					alignItems={"center"}
		>
			<Grid item xs={5} className={classes.labelIconPosition}>
				Enable download:
			</Grid>
			<Grid item>
				<Switch
					checked={appState}
					onChange={handleChange}
					inputProps={{ 'aria-label': 'secondary checkbox' }}
				/>
			</Grid>
		</Grid>
	)
};

export default Main
