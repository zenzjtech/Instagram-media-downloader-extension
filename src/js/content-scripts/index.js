import { MSG_DOWNLOAD_FILE } from '../constants';
require('./inject');

const load = function () {observer.observe(document.body, {"childList": true, "subtree": true})};

const icon = chrome.runtime.getURL('download.png');

const getHighestResolutionImg = image => {
	if (image.srcset) {
		const imgset = image.srcset.split(',');
		const lastImage = imgset[imgset.length - 1];
		return lastImage.split(' ')[0];
	}
	return image && image.src ? image.src : '';
}

function getVideoOrImage(media) {
	// if this post is a video
	if (media.tagName === 'VIDEO') {
		const source = media.querySelector('source');
		return source.src;
	}
	let src = media && media.src ? media.src : '';
	// If this post is a reference to a video
	const found = videoData.find(data => data.thumbnail_src === src);
	if (found)
		return found.video_url;
	// Else this is an image
	return getHighestResolutionImg(media);
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

const action = function () {
	const images = Array.from(document.querySelectorAll("img"));
	const videos = Array.from(document.querySelectorAll('video'));
	const media = images.concat(videos);
	media.forEach(image => {
		let button = image.getAttribute("button");
		if (!button) {
			image.setAttribute("button", "IDFI-BUTTON");
			/*  */
			button = document.createElement("span");
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
				
				const parent = this.parentNode.parentNode;
				const media = parent.querySelector("video") || parent.querySelector('img');
				const src = getVideoOrImage(media);
				if (src)
					chrome.runtime.sendMessage({
						type: MSG_DOWNLOAD_FILE,
						payload: src
					}, function(response) {
						console.log(response);
					})
			});
			/*  */
			image.parentNode.appendChild(button);
			image.parentNode.style.display = "flex";
		}
	})
};

load();

let videoData = [];
window.addEventListener('message', function(event) {
	if (event.data && event.data.type === 'videoData')
		videoData = event.data.videoData;
})
