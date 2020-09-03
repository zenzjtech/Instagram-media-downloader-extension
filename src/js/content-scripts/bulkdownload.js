import { TOPRIGHT_NAV_CLASSNAME,
	IDFI_BUTTON_DOWNLOAD_ALL
} from '../constants';
require('bootstrap');
import $ from 'jquery';

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
			// Check if the btn already exists
			let container = topRightNav.querySelector(`[type="${IDFI_BUTTON_DOWNLOAD_ALL}"]`);
			if (container)
				return;
			
			container = document.createElement('div');
			const bulkDownloadIconPath = chrome.runtime.getURL('asset/img/download_all_square.svg');
			const img = document.createElement('div');
			img.style.backgroundImage = `url(${bulkDownloadIconPath})`;
			img.className = 'download-all';
			container.appendChild(img);
			container.className = topRightNav.firstElementChild.className;
			container.setAttribute('data-toggle', 'tooltip');
			container.setAttribute('data-placement', 'bottom');
			container.setAttribute('title', 'Click to bulk download')
			container.setAttribute('type', IDFI_BUTTON_DOWNLOAD_ALL);
			
			topRightNav.appendChild(container);
			
			container.onclick = function() {
			
			}
		}, 500)
	})
}
