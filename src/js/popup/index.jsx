import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Dashboard from '@material-ui/icons/Dashboard';
import SettingIcon from '@material-ui/icons/Settings';
import SystemUpdate from '@material-ui/icons/SystemUpdate';

import Main from './Main';
import Options from './Options';

const useStyles = makeStyles({
	root: {
		width: 500,
		borderTop: '1px solid #e4e7ed'
	},
});

const Popup = () => {
	const classes = useStyles();
	const [value, setValue] = React.useState(1);
	
	return (
		<div>
			{value === 0 && <Main/>}
			{value === 1 && <Options/>}
			<BottomNavigation
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
				className={classes.root}
			>
				<BottomNavigationAction label="View" icon={<Dashboard />} />
				<BottomNavigationAction label="Options" icon={<SettingIcon />} />
				<BottomNavigationAction label="DownloadAll" icon={<SystemUpdate />} />
			</BottomNavigation>
		</div>
	);
}

export default Popup
