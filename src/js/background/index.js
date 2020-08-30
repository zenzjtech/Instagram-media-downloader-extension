import { MSG_DOWNLOAD_FILE } from '../constants'

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

chrome.webRequest.onCompleted.addListener(function (details) {
		console.log(details);
	}, { urls: ["*://*.instagram.com/graphql/query/?query_hash=*"]}
)
