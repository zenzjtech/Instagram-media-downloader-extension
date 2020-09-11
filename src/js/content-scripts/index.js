require('chrome-extension-async');

import {
	MSG_DOWNLOAD_FILE, IGTV_CLASSNAME_IDENTIFIER,
	TAGGED_CLASSNAME_IDENTIFIED,
	LOADER_CLASSNAME,
	IDFI_BUTTON_LOADER,
	IDFI_BUTTON, KEY_APP_STATE,
	FAVORITE_BUTTON_CLASSNAME, IDFI_BUTTON_UNDER
} from '../constants'
import { fetchAdditionalData,
	fetchSingleNodeData,
	getVideoOrImageSrc
} from '../utils/';
import { loadBulkDownloadUI } from './bulkdownload';
import { isInstPost } from './helper';
require('./inject');

let oldHref = document.location.href;
let videoData = [];
let appState = true;
const icon = chrome.runtime.getURL('asset/img/download_white.svg');
const iconBlack = chrome.runtime.getURL('asset/img/download_black.svg');
const load = function () {observer.observe(document.body, {"childList": true, "subtree": true})};


async function getMediaSrc(node) {
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
	const src = getVideoOrImageSrc(node, videoData);
	return src;
}

const setUiVisible = (show = true) => {
	let elements = document.querySelectorAll(`[type='${IDFI_BUTTON}']`);
	elements = Array.from(elements).filter(element => element.getAttribute("name") !== IDFI_BUTTON_LOADER)
	elements.forEach(element => {
		element.style.visibility = show ? 'visible' : 'hidden';
	})
}

function handleUrlChange() {
	loadBulkDownloadUI();
	oldHref = document.location.href;
	(async () => {
		videoData = await receiveNewVideoData(videoData);
	})();
}

const observer = new MutationObserver(function (m) {
	for (let i = 0; i < m.length; i++) {
		if (oldHref != document.location.href) {
			handleUrlChange();
		}
		const mutation = m[i];
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			for (let j = 0; j < mutation.addedNodes.length; j++) {
				
				const tmp = mutation.addedNodes[j];
				if (tmp.nodeType === Node.ELEMENT_NODE) {
					const type = tmp.getAttribute("type");
					const name = tmp.getAttribute("name");
					if (!type || (type && type.indexOf(IDFI_BUTTON) === -1)) {
						action(true);
						console.log(tmp);
					}
					if (type && type.indexOf(IDFI_BUTTON) !== -1 && name !== IDFI_BUTTON_LOADER)
							tmp.style.visibility = appState ? 'visible' : 'hidden';
				}
			}
		}
	}
});

function getMediaNode() {
	const images = Array.from(document.querySelectorAll("img"));
	const videos = Array.from(document.querySelectorAll('video'));
	// IGTV video
	const igtvVideos = Array.from(document.getElementsByClassName(IGTV_CLASSNAME_IDENTIFIER));
	const videoAndImage = images.concat(videos).concat(igtvVideos);
	return videoAndImage;
}

function createDownloadButton({ media, dlIcon, mouseEnterOp, mouseLeaveOp, btnClass }) {
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
		const src = await getMediaSrc(media);
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

function createDownloadLoader() {
	let loader = document.createElement('div');
	loader.innerHTML = '<div></div><div></div>';
	loader.className = LOADER_CLASSNAME;
	loader.setAttribute("name", IDFI_BUTTON_LOADER);
	loader.setAttribute('type', IDFI_BUTTON)
	return loader;
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
function getFavoriteButton(node) {
	while (node.parentElement) {
		const favoriteButton = node.querySelector(`[class="${FAVORITE_BUTTON_CLASSNAME}"]`)
		if (favoriteButton) {
			return favoriteButton;
		}
		node = node.parentElement;
	}
	return null;
}

const action = function () {
	const videoAndImage = getMediaNode();
	videoAndImage.forEach(mediaNode => {
		// Insert Download Button within the image/video
		let downloadButton = mediaNode.getAttribute("button");
		if (!downloadButton) {
			downloadButton = createDownloadButton({
				media: mediaNode,
				dlIcon: icon,
				mouseLeaveOp: '0.3',
				mouseEnterOp: '1.0',
				btnClass: IDFI_BUTTON
			});
			let loader = createDownloadLoader(mediaNode);
			mediaNode.after(downloadButton);
			downloadButton.after(loader);
			
			mediaNode.parentNode.style.display = "flex";
		}
		
		// Insert Download Button under the image/video
		// This media must be an Instagram post, and only consider in news feed
		if (!isInstPost(mediaNode) || location.pathname !== '/')
			return;
		const favoriteButtonContainer = getFavoriteButton(mediaNode);
		if (!favoriteButtonContainer)
			return;
		downloadButton = favoriteButtonContainer.getAttribute("button");
		if (!downloadButton) {
			downloadButton = createDownloadButton({
				media: mediaNode,
				dlIcon: iconBlack,
				mouseEnterOp: '0.7',
				mouseLeaveOp: '1.0',
				btnClass: IDFI_BUTTON_UNDER
			});
			let loader = createDownloadLoader(mediaNode);
			favoriteButtonContainer.setAttribute('button', IDFI_BUTTON);
			favoriteButtonContainer.insertBefore(downloadButton, favoriteButtonContainer.childNodes[0]);
			downloadButton.after(loader);
		}
	})
};

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


async function receiveNewVideoData(currentVideoData) {
	let newVideoData = await fetchAdditionalData();
	newVideoData = extractVideoData(newVideoData);
	newVideoData = newVideoData
		.filter(video => !currentVideoData.find(video1 => video1.video_url === video.url));
		
	return [...currentVideoData].concat(newVideoData);
}

async function process() {
	const storageData = await chrome.storage.local.get({ [KEY_APP_STATE]: true});
	appState = storageData[KEY_APP_STATE];
	
	videoData = await receiveNewVideoData(videoData)
	load();
	loadBulkDownloadUI();
	window.addEventListener('message', function(event) {
		if (event.data && event.data.type === 'videoData')
			videoData = videoData.concat(event.data.videoData);
	});
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
	if (areaName === 'local' && changes[KEY_APP_STATE]) {
		appState = changes[KEY_APP_STATE].newValue;
		setUiVisible(appState);
	}
})

process();



