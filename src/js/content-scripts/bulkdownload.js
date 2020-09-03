import { TOPRIGHT_NAV_CLASSNAME,
	TYPE_BULKDOWNLOAD_ICON
} from '../constants';
import $ from 'jquery';
require('bootstrap');

function loadUI() {
	const topRightNav = document.getElementsByClassName(TOPRIGHT_NAV_CLASSNAME)[0];
	// Check if the btn already exists
	let container = topRightNav.querySelector(`[Type="${TYPE_BULKDOWNLOAD_ICON}"]`);
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
	container.setAttribute('Type', TYPE_BULKDOWNLOAD_ICON);
	
	topRightNav.appendChild(container);
	
	container.onclick = function() {
	
	}
}

$(function () {
	loadUI();
})
