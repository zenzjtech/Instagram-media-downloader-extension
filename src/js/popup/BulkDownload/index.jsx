import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography'
import GetAppIcon from '@material-ui/icons/GetApp'
import PerfectScrollBar from 'react-perfect-scrollbar'

import {MESSAGE_GET_IMAGES_TO_SHOW_ON_POPUP} from '../../constants'
import {plural, sendMessageToActiveTab} from '../../utils'
import './index.css'

const useStyles = makeStyles((theme) => ({
	gridList: {
		margin: 'unset !important',
		marginTop: '20px !important',
	},
	headerTextContainer: {
		marginTop: '30px',
		textAlign: 'center'
	},
	illustrateIcon: {
		marginBottom: '-5px'
	}
}));

export default function BulkDownload(props) {
	const classes = Object.assign({}, props.classes, useStyles());
	const [images, setImages] = useState([]);
	
	useEffect(() => {
		(async () => {
			try {
				const response = await sendMessageToActiveTab({
					type: MESSAGE_GET_IMAGES_TO_SHOW_ON_POPUP
				})
				if (response)
					setImages(response.payload);
			}
			catch (e) {
				console.log(e);
			}
		})()
	}, [])
	
	const handleClick = async () => {
	
	}
	
	return (
		<div className={classes.subRoot}>
			<PerfectScrollBar>
				<div className={classes.headerTextContainer}>
					<Typography
						variant={"overline"}
						component={"h1"}
					>
						{images.length} {plural('image', images.length)} found on this page.
						<br/>
					</Typography>
					{images.length !== 0 && <Typography
						variant={"caption"}
					>
						Click at <GetAppIcon color="primary" className={classes.illustrateIcon}/> button at the bottom of the page to download.
					</Typography>}
				</div>
				<GridList cellHeight={100} className={classes.gridList} cols={4}>
					{images.map((tile) => (
						<GridListTile
							key={tile.src} cols={tile.cols || 1}
						>
							<img
								className={"grid-item"}
								onClick={handleClick}
								src={tile.src}
								style={{width: 100, height: '100%'}}
								alt={tile.alt}
							/>
						</GridListTile>
					))}
				</GridList>
			</PerfectScrollBar>
		</div>
	);
}
