import { TOPRIGHT_NAV_CLASSNAME,
	TOPRIGHT_NAV_ELEMENT_CLASSNAME,
	TYPE_BULKDOWNLOAD_ICON
} from '../constants';
import $ from 'jquery';

function generateBulkdownloadIcon() {
	const topRightNav = document.getElementsByClassName(TOPRIGHT_NAV_CLASSNAME)[0];
	// Check if the btn already exists
	let container = topRightNav.querySelector(`[Type="${TYPE_BULKDOWNLOAD_ICON}"]`);
	if (container)
		return;
	
	container = document.createElement('div');
	const bulkDownloadIconPath = chrome.runtime.getURL('asset/img/download_all.svg');
	const img = document.createElement('div');
	img.style.backgroundImage = `url(${bulkDownloadIconPath})`;
	img.className = 'download-all';
	container.appendChild(img);
	container.className = topRightNav.firstElementChild.className;
	container.setAttribute('Type', TYPE_BULKDOWNLOAD_ICON);
	
	topRightNav.appendChild(container);
}

$(function () {
	generateBulkdownloadIcon();
})
