import { TOPRIGHT_NAV_CLASSNAME,
	IDFI_BUTTON_DOWNLOAD_ALL,
	DOWNLOAD_ALL_MODAL_CLASSNAME
} from '../constants';
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
			
			const bulkDownloadIconPath = chrome.runtime.getURL('asset/img/download_all_square.svg');
			const img = document.createElement('div');
			img.style.backgroundImage = `url(${bulkDownloadIconPath})`;
			img.className = 'download-all';
			
			container = document.createElement('div');
			container.className = topRightNav.firstElementChild.className;
			container.setAttribute('title', 'Click to bulk download')
			container.setAttribute('type', IDFI_BUTTON_DOWNLOAD_ALL);
			container.setAttribute('data-toggle', 'tooltip');
			container.setAttribute('data-placement', 'right');
			
			
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
    <h5 class="card-title">${noMedia} posts found in this page</h5>
    <p class="card-text">Click below to download all of them.</p>
    <a href="#" class="btn btn-primary"
    style="color: white;border-radius: 50px;
    margin-top: 15px;
    color: white;
    width: 50%;
    font-size: 95%;
    background-color: rgb(56, 151, 240);"
    >Download all</a>
  </div>
  <div class="card-footer">
<button
type="button" class="close" aria-label="Close"
onclick="this.parentElement.parentElement.style.display='none'"
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
	popupContainer.setAttribute('type', IDFI_BUTTON_DOWNLOAD_ALL);
	popupContainer.innerHTML = popupHtml();
	currentElement.after(popupContainer);
	return popupContainer;
}
function handleClick(event) {
	const downloadAllPopup = createDownloadAllPopup(this);
	downloadAllPopup.style.display = downloadAllPopup.style.display === 'none' ? 'block' : 'none';
}
