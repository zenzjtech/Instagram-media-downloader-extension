import React, {useEffect, useState} from "react"
import Switch from '@material-ui/core/Switch'
import { hot } from "react-hot-loader";
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import {KEY_APP_VISIBILITY} from '../constants'

const useStyles = makeStyles({
  root: {
    width: '300px',
    height: 'auto',
    margin: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  switcher: {
  },
  switcherCaption: {
    fontSize: '16px',
    display: 'inline-block'
  },
  footer: {
    margin: '10px 0 14px 0'
  }
})
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
  
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
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
      </div>
      <Typography className={classes.footer} variant={'caption'}>
        made by <a href={'#'}>Your Company</a>
      </Typography>
    </div>
    
  )
};

export default hot(module)(Popup)
