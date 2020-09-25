require('chrome-extension-async');
require('./inject');
require('./helper/event-listener')

import {
	IDFI_BUTTON_LOADER,
	IDFI_BUTTON, KEY_APP_VISIBILITY,
	IDFI_BUTTON_UNDER,
	KEY_APP_IMAGE_RESOLUTION,
	KEY_APP_ICON_POSITION,
	ICON_POSITION_UNDER,
	ICON_POSITION_TOPLEFT,
	ICON_POSITION_TOPRIGHT,
	ICON_POSITION_BOTTOMLEFT,
	ICON_POSITION_BOTTOMRIGHT,
	KEY_LOCALSTORAGE_IMAGE_RESOLUTION,
	IMAGE_RESOLUTION, KEY_APP_ICON_TYPE,
	ICON_TYPE_SYSTEM_UPDATE_ALT,
	IDFI_BUTTON_DOWNLOAD_ALL, MESSAGE_URL_CHANGE
} from '../constants'
// import { loadBulkDownloadUI } from './bulkdownload';
require('./bulkdownload')
import {
	isInstPost,
	createDownloadLoader,
	getMediaNode,
	createDownloadButton,
	getFavoriteButton,
	receiveNewVideoData,
	isAllowedUnderBtn,
	mapIconNameToUrl
} from './helper/'

let oldHref = document.location.href;
let videoData = [];
let appState = {
	[KEY_APP_ICON_POSITION]: 'under'
};


const load = function () {
	observer.observe(document.body, {
		"childList": true,
		"subtree": true
	})
};

const updateVisibility = (show = true) => {
	let elements = document.querySelectorAll(`[type='${IDFI_BUTTON}']`);
	elements = Array.from(elements).filter(element => element.getAttribute("name") !== IDFI_BUTTON_LOADER)
	elements.forEach(element => {
		element.style.visibility = show ? 'visible' : 'hidden';
	})
}

const changeIconType = (iconName) => {
	let elements = document.querySelectorAll(`[type='${IDFI_BUTTON}']`);
	elements = Array.from(elements)
		.filter(element =>
			element.getAttribute("name") !== IDFI_BUTTON_LOADER &&
			element.getAttribute("name") !== IDFI_BUTTON_DOWNLOAD_ALL
		);
	elements.forEach(element => {
		element.style.backgroundImage = element.classList.contains(IDFI_BUTTON_UNDER) ?
			`url(${mapIconNameToUrl[iconName].under})` : `url(${mapIconNameToUrl[iconName].main})`;
	})
}
function changeDownloadIconPosition(position) {
	const inImagePosition = [
		ICON_POSITION_TOPRIGHT,
		ICON_POSITION_TOPLEFT,
		ICON_POSITION_BOTTOMRIGHT,
		ICON_POSITION_BOTTOMLEFT
	]
	
	if (position === ICON_POSITION_UNDER) {
		// Remove SytemDownloadAltIcon whose type is within the image
		if (!isAllowedUnderBtn())
			return;
		inImagePosition.forEach(pos => {
			Array.from(document.getElementsByClassName(pos))
				.forEach(btn => btn.style.display = 'none')
		});
		Array.from(document.getElementsByClassName(position))
			.forEach(btn => btn.style.display = 'unset');
		return;
	}
	
	// Otherwise, First, remove the under-image download button
	Array.from(document.getElementsByClassName(ICON_POSITION_UNDER))
		.forEach(btn => btn.style.display = 'none');
	// Then, update the position of in-image btns
	
	inImagePosition
		.forEach(pos => {
			Array.from(document.getElementsByClassName(pos)).forEach(btn => {
				btn.classList.remove(pos);
				btn.classList.add(position)
				btn.style.display = 'block';
			})
		});
	
}

function handleUrlChange() {
	window.postMessage({ type: MESSAGE_URL_CHANGE} , '*');
	//loadBulkDownloadUI();
	oldHref = document.location.href;
	(async () => {
		videoData = await receiveNewVideoData(videoData);
	})();
}

const observer = new MutationObserver(function (m) {
	for (let i = 0; i < m.length; i++) {
		if (oldHref !== document.location.href) {
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
					}
					if (type && type.indexOf(IDFI_BUTTON) !== -1 && name !== IDFI_BUTTON_LOADER)
						tmp.style.visibility = appState[KEY_APP_VISIBILITY] ? 'visible' : 'hidden';
				}
			}
		}
	}
});

