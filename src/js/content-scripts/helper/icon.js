const iconPath = 'asset/img/';
const SystemUpdateAltIcon = {
	main: chrome.runtime.getURL(`${iconPath}download_black_bold.svg`),
	under: chrome.runtime.getURL(`${iconPath}download_black.svg`)
};
const SystemUpdateIcon = {
	main: chrome.runtime.getURL(`${iconPath}system_update-black-48dp.svg`),
	under: chrome.runtime.getURL(`${iconPath}system_update-black-outline-48dp.svg`),
	style: {
		'margin-top': '3px'
	}
};
const GetAppIcon = {
	main: chrome.runtime.getURL(`${iconPath}get_app-black-48dp.svg`),
	under: chrome.runtime.getURL(`${iconPath}get_app-black-outline-48dp.svg`),
	style: {
		'margin-top': '3px'
	}
};
const CloudDownloadIcon = {
	main: chrome.runtime.getURL(`${iconPath}cloud_download-black-48dp.svg`),
	under: chrome.runtime.getURL(`${iconPath}cloud_download-black-outline-48dp.svg`),
	style: {
		'margin-top': '1px'
	}
};

export const mapIconNameToUrl = {
	SystemUpdateAltIcon,
	SystemUpdateIcon,
	GetAppIcon,
	CloudDownloadIcon
}
