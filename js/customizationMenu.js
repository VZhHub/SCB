"use strict";
const myVars2 = {
	sortByName: document.querySelector(".items-window__sort-button--by-name"), // пока используется
	sortByWeight: document.querySelector(".items-window__sort-button--by-weight"),
	sortByOther: document.querySelector(".items-window__sort-button--by-other"),
	categoryButtons: document.querySelectorAll("#customizationMenu>div>button"),
	categoryButtonsSkills: document.querySelector(".category-button--skills"),
	sortButtons: document.querySelectorAll(".items-window__sort-button--by-name, .items-window__sort-button--by-weight, .items-window__sort-button--by-other"),
	selectedSortingBtns: document.querySelectorAll("[data-sorting-selected]"), // используется в сортировке, пока не удалять
	sortingDirection: document.querySelectorAll(".sorting-direction"), // пока используется
	filterButton: document.querySelector(".items-window__filter-button"), // пока используется
	checkboxes: document.querySelectorAll(".filter-window input"), // пока используется
	chooseHandContainer: document.querySelector(".equip-options-window"), // пока используется
	cardsList: document.querySelector(".items-window__cards-list"), // используется не только в customization_menu.js, но  в других местах. Перед удалением убедись!
	equippedCards: document.querySelector(".equipped-items"), // пока используется
	//totalPerks: document.querySelector(".total__perks"),
	itemsWindowItems: document.querySelector(".items-window__items"),
	filterWindow: document.querySelector(".filter-window"), // пока используется 
};

// ПРОВЕРЬ ВСЕ ПРОСЛУШИВАТЕЛИ, ЧТОБЫ НЕ ЗАБЫТЬ TOUCHSTART
// Везде, где есть style, постараться заменить на classList

// Одни и те ж функции во множестве циклов
// ВОЗМОЖНО стоит запускать некоторые функции после события load а не при действиях пользователя
myVars2.filterWindow.addEventListener("click", e => {e.stopPropagation();});
	myVars2.itemsWindowItems.addEventListener("click", e => {e.stopPropagation();});
	myVars2.equippedCards.addEventListener("click", e => {e.stopPropagation();});
	myVars2.chooseHandContainer.addEventListener("click", e => {e.stopPropagation();});
if (window.matchMedia("(pointer:fine)").matches) {
	myVars2.sortByName.addEventListener("click", () => {sortBy("name", "nameIndex")});
	myVars2.sortByWeight.addEventListener("click", () => {sortBy("weight", "weightIndex")});
	myVars2.sortByOther.addEventListener("click", () => {sortBy("other", "")});
	myVars2.sortButtons.forEach(e => e.addEventListener("click", selectSortingButton));
	myVars2.filterButton.addEventListener("click", filterToggle);
	for (let i of myVars2.checkboxes) i.addEventListener("click", showChosenFilterOptions);
}


// ОБЯЗАТЕЛЬНО ПРОВЕРЬ ВСЁ - ГДЕ МОЖНО, СОБЕРИ ОБЪЕКТЫ DOM И ВЫНЕСИ В ОБЪЕКТЫ/МАССИВЫ, ЧТОБЫ СОКРАТИТЬ ОБРАЩЕНИЯ К DOM


// Забыл добавить кол-во использования для оружия и посохов!!
// А также из каких материалов, доп.эффект (броня) итд - проверь!!
// Надо это сделать как доп инфу
// А надо ли? Может лучше это всё оставить для оуна статистики?






// СОРТИРОВКА ----------------------------------------------
const activeSortButton = {
	name: true,
	weight: false,
	other: false,
};
function sortBy(type, key) {
	myVars2.cardsList.scrollTop = 0;
	switch (type) {
		case "name":
			areItemsAtoZ.weight[properties.category][properties.type] = false;
			areItemsAtoZ.other[properties.category][properties.type] = false;
		break;
		case "weight":
			areItemsAtoZ.name[properties.category][properties.type] = false;
			areItemsAtoZ.other[properties.category][properties.type] = false;
		break;
		case "other":
			areItemsAtoZ.name[properties.category][properties.type] = false;
			areItemsAtoZ.weight[properties.category][properties.type] = false;
		break;
	}
	const fragment = document.createDocumentFragment();
	const sortingType = areItemsAtoZ[type][properties.category][properties.type];
	const obj = cachedItems[properties.category][properties.type];
	const tempArr = Object.values(obj); 
	if (!key) key = "damageIndex" in tempArr[0] ? "damageIndex" : "armorIndex";
	if (sortingType) {
		tempArr.sort((a, b) => b[key] - a[key]);
	} else {
		tempArr.sort((a, b) => a[key] - b[key]);
	}
	tempArr.forEach(e => {
		if (!e.equipped) fragment.appendChild(e.card);
	});
	myVars2.cardsList.appendChild(fragment);
	areItemsAtoZ[type][properties.category][properties.type] = !sortingType;
}
function selectSortingButton() {
	sortingDirection(this);
	myVars2.selectedSortingBtns.forEach(e => {
		e.dataset.sortingSelected = false;
	});
	this.dataset.sortingSelected = true;
	const activeButtonType = this.dataset.sortButtonType;
	for (let key of Object.keys(activeSortButton)) {
		activeSortButton[key] = false;
	}
	activeSortButton[activeButtonType] = true;
}
function sortingDirection(x) {
	myVars2.sortingDirection.forEach(e => e.classList.add("hidden"));
	if (x.dataset.sortingSelected === "true") {
		if (x.dataset.sortingOrder === "desc") {
			x.dataset.sortingOrder = "asc";
			x.querySelector("[data-sorting-order='asc']").classList.remove("hidden");
		} else {
			x.dataset.sortingOrder = "desc";
			x.querySelector("[data-sorting-order='desc']").classList.remove("hidden");
		}
	} else {
		x.dataset.sortingOrder = "desc";
		x.querySelector("[data-sorting-order='desc']").classList.remove("hidden");
	}
}


