/**
 * code in inject.js
 * added "web_accessible_resources": ["injected.js"] to manifest.json
 */
var s = document.createElement('script');
s.src = chrome.extension.getURL('captureXHRResponse.js');
s.onload = function() {
	this.remove();
};
(document.head || document.documentElement).appendChild(s);
