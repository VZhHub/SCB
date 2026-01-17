import {dom} from "./dom.js";
dom.buildInfoTabPanel.addEventListener("click", e => switchTabs(e));
function switchTabs(e) {
	const button = e.target.closest("button");
	if (button) {
		for (const i of dom.buildInfoTabs) i.classList.remove("info-win-tabs__tab--selected");
		button.classList.add("info-win-tabs__tab--selected");
		showInfoWindow(button);
	}
}
function showInfoWindow(e) {
	for (const i of dom.infoWindows) i.classList.add("hidden");
	dom.infoWindowsWrapper.querySelector(e.dataset.infoTab).classList.remove("hidden");
}
function toggleTitle(container) {
	document.querySelector(`${container} .nothing-there-yet`).classList.toggle("hidden");
}
export {toggleTitle};