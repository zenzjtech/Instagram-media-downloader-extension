import { MSG_DOWNLOAD_FILE, IGTV_CLASSNAME_IDENTIFIER,
	TAGGED_CLASSNAME_IDENTIFIED,
	LOADER_CLASSNAME,
	DOWNLOADER_CLASSNAME
} from '../constants';
import { fetchAdditionalData, fetchSingleNodeData } from '../utils/';
require('./inject');
require('./bulkdownload')

let oldHref = document.location.href;
const load = function () {observer.observe(document.body, {"childList": true, "subtree": true})};

const icon = chrome.runtime.getURL('asset/img/download.png');
const getHighestResolutionImg = image => {
	if (image.srcset) {
		const imgset = image.srcset.split(',');
		const lastImage = imgset[imgset.length - 1];
		return lastImage.split(' ')[0];
	}
	return image && image.src ? image.src : '';
}

function getVideoOrImageSrc(media) {
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

async function getMediaSrc(node) {
	const containerNode = node.parentElement.parentElement;
	// If this node is in IGTV
	if (node.className === IGTV_CLASSNAME_IDENTIFIER) {
		const data = await loadingWrapper(
			fetchSingleNodeData,
			containerNode,
			containerNode.href
		);
		currentNodeVideoUrl = '';
		findVideoUrl(data);
		console.log(currentNodeVideoUrl, data);
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
			currentNodeVideoUrl = '';
			findVideoUrl(data);
			console.log(currentNodeVideoUrl, data);
			return currentNodeVideoUrl;
		}
	}
	// Homepage or feed
	const src = getVideoOrImageSrc(node);
	return src;
}

const clean = function () {
	observer.disconnect();
	/*  */
	const elements = [...document.querySelectorAll("span[class='IDFI-BUTTON']")];
	for (let i = 0; i < elements.length; i++) {
		if (elements[i]) elements[i].remove();
	}
};

const observer = new MutationObserver(function (m) {
	for (let i = 0; i < m.length; i++) {
		if (oldHref != document.location.href) {
			oldHref = document.location.href;
			fetchAdditionalData().then(data => {
				console.log(videoData);
				return filterVideoData(data);
			}).then(() => {console.log(videoData)});
		}
		const mutation = m[i];
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			for (let j = 0; j < mutation.addedNodes.length; j++) {
				
				const tmp = mutation.addedNodes[j];
				if (tmp.nodeType === Node.ELEMENT_NODE) {
					const type = tmp.getAttribute("type");
					if (!type || (type && type.indexOf("DFI-BUTTON") === -1))
						action(true);
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

function createButton(media) {
	media.setAttribute("button", "IDFI-BUTTON");
	/*  */
	let button = document.createElement("span");
	button.setAttribute("type", "IDFI-BUTTON");
	button.setAttribute("class", "IDFI-BUTTON");
	button.setAttribute("title", "Download Image");
	button.style.background = `#FFF no-repeat center center`;
	button.style.backgroundImage = `url(${icon})`
	button.style.backgroundSize = "16px";
	/*  */
	button.addEventListener("mouseenter", function () {this.style.opacity = "1.0"});
	button.addEventListener("mouseleave", function () {this.style.opacity = "0.3"});
	/*  */
	button.addEventListener("click", async function (e) {
		e.preventDefault();
		e.stopPropagation();
		/*  */
		const src = await getMediaSrc(this.previousElementSibling);
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

function createLoader() {
	let loader = document.createElement('div');
	loader.innerHTML = '<div></div><div></div>';
	loader.className = LOADER_CLASSNAME;
	return loader;
}

// TODO: hangle generic args
async function loadingWrapper(func, node, args) {
	const loader = node.getElementsByClassName(LOADER_CLASSNAME)[0];
	const downloadBtn = node.getElementsByClassName(DOWNLOADER_CLASSNAME)[0];
	if (loader) {
		loader.style.visibility = 'visible';
	}
	downloadBtn.style.visibility = 'hidden';
	const result = await func(args);
	loader.style.visibility = 'hidden';
	downloadBtn.style.visibility = 'visible';
	return result;
}

const action = function () {
	const videoAndImage = getMediaNode();
	videoAndImage.forEach(media => {
		let button = media.getAttribute("button");
		if (!button) {
			button = createButton(media);
			const loader = createLoader(media);
			/*  */
			media.after(button);
			button.after(loader);
			media.parentNode.style.display = "flex";
		}
	})
};

load();

let videoData = [];

function filterVideoData(data) {
	if (typeof data !== 'object' || data === null)
		return;
	if (data.video_url && !videoData.find(video => video.video_url === data.video_url))
		videoData.push({
			video_url: data.video_url,
			thumbnail_src: data.thumbnail_src
		})
	Object.entries(data).forEach(([key, value]) => {
		filterVideoData(value);
	});
}

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

fetchAdditionalData().then(data => {
	console.log(videoData);
	return filterVideoData(data);
	console.log(data);
}).then(() => {console.log(videoData)});

window.addEventListener('message', function(event) {
	if (event.data && event.data.type === 'videoData')
		videoData = videoData.concat(event.data.videoData);
})
