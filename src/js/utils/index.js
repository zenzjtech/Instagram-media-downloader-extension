function handleResponse(response) {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			const error = (data && data.message) || response.statusText;
			console.log(error);
			// throw error;
		}
		
		return data;
	});
}

const fetchAdditionalData = async () => {
	const postFix = '?__a=1'
	try {
		console.log(document.URL);
		let response = await fetch(`${document.URL}${postFix}`).then(handleResponse);
		return response;
	} catch (error) {
		console.log(error);
		// throw error;
	}
};

const fetchSingleNodeData = async (url) => {
	const postFix = '?__a=1'
	try {
		let response = await fetch(`${url}${postFix}`).then(handleResponse);
		return response;
	} catch (error) {
		throw error;
	}
}

const getHighestResolutionImg = image => {
	if (image.srcset) {
		const imgset = image.srcset.split(',');
		const lastImage = imgset[imgset.length - 1];
		return lastImage.split(' ')[0];
	}
	return image && image.src ? image.src : '';
}

function getVideoOrImageSrc(media, videoData) {
	// if this post is a video
	if (media.tagName === 'VIDEO') {
		if (media.src)
			return media.src;
		const source = media.querySelector('source');
		return source ? source.src : '';
	}
	let src = media && media.src ? media.src : '';
	// If this post is a reference to a video
	const found = videoData.find(data => data.thumbnail_src === src);
	if (found)
		return found.video_url;
	// Else this is an image
	return getHighestResolutionImg(media);
}

module.exports = {
	getHighestResolutionImg,
	fetchAdditionalData,
	fetchSingleNodeData,
	getVideoOrImageSrc
}
