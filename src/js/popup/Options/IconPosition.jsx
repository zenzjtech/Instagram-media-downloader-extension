import React, {useEffect} from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import FormLabel from '@material-ui/core/FormLabel'
import {
	ICON_POSITION_BOTTOMLEFT,
	ICON_POSITION_BOTTOMRIGHT, ICON_POSITION_TOPLEFT, ICON_POSITION_TOPRIGHT,
	ICON_POSITION_UNDER, KEY_APP_ICON_POSITION
} from '../../constants'
import {Fade, Radio, RadioGroup} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: 30,
	}
}))

const IconPosition = (props) => {
	const classes = Object.assign({}, props.classes, useStyles());
	
	const [iconPosition, setIconPosition] = React.useState(null);
	
	useEffect(() => {
		(async function(){
			const result = await chrome.storage.sync.get({
				[KEY_APP_ICON_POSITION]: ICON_POSITION_UNDER
			});
			setIconPosition(result[KEY_APP_ICON_POSITION]);
		})();
	}, [])
	
	useEffect(() => {
		(async function() {
			await chrome.storage.sync.set({
				[KEY_APP_ICON_POSITION]: iconPosition,
			})
		})()
	}, [iconPosition]);
	
	
	const handleChangeIconPosition = (event) => {
		setIconPosition(event.target.value);
	};
	
	return (
		<Grid container className={classes.root}>
			<Grid
				item
				component={FormLabel}
				className={classes.labelIconPosition}
				xs={5}
			>
				Icon position:
			</Grid>
			<Grid item xs={5}>
				<Grid container>
					<RadioGroup
						row aria-label="position"
						name="position"
						value={iconPosition}
						onChange={handleChangeIconPosition}
					>
						<Grid container style={{ backgroundColor: 'aliceblue' }}>
							<Grid container justify={"space-between"}>
								<Tooltip
									title={"Top left"}
									TransitionComponent={Fade}
									TransitionProps={{ timeout: 1000 }}
									placement={"left-start"}
								>
									<Radio value={ICON_POSITION_TOPLEFT}/>
								</Tooltip>
								<Tooltip
									title={"Top right"}
									TransitionComponent={Fade}
									TransitionProps={{ timeout: 1000 }}
									placement={"left-start"}
								>
									<Radio value={ICON_POSITION_TOPRIGHT}/>
								</Tooltip>
							</Grid>
							<Grid container justify={"space-between"}>
								<Tooltip
									title={"Bottom left"}
									TransitionComponent={Fade}
									TransitionProps={{ timeout: 1000 }}
									placement={"left-end"}
								>
									<Radio value={ICON_POSITION_BOTTOMLEFT}/>
								</Tooltip>
								<Tooltip
									title={"Bot right"}
									TransitionComponent={Fade}
									TransitionProps={{ timeout: 1000 }}
									placement={"left-end"}
								>
									<Radio value={ICON_POSITION_BOTTOMRIGHT}/>
								</Tooltip>
							</Grid>
						</Grid>
						<Grid container justify={"flex-end"}>
							<Tooltip
								title={"Below image"}
								TransitionComponent={Fade}
								TransitionProps={{ timeout: 1000 }}
								placement={"right"}
							>
								<Radio
									value={ICON_POSITION_UNDER}
								/>
							</Tooltip>
						</Grid>
					</RadioGroup>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default IconPosition
