export function isAtNewsFeedPage() {
	return location.pathname === '/';
}

export function isAtStoriesPage() {
	return location.pathname.includes('/stories/')
}

export function isAtHomepage() {
	return !isAtNewsFeedPage()
		&& !isAtStoriesPage()
		&& !isAtExplorePage()
		&& !isAtInboxPage()
		&& !isAtMediaDetailPage();
}

export function isAtInboxPage() {
	return location.pathname.includes('/inbox/');
}

export function isAtExplorePage() {
	return location.pathname.includes('/explore/');
}

export function isAtMediaDetailPage() {
	return location.pathname.includes('/p/')
}

export function isAtIGTVDetailPage() {
	return location.pathname.includes('/tv/')
}

export function isAllowedUnderBtn() {
	return isAtNewsFeedPage() || isAtMediaDetailPage() || isAtIGTVDetailPage()
}
