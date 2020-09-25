import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {MESSAGE_DOCUMENT_SCROLL, MESSAGE_GET_IMAGES_TO_SHOW_ON_POPUP} from '../../constants'
import {sendMessageToActiveTab} from '../../utils'

const useStyles = makeStyles((theme) => ({
	gridList: {
		margin: 'unset !important',
		marginTop: '30px !important',
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
			<GridList cellHeight={100} className={classes.gridList} cols={4}>
				{images.map((tile) => (
					<GridListTile key={tile.src} cols={tile.cols || 1}>
						<img
							onClick={handleClick}
							src={tile.src}
							style={{width: 100, height: '100%'}}
							alt={tile.alt}
						/>
					</GridListTile>
				))}
			</GridList>
		</div>
	);
}
