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

function insertScript(src, integrity) {
	const script = document.createElement('script');
	script.scr = src;
	script.crossOrigin = 'anonymous';
	script.integrity = integrity;
	s.onload = function() {
		this.remove();
	};
	(document.body || document.documentElement).appendChild(s);
}

insertScript('https://code.jquery.com/jquery-3.3.1.slim.min.js', 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo');
insertScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', 'sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1');
insertScript('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', 'sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM');

