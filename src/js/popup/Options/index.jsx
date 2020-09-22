import React, {useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import icon from 'img/icon-34.png'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Radio from '@material-ui/core/Radio'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import {
	ICON_POSITION_BOTTOMLEFT,
	ICON_POSITION_BOTTOMRIGHT,
	ICON_POSITION_TOPLEFT,
	ICON_POSITION_TOPRIGHT,
	ICON_POSITION_UNDER,
	IMAGE_RESOLUTION,
	KEY_APP_ICON_POSITION,
	KEY_APP_IMAGE_RESOLUTION
} from 'js/constants'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles((theme) => ({
	root: {
		margin: '0 auto'
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

export default function Options() {
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
			if (result[KEY_APP_IMAGE_RESOLUTION] !== undefined)
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
			<Grid container component={Paper} style={{ paddingBottom: '20px'}}>
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
					
					<Grid container alignItems={"baseline"}>
						<Grid
							item
							component={FormLabel}
							className={classes.labelIconPosition}
							xs={4}
						>
							Icon position:
						</Grid>
						<Grid item xs={8}>
							<Grid container>
								<RadioGroup
									row aria-label="position"
									name="position"
									value={iconPosition}
									onChange={handleChangeIconPosition}
								>
									<Grid container style={{ backgroundColor: '#f6f5ff' }}>
										<Grid container justify={"space-around"}>
											<FormControlLabel
												value={ICON_POSITION_TOPLEFT}
												control={	<Radio/>}
												label="Top Left"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												value={ICON_POSITION_TOPRIGHT}
												control={<Radio/>}
												label="Top Right"
												labelPlacement="bottom"
											/>
										</Grid>
										<Grid container justify={"space-around"}>
											<FormControlLabel
												value={ICON_POSITION_BOTTOMLEFT}
												control={<Radio/>}
												label="Bottom Left"
												labelPlacement="bottom"
											/>
											<FormControlLabel
												value={ICON_POSITION_BOTTOMRIGHT}
												control={<Radio/>}
												label="Bottom Right"
												labelPlacement="bottom"
											/>
										</Grid>
									</Grid>
									<Grid container justify={"flex-end"}>
										<FormControlLabel
											style={{ marginRight: 23 }}
											value={ICON_POSITION_UNDER}
											control={<Radio/>}
											label="Below image"
											labelPlacement="bottom"
										/>
									</Grid>
								</RadioGroup>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}
