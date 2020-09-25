import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	},
	gridList: {
	},
}));


const tileData = [
	{
		img: 'https://instagram.fsgn2-5.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/120027498_362953128172821_8904179124490975760_n.jpg?_nc_ht=instagram.fsgn2-5.fna.fbcdn.net&_nc_cat=1&_nc_ohc=0pbnqZgiuYwAX8rhURZ&_nc_tp=19&oh=74e0269ad61e6bcaf11d970c055762d1&oe=5F98972C',
		title: 'Image',
		author: 'author',
		cols: 2,
	}
];

export default function BulkDownload() {
	const classes = useStyles();
	
	return (
		<div className={classes.root}>
			<GridList cellHeight={50} className={classes.gridList} cols={3}>
				{tileData.map((tile) => (
					<GridListTile key={tile.img} cols={tile.cols || 1}>
						<img src={tile.img} style={{width: 50}} alt={tile.title} />
					</GridListTile>
				))}
			</GridList>
		</div>
	);
}
