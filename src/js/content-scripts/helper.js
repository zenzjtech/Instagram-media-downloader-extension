import { fetchAdditionalData,
	fetchSingleNodeData
} from '../utils/';

import { IGTV_CLASSNAME_IDENTIFIER,
	MSG_DOWNLOAD_FILE,
	IDFI_BUTTON_LOADER,
	IDFI_BUTTON,
	LOADER_CLASSNAME,
	TAGGED_CLASSNAME_IDENTIFIED,
	FAVORITE_BUTTON_CLASSNAME,
	STORY_THUMBNAIL_CLASSNAME
} from '../constants';

export function isInstPost(mediaNode) {
	return mediaNode.srcset && mediaNode.alt !== 'Instagram'
}

export function createDownloadLoader() {
	let loader = document.createElement('div');
	loader.innerHTML = '<div></div><div></div>';
	loader.className = LOADER_CLASSNAME;
	loader.setAttribute("name", IDFI_BUTTON_LOADER);
	loader.setAttribute('type', IDFI_BUTTON)
	return loader;
}


export function getMediaNode() {
	const images = Array.from(document.querySelectorAll("img"));
	const videos = Array.from(document.querySelectorAll('video'));
	// IGTV video
	const igtvVideos = Array.from(document.getElementsByClassName(IGTV_CLASSNAME_IDENTIFIER));
	let mediaNodes = images.concat(videos).concat(igtvVideos);
	
	// exlcuding stories
	mediaNodes = mediaNodes.filter(node => node.className !== STORY_THUMBNAIL_CLASSNAME);
	return mediaNodes;
}

export function createDownloadButton(
	{
		media, dlIcon, mouseEnterOp, mouseLeaveOp, btnClass, videoData
	}) {
	media.setAttribute("button", IDFI_BUTTON);
	/*  */
	let button = document.createElement("span");
	button.setAttribute("type", IDFI_BUTTON);
	button.setAttribute("class", btnClass);
	button.setAttribute("title", "Download Media");
	button.style.background = `transparent no-repeat center center`;
	button.style.backgroundImage = `url(${dlIcon})`
	button.style.backgroundSize = "35px";
	/*  */
	button.addEventListener("mouseenter", function () {
		this.style.opacity = mouseEnterOp
	});
	button.addEventListener("mouseleave", function () {
		this.style.opacity = mouseLeaveOp
	});
	/*  */
	button.addEventListener("click", async function (e) {
		e.preventDefault();
		e.stopPropagation();
		/*  */
		const src = await getMediaSrc(media, videoData);
		if (src)
			chrome.runtime.sendMessage({
				type: MSG_DOWNLOAD_FILE,
				payload: src
			}, function(response) {
				console.log(response);
			})
	});
	return button;
}

async function getMediaSrc(node, videoData) {
	const containerNode = node.parentElement.parentElement;
	// If this node is in IGTV
	if (node.className === IGTV_CLASSNAME_IDENTIFIER) {
		const data = await loadingWrapper(
			fetchSingleNodeData,
			containerNode,
			containerNode.href
		);
		const currentNodeVideoUrl = getCurrentVideoUrl(data);
		return currentNodeVideoUrl;
	}
	if (node.className === TAGGED_CLASSNAME_IDENTIFIED) {
		const isVideo = containerNode.parentElement.querySelector('[aria-label="Video"]') !== null;
		if (isVideo) {
			const data = await loadingWrapper(
				fetchSingleNodeData,
				containerNode.parentElement,
				containerNode.parentElement.href
			);
			const currentNodeVideoUrl = getCurrentVideoUrl(data);
			return currentNodeVideoUrl;
		}
	}
	// Homepage or feed
	const src = getMediaSrcAtHomePageOrFeed(node, videoData);
	return src;
}

// TODO: hangle generic args
async function loadingWrapper(func, node, args) {
	const loader = node.getElementsByClassName(LOADER_CLASSNAME)[0];
	const downloadBtn = node.getElementsByClassName(IDFI_BUTTON)[0];
	if (loader) {
		loader.style.visibility = 'visible';
	}
	downloadBtn.style.visibility = 'hidden';
	const result = await func(args);
	loader.style.visibility = 'hidden';
	downloadBtn.style.visibility = 'visible';
	return result;
}


/**
 * Find the commmont <article> tag of current image and its functional buttons.
 * @param node
 */
export function getFavoriteButton(node) {
	while (node.parentElement) {
		const favoriteButton = node.querySelector(`[class="${FAVORITE_BUTTON_CLASSNAME}"]`)
		if (favoriteButton) {
			return favoriteButton;
		}
		node = node.parentElement;
	}
	return null;
}

function getCurrentVideoUrl(data) {
	let currentNodeVideoUrl = '';
	function findVideoUrl(data) {
		if (typeof data !== 'object' || data === null)
			return;
		if (data.video_url)
			currentNodeVideoUrl = data.video_url;
		Object.entries(data).forEach(([key, value]) => {
			findVideoUrl(value);
		});
	}
	findVideoUrl(data);
	return currentNodeVideoUrl;
}

export async function receiveNewVideoData(currentVideoData) {
	let newVideoData = await fetchAdditionalData();
	newVideoData = extractVideoData(newVideoData);
	newVideoData = newVideoData
		.filter(video => !currentVideoData.find(video1 => video1.video_url === video.url));
	
	return [...currentVideoData].concat(newVideoData);
}

function extractVideoData(data) {
	let tempVideos = [];
	function mineVideo(data) {
		if (typeof data !== 'object' || data === null)
			return;
		if (data.video_url && !tempVideos.find(video => video.video_url === data.video_url))
			tempVideos.push({
				video_url: data.video_url,
				thumbnail_src: data.thumbnail_src
			})
		Object.entries(data).forEach(([key, value]) => {
			mineVideo(value);
		});
	}
	mineVideo(data);
	return tempVideos;
}

const getHighestResolutionImg = image => {
	if (image.srcset) {
		const imgset = image.srcset.split(',');
		const lastImage = imgset[imgset.length - 1];
		return lastImage.split(' ')[0];
	}
	return image && image.src ? image.src : '';
}

function getMediaSrcAtHomePageOrFeed(media, videoData) {
	// if this post is a video
	if (media.tagName === 'VIDEO') {
		if (media.src)
			return media.src;
		const source = media.querySelector('source');
		return source ? source.src : '';
	}
	let src = media && media.src ? media.src : '';
	// If this post is a reference to a video
	const found = videoData.find(data => data.thumbnail_src === src);
	if (found)
		return found.video_url;
	// Else this is an image
	return getHighestResolutionImg(media);
}
