export function isAtNewsFeedPage() {
	return location.pathname === '/';
}

export function isAtStoriesPage() {
	return location.pathname.includes('/stories/')
}

export function isAtHomepage() {
	return !isAtNewsFeedPage() && !isAtStoriesPage() && !isAtExplorePage() && isAtInboxPage();
}

export function isAtInboxPage() {
	return location.pathname.includes('/inbox/');
}

export function isAtExplorePage() {
	return location.pathname.includes('/explore/');
}
