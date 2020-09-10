import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import icon from 'img/icon-34.png';
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Radio from '@material-ui/core/Radio'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
require('chrome-extension-async');

import { KEY_APP_IMAGE_RESOLUTION, KEY_APP_ICON_POSITION } from 'js/constants';

const useStyles = makeStyles((theme) => ({
	root: {
		width: theme.spacing(80),
		margin: '0 auto',
		marginTop: '150px'
	},
	content: {
		justifyContent: 'center',
		marginTop: theme.spacing(4)
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	headerText: {
		fontSize: '1.5em',
		marginLeft: theme.spacing(1),
		fontWeight: 'bold'
	},
	actionArea: {
		flexDirection: 'column',
		margin: `0 ${theme.spacing(6)}px`
	},
	labelIconPosition: {
		fontWeight: 'bold'
	}
}));

export default function Option() {
	const classes = useStyles();
	const [resolution, setResolution] = React.useState(3);
	const [iconPosition, setIconPosition] = React.useState('under');
	
	useEffect(() => {
		(async function(){
			const result = await chrome.storage.sync.get([
				KEY_APP_IMAGE_RESOLUTION, KEY_APP_ICON_POSITION
			]);
			if (result[KEY_APP_ICON_POSITION])
				setIconPosition(result[KEY_APP_ICON_POSITION]);
			if (result[KEY_APP_IMAGE_RESOLUTION])
				setResolution(result[KEY_APP_IMAGE_RESOLUTION]);
		})();
	}, [])
	
	useEffect(() => {
		(async function() {
			await chrome.storage.sync.set({
				[KEY_APP_ICON_POSITION]: iconPosition,
				[KEY_APP_IMAGE_RESOLUTION]: resolution
			})
		})()
	}, [iconPosition, resolution]);
	
	const handleChange = (event) => {
		setResolution(event.target.value);
	};
	
	const handleChangeIconPosition = (event) => {
		setIconPosition(event.target.value);
	};
	return (
		<div className={classes.root}>
			<Grid container component={Paper} style={{ paddingBottom: '50px'}}>
				<Grid
					container
					component={CardContent}
					alignItems={"center"}
					justify={"center"}
					style={{
						height: "100px"
					}}
				>
					<Avatar
						variant="rounded"
						aria-label="recipe"
						src={icon}
					/>
					<Typography className={classes.headerText}>Download options</Typography>
				</Grid>
				<Grid container className={classes.actionArea}>
					<Grid container alignItems={"baseline"}>
						<Grid
							item component={FormLabel}
							className={classes.labelIconPosition}
							xs={4}
						>
							Image resolution:
						</Grid>
						<Grid
							item xs={2} component={FormControl}
							className={classes.formControl}
						>
							<Select
								labelId="demo-simple-select-helper-label"
								id="demo-simple-select-helper"
								value={resolution}
								onChange={handleChange}
							>
								<MenuItem value={1}>640</MenuItem>
								<MenuItem value={2}>750</MenuItem>
								<MenuItem value={3}>1080</MenuItem>
							</Select>
							<FormHelperText> Unit: pixel </FormHelperText>
						</Grid>
					</Grid>
					
					<Grid container alignItems={"baseline"}>
						<Grid
							item
							component={FormLabel}
							className={classes.labelIconPosition}
							xs={4}
						>
							Icon position:
						</Grid>
						<Grid item>
							<RadioGroup
								row aria-label="position"
								name="position"
								value={iconPosition}
								onChange={handleChangeIconPosition}
							>
								<FormControlLabel
									value="tl"
									control={	<Radio/>}
									label="Top Left"
									labelPlacement="bottom"
								/>
								<FormControlLabel
									value="tr"
									control={<Radio/>}
									label="Top Right"
									labelPlacement="bottom"
								/>
								<FormControlLabel
									value="under"
									control={<Radio/>}
									label="Below"
									labelPlacement="bottom"
								/>
							</RadioGroup>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}
