import { MESSAGE_DOWNLOAD_ALL } from 'js/constants';
import {handleDownloadAll, getDownloadMediaForPopupAction, debounce} from './dom'
import {MESSAGE_DOCUMENT_SCROLL} from '../../constants'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.type) {
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
