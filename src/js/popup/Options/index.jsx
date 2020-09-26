import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'

import icon from 'img/icon-34.png'
import ImageResolution from './ImageResolution'
import IconPosition from './IconPosition'
import IconForm from './IconForm'
import Switcher from './Switcher'

const useStyles = makeStyles((theme) => ({
	subRoot: {
		overflowY: 'hidden'
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
		marginLeft: theme.spacing(1),
		fontWeight: 600,
	},
	actionArea: {
		flexDirection: 'column',
		margin: `0 ${theme.spacing(6)}px`
	},
	labelIconPosition: {
		fontWeight: 600,
		fontSize: '0.9rem'
	}
}));


export default function Options(props) {
	const classes = Object.assign({}, props.classes, useStyles());
	
	const childProps = {
		classes
	}
	
	return (
		<div className={classes.subRoot}>
			<Grid container component={Paper} style={{ paddingBottom: '20px'}}>
				<Grid
					container
					component={CardContent}
					alignItems={"center"}
					justify={"center"}
					style={{
						height: "100px",
						paddingTop: "40px"
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
					<Switcher {...childProps}/>
					<ImageResolution {...childProps}/>
					<IconForm {...childProps}/>
					<IconPosition {...childProps}/>
				</Grid>
			</Grid>
		</div>
	);
}
