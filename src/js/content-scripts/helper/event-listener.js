import { MESSAGE_DOWNLOAD_ALL, MESSAGE_GET_IMAGES_TO_SHOW_ON_POPUP } from 'js/constants';
import {handleDownloadAll, getAllImageOnPage} from './dom'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.type) {
		case MESSAGE_GET_IMAGES_TO_SHOW_ON_POPUP:
			sendResponse({ payload: getAllImageOnPage() })
			break;
		case MESSAGE_DOWNLOAD_ALL:
			try {
				handleDownloadAll();
				sendResponse({ type: MESSAGE_DOWNLOAD_ALL })
			} catch (e) {
				console.log(e)
			}
			break;
		default:
			break;
	}
	return true;
})
