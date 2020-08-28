import { MSG_DOWNLOAD_FILE } from '../constants';

const icon = chrome.runtime.getURL('download.png');
const load = function () {observer.observe(document.body, {"childList": true, "subtree": true})};

const clean = function () {
	observer.disconnect();
	/*  */
	const elements = [...document.querySelectorAll("span[class='IDFI-BUTTON']")];
	for (let i = 0; i < elements.length; i++) {
		if (elements[i]) elements[i].remove();
	}
};

const observer = new MutationObserver(function (m) {
	for (let i = 0; i < m.length; i++) {
		const mutation = m[i];
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			for (let j = 0; j < mutation.addedNodes.length; j++) {
				const tmp = mutation.addedNodes[j];
				if (tmp.nodeType === Node.ELEMENT_NODE) {
					const type = tmp.getAttribute("type");
					if (!type || (type && type.indexOf("DFI-BUTTON") === -1))
						action(true);
				}
			}
		}
	}
});

const action = function () {
	const images = document.querySelectorAll("img");
	images.forEach(image => {
		let button = image.getAttribute("button");
		if (!button) {
			image.setAttribute("button", "IDFI-BUTTON");
			/*  */
			button = document.createElement("span");
			button.setAttribute("type", "IDFI-BUTTON");
			button.setAttribute("class", "IDFI-BUTTON");
			button.setAttribute("title", "Download Image");
			button.style.background = `#FFF no-repeat center center`;
			button.style.backgroundImage = `url(${icon})`
			button.style.backgroundSize = "16px";
			/*  */
			button.addEventListener("mouseenter", function () {this.style.opacity = "1.0"});
			button.addEventListener("mouseleave", function () {this.style.opacity = "0.3"});
			/*  */
			button.addEventListener("click", function (e) {
				e.preventDefault();
				e.stopPropagation();
				/*  */
				const parent = this.parentNode.parentNode;
				const image = parent.querySelector("img");
				const src = image && image.src ? image.src : '';
				if (src)
					chrome.runtime.sendMessage({
						type: MSG_DOWNLOAD_FILE,
						payload: src
					}, function(response) {
						console.log(response);
					})
			});
			/*  */
			image.parentNode.appendChild(button);
			image.parentNode.style.display = "flex";
		}
	})
};

load();
