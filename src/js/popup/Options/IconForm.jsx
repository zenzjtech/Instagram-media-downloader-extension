import React, {useEffect} from 'react'
import GetAppIcon from '@material-ui/icons/GetApp';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import SystemUpdateAltIcon from 'img/public/download_black_bold.svg';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid'
import FormLabel from '@material-ui/core/FormLabel'
import {
	ICON_TYPE_SYSTEM_UPDATE_ALT,
	KEY_APP_ICON_TYPE,
	ICON_TYPE_GET_APP,
	ICON_TYPE_SYSTEM_UPDATE,
	ICON_TYPE_CLOUD_DOWNLOAD
} from '../../constants'

import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: 20,
	},
	icon: {
		width: 22,
		height: 22
	}
}))

const IconForm = (props) => {
	const classes = Object.assign({}, props.classes, useStyles());
	const [iconType, setIconType] = React.useState(ICON_TYPE_SYSTEM_UPDATE_ALT);
	const [firstTimeRender, setFirstTimeRender] = React.useState(true);
	
	useEffect(() => {
		(async function(){
			const result = await chrome.storage.sync.get({
				[KEY_APP_ICON_TYPE]: ICON_TYPE_SYSTEM_UPDATE_ALT
			});
			if (result[KEY_APP_ICON_TYPE] !== iconType)
				setIconType(result[KEY_APP_ICON_TYPE]);
		})();
	}, [])
	
	useEffect(() => {
		if (firstTimeRender) {
			setFirstTimeRender(false);
			return;
		}
		(async function() {
			await chrome.storage.sync.set({
				[KEY_APP_ICON_TYPE]: iconType
			})
		})()
	}, [iconType]);
	
	const handleChange = (event, newIconType) => {
		setIconType(newIconType);
	};
	
	return (
		<Grid container className={classes.root}>
			<Grid
				item component={FormLabel}
				className={classes.labelIconPosition}
				xs={5}
			>
				Icon type:
			</Grid>
			<Grid item>
				<ToggleButtonGroup
					value={iconType}
					exclusive
					onChange={handleChange}
					aria-label="text alignment"
				>
					<ToggleButton value={ICON_TYPE_GET_APP} aria-label="get app">
						<GetAppIcon fontSize={"small"}/>
					</ToggleButton>
					<ToggleButton value={ICON_TYPE_CLOUD_DOWNLOAD} aria-label="cloud download">
						<CloudDownloadIcon fontSize={"small"}/>
					</ToggleButton>
					<ToggleButton value={ICON_TYPE_SYSTEM_UPDATE} aria-label="system update">
						<SystemUpdateIcon fontSize={"small"}/>
					</ToggleButton>
					<ToggleButton
						value={ICON_TYPE_SYSTEM_UPDATE_ALT}
						aria-label="system update alt"
						style={{opacity: 0.5}}
					>
						<img src={SystemUpdateAltIcon} className={classes.icon}/>
					</ToggleButton>
				</ToggleButtonGroup>
			</Grid>
		</Grid>
	)
}

export default IconForm
