import { handleResponse } from '../utils';

const fetchAdditionalData = async () => {
	const postFix = '?__a=1'
	try {
		let response = await fetch(`${document.URL}${postFix}`).then(handleResponse);
		return response;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	fetchAdditionalData
}
