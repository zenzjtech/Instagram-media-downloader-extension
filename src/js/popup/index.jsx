import React, {useEffect, useState} from "react"
import Switch from '@material-ui/core/Switch'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import {KEY_APP_VISIBILITY} from '../constants'
import Grid from '@material-ui/core/Grid'
import SettingsIcon from '@material-ui/icons/Settings';
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '300px',
    height: 'auto',
		width: 'auto',
		margin: theme.spacing(2)
  },
  switcher: {
  },
  switcherCaption: {
    fontSize: theme.spacing(2),
    display: 'inline-block'
  },
  footer: {
    margin: '10px 0 14px 0'
  }
}));

const Popup = props =>  {
  const [appState, setAppState] = useState(true);
  
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
  
  const handleOptionClick = () => {
  	chrome.tabs.create({
			url: 'options.html'
		})
	}
  
  const classes = useStyles();
  return (
  	<div className={classes.root}>
			<Grid container
						direction={"column"}
						alignItems={"center"}
			>
				<Grid item>
					<Switch
						className={classes.switcher}
						checked={appState}
						onChange={handleChange}
						inputProps={{ 'aria-label': 'secondary checkbox' }}
					/>
					<Typography
						className={classes.switcherCaption}
						variant={"body1"}
					>
						Download media from Instagram
					</Typography>
				</Grid>
				<Grid item>
					<Typography className={classes.footer} variant={'caption'}>
						made by <Link>Your Company </Link>
					</Typography>
					<Typography className={classes.footer} variant={'caption'}>
						- <Link onClick={handleOptionClick} style={{cursor: 'pointer'}}>Options</Link>
					</Typography>
				</Grid>
			</Grid>
		</div>
  )
};

export default Popup