// ФИЛЬТР ----------------------------------------------
const filterOptions = document.querySelectorAll(".filter-window input");
const filter = {
	filterWindow: document.querySelector(".filter-window"),
	filterButton: document.querySelector(".items-window__filter-button"),
};
const filterCategories = {
	bodyPart: document.querySelector(".filter-window__fieldset--body-part"),
	smithingPerks: document.querySelector(".filter-window__fieldset--smithing"),
	tempering: document.querySelector(".filter-window__fieldset--tempering"),
	magicSchool: document.querySelector(".filter-window__fieldset--magic-school"),
	cannotWearHelmet: document.querySelector(".filter-window__fieldset--helmet"),
};

function filterToggle() {
	filter.filterWindow.classList.toggle("openFilter");
	filter.filterButton.classList.toggle("filter-active");
	showFilterCategories(properties.category);
	filter.filterWindow.scrollTop = 0;
}


function showFilterCategories(a) { // это категории фильтров
	if (a === "Armor" || a === "Clothing" || a === "Jewelry") filterCategories.bodyPart.classList.remove("hidden");
	switch(a) {
		case "Armor":
		case "Weapons":
		case "Shields":
			filterCategories.smithingPerks.classList.remove("hidden");
			filterCategories.tempering.classList.remove("hidden");
			break;
		case "Staves":
			filterCategories.magicSchool.classList.remove("hidden");
			break;
		case "Clothing":
			filterCategories.cannotWearHelmet.classList.remove("hidden");
			break;
	}
}

const checkedFilterOptions = []; // при закрытии или открытии фильтра очищать
/*function showChosenFilterOptions() { // на опциях фильтра находится
	const renderStart = performance.now();
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	if (this.checked) {
		checkedFilterOptions.push(this.value);
		for (let i of arr) {
			if (!i.equipped) {
				if (!Object.values(i).some(e => typeof e === "string" && e.includes(this.value))) {
					i.card.classList.add("hidden");
					i.inFilter = true;
				}
			}
		}
	} else {
		checkedFilterOptions.splice(checkedFilterOptions.indexOf(this.value), 1);
		for (let i of arr) {
			if (checkedFilterOptions.every(e => Object.values(i).some(a => typeof a === "string" && a.includes(e))) && !i.equipped) {
				i.card.classList.remove("hidden");
				i.inFilter = false;
			}
		}
	}
	myVars2.cardsList.scrollTop = 0;
	console.log(`🧩 Render time in showChosenFilterOptions(): ${performance.now() - renderStart}ms`);
}*/
function showChosenFilterOptions() {
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	const arrLen = arr.length;
	const filterValue = this.value;
	const chosenCards = [];
	if (this.checked) {
		checkedFilterOptions.push(filterValue);
		for (let i = 0; i < arrLen; i++) {
			if (!i.equipped) {
				const item = arr[i];
				if (!item.filterOptions.includes(filterValue)) {
					chosenCards.push(item.card);
					item.inFilter = true;
				}
			}
		}
		requestAnimationFrame(() => {
			for (let c of chosenCards) c.classList.add("hidden");
		});
	} else {
		checkedFilterOptions.splice(checkedFilterOptions.indexOf(filterValue), 1);
		for (let i = 0; i < arrLen; i++) {
			const item = arr[i];
			if (checkedFilterOptions.every(e => item.filterOptions.includes(e)) && !item.equipped) {
				chosenCards.push(item.card);
				item.inFilter = false;
			}
		}
		requestAnimationFrame(() => {
			for (let c of chosenCards) c.classList.remove("hidden");
		});
	}
	myVars2.cardsList.scrollTop = 0;
}