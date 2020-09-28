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

async function sendMessageToActiveTab(message) {
	const activeTabs = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});
	const response = await chrome.tabs.sendMessage(activeTabs[0].id, message)
	return response;
}

function plural(text, counter) {
	return counter < 2 ? text : text + 's';
}

module.exports = {
	fetchAdditionalData,
	fetchSingleNodeData,
	sendMessageToActiveTab,
	plural
}

