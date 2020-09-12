import {
	TOPRIGHT_NAV_CLASSNAME,
	DOWNLOAD_ALL_MODAL_CLASSNAME, MSG_DOWNLOAD_FILE, IDFI_BUTTON, IDFI_BUTTON_DOWNLOAD_ALL
} from '../constants'
import $ from 'jquery';
import {getMediaSrcAtHomePageOrFeed} from './helper'

export function loadBulkDownloadUI() {
	let counter = 0;
	$(function() {
		let t = setInterval(function() {
			counter += 1;
			if (counter == 5) {
				clearInterval(t);
				return;
			}
			const topRightNav = document.getElementsByClassName(TOPRIGHT_NAV_CLASSNAME)[0];
			if (!topRightNav)
				return;
			// Check if the btn already exists
			let container = topRightNav.querySelector(`[name="${IDFI_BUTTON_DOWNLOAD_ALL}"]`);
			if (container)
				return;
			
			const bulkDownloadIconPath = chrome.runtime.getURL('asset/img/download_all_square.svg');
			const img = document.createElement('div');
			img.style.backgroundImage = `url(${bulkDownloadIconPath})`;
			img.className = 'download-all';
			img.setAttribute('type', IDFI_BUTTON);
			
			container = document.createElement('div');
			container.className = topRightNav.firstElementChild.className;
			container.setAttribute('type', IDFI_BUTTON);
			container.setAttribute('name', IDFI_BUTTON_DOWNLOAD_ALL);
			
			container.appendChild(img);
			topRightNav.appendChild(container);
			
			img.onclick = handleClick;
		}, 500)
	})
}

const popupHtml = (noMedia = 0) => `
<div class="card text-center">
  <div class="card-header">
    Bulk posts download feature
  </div>
  <div class="card-body"
    style="display: flex;
    flex-direction: column;
    align-items: center;"
    >
    <h5 class="card-title"><strong>${noMedia}</strong> posts found in this page</h5>
    <p class="card-text">Click below to download all of them.</p>
    <button id="download-all-btn" class="btn btn-primary"
    style="color: white;border-radius: 50px;
    margin-top: 15px;
    color: white;
    width: 50%;
    font-size: 95%;
    background-color: rgb(56, 151, 240);"
    >Download all</button>
  </div>
  <div class="card-footer">
<button
type="button" class="close" aria-label="Close"
onclick="this.parentElement.parentElement.parentElement.style.display='none'"
>
  <span aria-hidden="true" style="float: right" class="text-danger">&times;</span>
</button>
</div>
</div>`;

function createDownloadAllPopup(currentElement) {
	let popupContainer = document.getElementsByClassName(DOWNLOAD_ALL_MODAL_CLASSNAME);
	if (popupContainer.length) {
		return popupContainer[0];
	}
	
	popupContainer = document.createElement('div');
	popupContainer.className = DOWNLOAD_ALL_MODAL_CLASSNAME;
	popupContainer.setAttribute('type', IDFI_BUTTON);
	currentElement.after(popupContainer);
	return popupContainer;
}

function getDownloadedMedia() {
	return Array.from(document.getElementsByTagName('img'))
		.filter(media => media.srcset !== '' && media.alt !== 'Instagram');
}

function handleDownloadAll() {
	const downloadedMedia = getDownloadedMedia();
	downloadedMedia.forEach(media => {
		const src = getMediaSrcAtHomePageOrFeed(media, []);
		if (src) {
			chrome.runtime.sendMessage({
				type: MSG_DOWNLOAD_FILE,
				payload: src
			}, function (response) {
				console.log(response);
			})
		}
	})
}

function handleClick(event) {
	const downloadAllPopup = createDownloadAllPopup(this);
	downloadAllPopup.innerHTML = popupHtml(getDownloadedMedia().length);
	downloadAllPopup.style.display = downloadAllPopup.style.display === 'block' ? 'none' : 'block';
	document.getElementById('download-all-btn').onclick = handleDownloadAll;
}

