function getDownloadedMedia() {
	return Array.from(document.getElementsByTagName('img'))
		.filter(media => media.srcset !== '' && media.alt !== 'Instagram');
}

getDownloadedMedia();
