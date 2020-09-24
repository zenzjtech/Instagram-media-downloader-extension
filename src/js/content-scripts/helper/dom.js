import { fetchAdditionalData,
	fetchSingleNodeData
} from '../../utils';

import { IGTV_CLASSNAME_IDENTIFIER,
	MSG_DOWNLOAD_FILE,
	IDFI_BUTTON_LOADER,
	IDFI_BUTTON,
	LOADER_CLASSNAME,
	TAGGED_CLASSNAME_IDENTIFIED,
	FAVORITE_BUTTON_CLASSNAME,
	STORY_CONTAINER_CLASSNAME,
	KEY_LOCALSTORAGE_IMAGE_RESOLUTION,
	DEFAULT_IMAGE_RESOLUTION
} from '../../constants';
import {isAtMediaDetailPage} from './navigation'

export function isInstPost(mediaNode) {
	return mediaNode.tagName === 'VIDEO' || (mediaNode.srcset && mediaNode.alt !== 'Instagram')
}

export function createDownloadLoader() {
	let loader = document.createElement('div');
	loader.innerHTML = '<div></div><div></div>';
	loader.className = LOADER_CLASSNAME;
	loader.setAttribute("name", IDFI_BUTTON_LOADER);
	loader.setAttribute('type', IDFI_BUTTON)
	return loader;
}


function hasParentWithClassName(node, className) {
	if (!node)
		return false;
	if (node.className.includes(className))
		return true;
	return hasParentWithClassName(node.parentElement, className);
}

export function getMediaNode() {
	
	const images = Array.from(document.querySelectorAll("img"));
	const videos = Array.from(document.querySelectorAll('video'));
	// IGTV video
	const igtvVideos = Array.from(document.getElementsByClassName(IGTV_CLASSNAME_IDENTIFIER));
	let mediaNodes = images.concat(videos).concat(igtvVideos);
	
	
	mediaNodes = mediaNodes
		.filter(node => !hasParentWithClassName(node, STORY_CONTAINER_CLASSNAME)) // exclude stories
		.filter(node => !(node.src && !node.src.startsWith('http'))) // exclude invalid url
		.filter(node => node.alt !== 'Instagram')
		.filter( node => node.className !== 'ZIm78')
	return mediaNodes;
}

export function createDownloadButton(
	{
		media, dlIcon, mouseEnterOp,
		mouseLeaveOp, btnClass, backgroundSize,
		videoData
	}) {
	media.setAttribute("button", IDFI_BUTTON);
	/*  */
	let button = document.createElement("span");
	button.setAttribute("type", IDFI_BUTTON);
	button.setAttribute("class", btnClass);
	button.setAttribute("title", "Download Media");
	if (typeof dlIcon === 'string') {
		button.style.background = `white no-repeat center center`;
		button.style.backgroundImage = `url(${dlIcon})`;
		button.style.backgroundSize = backgroundSize;
	} else {
	
	}
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

export async function getMediaSrc(node, videoData) {
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
	// If this node is at HomePage -> Tag
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

const getCustomResolutionImg = (image) => {
	// This is hacky, but it's amongst the best available sollution
	let desiredResolution = localStorage.getItem(KEY_LOCALSTORAGE_IMAGE_RESOLUTION) || DEFAULT_IMAGE_RESOLUTION;
	desiredResolution = parseInt(desiredResolution);
	function getResolution(img) {
		return parseInt(img.split(' ')[1].replace('w', ''));
	}
	function getHref(img) {
		return img.split(' ')[0];
	}
	function getResolutionDifference(img1, desiredResolution) {
		return Math.abs(getResolution(img1) - desiredResolution);
	}
	
	if (image.srcset) {
		const srcSet = image.srcset.split(',');
		let result = srcSet[srcSet.length - 1];
		srcSet.forEach(img => {
			if (getResolutionDifference(img, desiredResolution) < getResolutionDifference(result, desiredResolution))
				result = img;
		})
		result = getHref(result);
		if (!result.startsWith('http'))
			result = 'https://instagram.com' + result;
		return result;
	}
	return image && image.src ? image.src : '';
}

function findCommonAncestorWithVideoChildRen(node) {
	if (!node)
		return null;
	if (node.querySelector('video'))
		return node.querySelector('video');
	return findCommonAncestorWithVideoChildRen(node.parentElement);
}
export function getMediaSrcAtHomePageOrFeed(media, videoData) {
	// if this post is a video
	if (media.tagName === 'VIDEO') {
		if (media.src)
			return media.src;
		const source = media.querySelector('source');
		return source ? source.src : '';
	}
	
	let src = media && media.src ? media.src : '';
	// If this post is a reference to a video at Homepage
	const found = videoData.find(data => data.thumbnail_src === src);
	if (found)
		return found.video_url;
	
	// If this is a video at specific page
	if (isAtMediaDetailPage()){
		const video = findCommonAncestorWithVideoChildRen(media);
		if (video)
			return video.src;
	}
	
	// If this post is a reference to a video at NewsFeed
	const video = media.parentElement.querySelector('video');
	if (video)
		return video.src;
	// Else this is an image
	return getCustomResolutionImg(media);
}