const action = function () {
	function setDisplay(downloadButton, loader, display = 'none') {
		downloadButton.style.display = display;
		loader.style.display = display
	}
	function addClassList(downloadButton, loader, className) {
		downloadButton.classList.add(className)
		loader.classList.add(className)
	}
	
	const icon = mapIconNameToUrl[appState[KEY_APP_ICON_TYPE]];
	const videoAndImage = getMediaNode();
	videoAndImage.forEach(mediaNode => {
		// Insert Download Button within the image/video
		let downloadButton = mediaNode.getAttribute("button");
		if (!downloadButton) {
			downloadButton = createDownloadButton({
				media: mediaNode,
				dlIcon: icon.main,
				mouseLeaveOp: '0.3',
				mouseEnterOp: '1.0',
				btnClass: IDFI_BUTTON,
				videoData,
				backgroundSize: '25px'
			});
			let loader = createDownloadLoader(mediaNode);
			mediaNode.after(downloadButton);
			if (appState[KEY_APP_ICON_POSITION] === ICON_POSITION_UNDER) {
				if (isAllowedUnderBtn())
					setDisplay(downloadButton, loader, 'none')
				// Just add a random postion amongst 4 possible corner, so that it will be recognized
				addClassList(downloadButton, loader, ICON_POSITION_TOPLEFT)
			} else
				addClassList(downloadButton, loader, appState[KEY_APP_ICON_POSITION])
			downloadButton.after(loader);
			mediaNode.parentNode.style.display = "flex";
		}
		
		// Insert Download Button under the image/video
		// This media must be an Instagram post, and only consider in news feed, and media detail page
		if (!isInstPost(mediaNode) || !isAllowedUnderBtn())
			return;
		const favoriteButtonContainer = getFavoriteButton(mediaNode);
		if (!favoriteButtonContainer)
			return;
		downloadButton = favoriteButtonContainer.getAttribute("button");
		if (!downloadButton) {
			downloadButton = createDownloadButton({
				media: mediaNode,
				dlIcon: icon.under,
				mouseEnterOp: '0.7',
				mouseLeaveOp: '1.0',
				btnClass: IDFI_BUTTON_UNDER,
				backgroundSize: '35px',
				videoData
			});
			// Set custom style
			if (icon.style) {
				Object.entries(icon.style).forEach(([key, val]) => {
					downloadButton.style[key] = val;
				})
			}
			let loader = createDownloadLoader(mediaNode);
			favoriteButtonContainer.setAttribute('button', IDFI_BUTTON);
			favoriteButtonContainer.insertBefore(downloadButton, favoriteButtonContainer.childNodes[0]);
			if (appState[KEY_APP_ICON_POSITION] !== ICON_POSITION_UNDER)
				setDisplay(downloadButton, loader, 'none')
			
			addClassList(downloadButton, loader, ICON_POSITION_UNDER)
			downloadButton.after(loader);
		}
	})
};

async function process() {
	appState = await chrome.storage.sync.get({
		[KEY_APP_VISIBILITY]: true,
		[KEY_APP_IMAGE_RESOLUTION]: 1080,
		[KEY_APP_ICON_POSITION]: ICON_POSITION_UNDER,
		[KEY_APP_ICON_TYPE]: ICON_TYPE_SYSTEM_UPDATE_ALT
	});
	
	videoData = await receiveNewVideoData(videoData)
	load();
	//loadBulkDownloadUI();
	window.addEventListener('message', function(event) {
		if (event.data && event.data.type === 'videoData')
			videoData = videoData.concat(event.data.videoData);
	});
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
	[
		KEY_APP_VISIBILITY,
		KEY_APP_ICON_POSITION,
		KEY_APP_IMAGE_RESOLUTION,
		KEY_APP_ICON_TYPE
	].forEach(key => {
		if (changes[key]) {
			appState[key] = changes[key].newValue;
			switch (key) {
				case KEY_APP_VISIBILITY:
					updateVisibility(appState[key]);
					break;
				case KEY_APP_ICON_POSITION:
					changeDownloadIconPosition(appState[key])
					break;
				case KEY_APP_IMAGE_RESOLUTION:
					localStorage.setItem(
						KEY_LOCALSTORAGE_IMAGE_RESOLUTION,
						IMAGE_RESOLUTION[appState[key]].toString()
					)
					break;
				case KEY_APP_ICON_TYPE:
					changeIconType(appState[key])
					break;
				default:
			}
		}
	})
})

process();



