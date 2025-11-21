const searchField = document.querySelector(".items-window__search");
const clearSearchButton = document.querySelector(".items-window__clear-search");
let timer;
searchField.addEventListener("input", e => {
	clearTimeout(timer);
	timer = setTimeout(() => searchItem(e), 300);
});
clearSearchButton.addEventListener("click", () => clearSearch());
function clearSearch(justClear = false) {
	searchField.value = "";
	if (justClear) return;
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	const show = [];
	for (let i of arr) {
		if (!i.inFilter && !i.equipped) {
			show.push(i.card);
		}
	}
	requestAnimationFrame(() => {
		for (let c of show) c.classList.remove("hidden");
	});
}
function searchItem(event) {
	const guess = event.target.value;
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	const hide = [], show = [];
	if (guess === "") {
		for (let i of arr) {
			if (!i.inFilter) {
				show.push(i.card);
			}
		}
		requestAnimationFrame(() => {
			for (let c of show) c.classList.remove("hidden");
		});
		return;
	}
	const pattern = /\S+/g;
	const result = guess.toUpperCase().match(pattern);
	for (let i of arr) {
		if (!i.inFilter) {
			if (result.every(e => i.name.toUpperCase().includes(e))) {
				show.push(i.card);
			} else {
				hide.push(i.card);
			}
		}
	}
	requestAnimationFrame(() => {
		for (let c of hide) c.classList.add("hidden");
		for (let c of show) c.classList.remove("hidden");
	});
}