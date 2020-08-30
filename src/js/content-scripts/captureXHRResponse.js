const capturedUrlPatterns = [
	'?__a=1',
	'graphql/query/?query_hash='
];

const checkUrlPattern = (url) => {
	if (!url)
		return false;
	return capturedUrlPatterns.find(pattern => url.includes(pattern)) !== undefined;
}

(function(xhr) {
	
	console.log('Inside capture XHR Response');
	var XHR = XMLHttpRequest.prototype;
	
	var open = XHR.open;
	var send = XHR.send;
	var setRequestHeader = XHR.setRequestHeader;
	
	XHR.open = function(method, url) {
		this._url = url;
		return open.apply(this, arguments);
	};
	
	XHR.setRequestHeader = function(header, value) {
		return setRequestHeader.apply(this, arguments);
	};
	
	XHR.send = function(postData) {
		
		this.addEventListener('load', function() {
			
			var myUrl = this._url ? this._url.toLowerCase() : this._url;
			if (checkUrlPattern(myUrl)) {
					const postData = JSON.parse(this.responseText).data;
					filterVideoData(postData);
					window.postMessage({ type: 'videoData', videoData} , '*');
				}
		});
		
		return send.apply(this, arguments);
	};
	
})(XMLHttpRequest);

let videoData = [];
function filterVideoData(data) {
	if (typeof data !== 'object' || data === null)
		return;
	if (data.video_url && !videoData.find(video => video.video_url === data.video_url))
		videoData.push({
			video_url: data.video_url,
			thumbnail_src: data.thumbnail_src
		})
	Object.entries(data).forEach(([key, value]) => {
		filterVideoData(value);
	});
}

