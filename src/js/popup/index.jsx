import React, {useRef} from "react"
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SettingIcon from '@material-ui/icons/Settings';
import SystemUpdate from '@material-ui/icons/SystemUpdate';

import Options from './Options';
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import BulkDownload from './BulkDownload'

const useStyles = makeStyles({
	root: {
		height: 400,
		width: 420,
		display: 'relative'
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
	
	return (
		<div className={classes.root}>
			<Typography className={classes.logo} variant={'caption'}>
				made by <Link>Your Company </Link>
			</Typography>
			{value === 0 && <Options/>}
			{value === 1 && <BulkDownload/>}
			<BottomNavigation
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
				className={classes.navBottom}
			>
				<BottomNavigationAction label="Options" icon={<SettingIcon />} />
				<BottomNavigationAction label="DownloadAll" icon={<SystemUpdate />} />
			</BottomNavigation>
		</div>
	);
}

export default Popup
