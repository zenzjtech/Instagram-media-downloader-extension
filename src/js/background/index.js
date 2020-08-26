import { MSG_DOWNLOAD_FILE } from '../constants'
console.log(MSG_DOWNLOAD_FILE);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.type) {
		case MSG_DOWNLOAD_FILE:
			chrome.downloads.download({url: request.payload}, function(downloadId) {
				sendResponse(downloadId);
			});
			break;
		default:
			break;
	}
	return true;
})
