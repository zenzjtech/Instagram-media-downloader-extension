require('chrome-extension-async');
require('./inject');

import {
	IDFI_BUTTON_LOADER,
	IDFI_BUTTON, KEY_APP_STATE,
	IDFI_BUTTON_UNDER
} from '../constants'
import { loadBulkDownloadUI } from './bulkdownload';
import { isInstPost,
	createDownloadLoader,
	getMediaNode,
	createDownloadButton,
	getFavoriteButton,
	receiveNewVideoData
} from './helper';

let oldHref = document.location.href;
let videoData = [];
let appState = true;
const icon = chrome.runtime.getURL('asset/img/download_white.svg');
const iconBlack = chrome.runtime.getURL('asset/img/download_black.svg');

const load = function (appState) {observer.observe(document.body, {"childList": true, "subtree": true})};

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
							tmp.style.visibility = appState ? 'visible' : 'hidden';
				}
			}
		}
	}
});

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
				btnClass: IDFI_BUTTON,
				videoData
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

async function process() {
	const storageData = await chrome.storage.local.get({ [KEY_APP_STATE]: true});
	appState = storageData[KEY_APP_STATE];
	
	videoData = await receiveNewVideoData(videoData)
	load(appState);
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



