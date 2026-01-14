const buildInfoTabPanel = document.querySelector(".char-info-tabs");
const buildInfoTabs = document.querySelectorAll(".char-info-tabs__tab");
const infoWindowsWrapper = document.querySelector(".char-info-wrapper");
const infoWindows = document.querySelectorAll(".char-info-wrapper > section");
buildInfoTabPanel.addEventListener("click", e => switchTabs(e));
function switchTabs(e) {
	const button = e.target.closest("button");
	if (button) {
		for (let i of buildInfoTabs) i.classList.remove("char-info-tabs__tab--selected");
		button.classList.add("char-info-tabs__tab--selected");
		showInfoWindow(button);
	}
}
function showInfoWindow(e) {
	const tabName = e.dataset.infoTab;
	for (let i of infoWindows) i.classList.add("hidden");
	infoWindowsWrapper.querySelector(tabName).classList.remove("hidden");
}
function toggleTitle(container) {
	document.querySelector(`${container} .nothing-there-yet`).classList.toggle("hidden");
}