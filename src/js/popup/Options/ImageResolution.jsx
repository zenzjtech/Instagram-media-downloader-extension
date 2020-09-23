import React, {useEffect} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { IMAGE_RESOLUTION } from 'js/constants';
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import FormLabel from '@material-ui/core/FormLabel'
import {KEY_APP_IMAGE_RESOLUTION} from '../../constants'

const ImageResolution = (props) => {
	const { classes } = props;
	
	const [resolution, setResolution] = React.useState(3);
	
	useEffect(() => {
		(async function(){
			const result = await chrome.storage.sync.get([
				KEY_APP_IMAGE_RESOLUTION
			]);
			if (result[KEY_APP_IMAGE_RESOLUTION] !== undefined)
				setResolution(result[KEY_APP_IMAGE_RESOLUTION]);
		})();
	}, [])
	
	useEffect(() => {
		(async function() {
			await chrome.storage.sync.set({
				[KEY_APP_IMAGE_RESOLUTION]: resolution
			})
		})()
	}, [resolution]);
	
	
	const handleChange = (event) => {
		setResolution(event.target.value);
	};
	
	return (
		<Grid container alignItems={"baseline"}>
			<Tooltip title={"The version whose value is closest to the selected resolution will be downloaded"}>
				<Grid
					item component={FormLabel}
					className={classes.labelIconPosition}
					xs={5}
				>
					Image resolution:
				</Grid>
			</Tooltip>
			<Grid
				item component={FormControl}
				className={classes.formControl}
			>
				<Select
					labelId="demo-simple-select-helper-label"
					id="demo-simple-select-helper"
					value={resolution}
					onChange={handleChange}
				>{
					IMAGE_RESOLUTION.map((value, index) =>
						<MenuItem key={index} value={index}>{value}</MenuItem>
					)
				}
				</Select>
				<FormHelperText> Unit: pixel </FormHelperText>
			</Grid>
		</Grid>
	)
}

export default ImageResolution
