import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {MESSAGE_DOCUMENT_SCROLL} from '../../constants'

const useStyles = makeStyles((theme) => ({
	gridList: {
		margin: 'unset !important',
		marginTop: '30px !important',
	}
}));


const getListDownloadMediaScript =`
function getDownloadedMedia() {
	return Array
		.from(document.getElementsByTagName('img'))
		.filter(media => media.srcset !== '' && media.alt !== 'Instagram')
		.map(media => {
			return {
				alt: media.alt,
				src: media.src,
				width: media.naturalWidth,
				height: media.naturalHeight
			}
		});
}

getDownloadedMedia();`


export default function BulkDownload(props) {
	const classes = Object.assign({}, props.classes, useStyles());
	const [images, setImages] = useState([]);

	useEffect(() => {
		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
			switch (message.type) {
				case MESSAGE_DOCUMENT_SCROLL:
					setImages(message.payload)
					console.log(MESSAGE_DOCUMENT_SCROLL);
					sendResponse({ type: MESSAGE_DOCUMENT_SCROLL });
					break;
				default:
					break;
			}
			return true;
		})
	})
	
	useEffect(() => {
		(async () => {
			try {
				const result = await chrome.tabs.executeScript({
					code: getListDownloadMediaScript
				});
				setImages(result[0]);
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
