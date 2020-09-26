import React, {useRef} from "react"
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SettingIcon from '@material-ui/icons/Settings';
import GetAppIcon from '@material-ui/icons/GetApp';

import Options from './Options';
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import BulkDownload from './BulkDownload'
import {MESSAGE_DOWNLOAD_ALL} from '../constants'
import Tooltip from '@material-ui/core/Tooltip'
import {sendMessageToActiveTab} from '../utils'

const useStyles = makeStyles({
	root: {
		height: 506,
		width: 420,
		display: 'relative'
	},
	subRoot: {
		margin: '0 auto',
		overflowY: 'scroll',
		overflowX: 'hidden',
		height: 451
	},
	navBottom: {
		borderTop: '1px solid #e4e7ed'
	},
	logo: {
		color: '#909399',
		fontSize: '.675rem',
		left: '.518rem',
		position: 'absolute',
		top: '.518rem'
	}
});

const Popup = () => {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	
	const handleDownloadAll = () => {
		// If this is a click to navigate to DownloadAll,
		// We do no thing
		if (value === 1)
			return;
		try {
			(async () => {
				await sendMessageToActiveTab({
					type: MESSAGE_DOWNLOAD_ALL
				})
			})()
		} catch (e) {
			console.log(e);
		}
	}
	
	return (
		<div className={classes.root}>
			<Typography className={classes.logo} variant={'caption'}>
				made by <Link>Your Company </Link>
			</Typography>
			{value === 0 && <BulkDownload classes={classes}/>}
			{value === 1 && <Options classes={classes}/>}
			<BottomNavigation
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
				className={classes.navBottom}
			>
				<Tooltip
					title={value === 0 ? "Click here to download all images" : ""}
				>
					<BottomNavigationAction
						label="DownloadAll" icon={<GetAppIcon />}
						onClick={handleDownloadAll}
					/>
				</Tooltip>
				<BottomNavigationAction label="Options" icon={<SettingIcon />} />
			</BottomNavigation>
		</div>
	);
}

export default Popup
