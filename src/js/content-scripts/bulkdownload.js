import { TOPRIGHT_NAV_CLASSNAME,
	IDFI_BUTTON_DOWNLOAD_ALL
} from '../constants';
import('bootstrap');
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
			
			container.onclick = handleClick;
		}, 500)
	})
}

const popupHtml = `
<div class="card text-center">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <div class="card-footer text-muted">
    2 days ago
  </div>
</div>`;

function handleClick(event) {
	const container = document.createElement('div');
	container.innerHTML = popupHtml;
	this.after(container);
}
