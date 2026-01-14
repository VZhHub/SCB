// Этот файл нужно будет разделить на само меню, открытие окна предметов и чуть фильров
"use strict";
const dom3 = {
	customizationMenu: document.querySelector("#customizationMenu"),
	typeButtons: document.querySelectorAll("#customizationMenu>div>div>button"),
	itemTypesContainers: document.querySelectorAll("#customizationMenu>div>div"),
	cardsList: document.querySelector(".items-window__cards-list"),
	itemWindowHeader: document.querySelector(".items-window__title"),
	itemsTemplate: document.querySelector(".items-window__template"),
	sortByOtherName: document.querySelector(".items-window__sort-button--by-other span:first-child"),
	closeItemsButton: document.querySelector(".items-window__items .close-window"),
	itemsWindow: document.querySelector(".items-window"),
	selectedSortingBtns: document.querySelectorAll("[data-sorting-selected]"),
	sortByName: document.querySelector(".items-window__sort-button--by-name"),
	sortingDirection: document.querySelectorAll(".sorting-direction"),
	filterWindow: document.querySelector(".filter-window"),
	filterButton: document.querySelector(".items-window__filter-button"),
	checkboxes: document.querySelectorAll(".filter-window input"),
};
const cachedItems = {}; // широко используется!!
const properties = {
	category: undefined,
	type: undefined,
};
const areItemsAtoZ = { // широко используется!!
	name: {},
	weight: {},
	other: {},
};
// ПРОСЛУШИВАТЕЛИ СОБЫТИЙ ------------------------------------------------------------------------------
dom3.customizationMenu.addEventListener("click", e => {
	const button = e.target.closest(".category-button--items");
	if (!button) return;
	openCategory(button);
});
for (let i of dom3.typeButtons) {
	i.addEventListener("click", oneTimeFunction, {once: true});
}
dom3.itemsWindow.addEventListener("click", hideItems);
dom3.closeItemsButton.addEventListener("click", hideItems);
//------------------------------------------------------------------------------------------------------
function oneTimeFunction (event) {
	properties.type = event.target.innerText;
	const category = properties.category, type = properties.type;
	areItemsAtoZ.name[category][type] = true;
	areItemsAtoZ.weight[category][type] = false;
	areItemsAtoZ.other[category][type] = false;
	Items.makeItem(category, type);
	//cacheItems(category, type);
	//classMap[category].makeItem(type);
	makeCards();
	event.target.addEventListener("click", openResults);
}
function openCategory(button) {
	properties.category = button.textContent;
	setPropertiesForSorting();
	const nextButtonClass = button.nextElementSibling.classList;
	const isClose = nextButtonClass.contains("hidden");
	const buttonParent = button.parentElement;
	if (!isClose) {
		buttonParent.style.order = "";
		nextButtonClass.add("hidden");
		return
	}
	for (let i of dom3.itemTypesContainers) {
		i.classList.add("hidden");
		i.parentElement.style.order = "";
	}
	if (buttonParent.style.order !== "-1") buttonParent.style.order = "-1";
	if (isClose) nextButtonClass.remove("hidden");
	dom3.customizationMenu.scrollTop = "0";
}
function setPropertiesForSorting() {
	const category = properties.category;
	if (!areItemsAtoZ.name[category]) {
		areItemsAtoZ.name[category] = {};
		areItemsAtoZ.weight[category] = {};
		areItemsAtoZ.other[category] = {};
	}
}
function makeCards() {
	const renderStart = performance.now();
	const category = properties.category, type = properties.type;
	dom3.cardsList.scrollTop = 0;
	dom3.itemWindowHeader.innerText = category.toUpperCase() + ": " + type.toUpperCase();
	const docFrag = document.createDocumentFragment();
	const arr = Object.values(cachedItems[category][type]);
	const arrLen = arr.length;
	for (let i = 0; i < arrLen; i++) {
		const node = dom3.itemsTemplate.content.cloneNode(true);
		const itemCard = node.querySelector(".item-card");
		observer.observe(itemCard);
		const item = arr[i];
		item.card = itemCard;
		node.querySelector(".item-card__description").textContent = item.description;
		node.querySelector(".item-card__name").textContent = item.name;
		node.querySelector(".item-card__weight").textContent = item.weight;
		node.querySelector(".item-card__equip-button").setAttribute("data-item-name", item.name);
		const itemMiniature = node.querySelector(".item-card__image");
		const itemPicName = item.name.match(/\S+/g).join("_").toLowerCase();
		const smallMiniatureName = itemPicName + "_S";
		const mediumMiniatureName = itemPicName + "_M";
		const bigMiniatureName = itemPicName + "_B";
		const smallMiniaturePath = `./editedImages/${smallMiniatureName}.png`;
		const mediumMiniaturePath = `./editedImages/${mediumMiniatureName}.png`;
		const bigMiniaturePath = `./editedImages/${bigMiniatureName}.png`;
		item.pathS = smallMiniaturePath;
		item.pathM = mediumMiniaturePath;
		item.pathB = bigMiniaturePath;
		itemMiniature.dataset.src = smallMiniaturePath;
		itemMiniature.dataset.imgName = item.name; // добавил, но пока не использовал
		item.img = itemMiniature;
		const rating = node.querySelector(".item-card__rating");
		switch (item.category) {
			case "Weapons":
				rating.textContent = item.damage;
				break;
			case "Staves":
				break;
			default:
				rating.textContent = item.armorRating;
		}
		docFrag.appendChild(node);
	}
	dom3.cardsList.appendChild(docFrag);
	nameSortButtons();
	console.log(`🧩 Render time in makeCards(): ${performance.now() - renderStart}ms`);
}
/*function makeCards(sortedArr) { // эта функция связана с all_items.js
	const renderStart = performance.now();
	const category = properties.category, type = properties.type;
	dom3.cardsList.scrollTop = 0;
	dom3.itemWindowHeader.innerText = category.toUpperCase() + ": " + type.toUpperCase();
	const docFrag = document.createDocumentFragment();
	console.log(sortedArr)
	for (let i = 0, len = sortedArr.length; i < len; i++) {
		const node = dom3.itemsTemplate.content.cloneNode(true);
		const itemCard = node.querySelector(".item-card");
		observer.observe(itemCard); // ленивая загрузка
		const item = sortedArr[i];
		cachedItems[category][type][item.name] = addFilterOptions(item, itemCard);
		node.querySelector(".item-card__description").textContent = item.description;
		node.querySelector(".item-card__name").textContent = item.name;
		node.querySelector(".item-card__weight").textContent = item.weight;
		node.querySelector(".item-card__equip-button").setAttribute("data-item-name", item.name);
		const itemMiniature = node.querySelector(".item-card__image");
		const smallMiniatureName = item.name.match(/\S+/g).join("_").toLowerCase() + "_" + "S";
		itemMiniature.dataset.src = `./editedImages/${smallMiniatureName}.png`;
		const mediumMiniatureName = smallMiniatureName.replace("_S", "_M");
		const mediumMiniaturePath = `./editedImages/${mediumMiniatureName}.png`;
		const bodyPart = item.hands ? item.hands : item.isShield ? "Shield" : item.bodyPart;
		const characteristic = "damage" in item ? item.damage : "armorRating" in item ? item.armorRating : false;
		cacheIt(item.name, {"path": mediumMiniaturePath, "bodyPart": bodyPart, "characteristic": characteristic, "weight": item.weight,});
		const rating = node.querySelector(".item-card__rating");
		switch (item.category) {
			case "Weapons":
				rating.textContent = item.damage;
				break;
			case "Staves":
				break;
			default:
				rating.textContent = item.armorRating;
		}
		docFrag.appendChild(node);
	}
	dom3.cardsList.appendChild(docFrag);
	nameSortButtons();
	console.log(`🧩 Render time in makeCards(): ${performance.now() - renderStart}ms`);
}*/
function cacheItems(category, type) { // возможно отпадёт необходимость в этой функции
	if (!cachedItems[category]) cachedItems[category] = {}; 
	if (!cachedItems[type]) cachedItems[category][type] = {};
}
/*function addFilterOptions(obj, card) {
	const result = {
		card: card,
		name: obj.name,
		equipped: false,
		equippedNow: false,
		inFilter: false,
		nameIndex: obj.nameIndex,
		weightIndex: obj.weightIndex,
		artifact: obj.artifact ? "isArtifact" : "notArtifact",
		enchanted: obj.description ? "isEnchanted" : "notEnchanted",
		enchantable: obj.enchantable ? "isEnchantable" : "notEnchantable",
		description: obj.description,
		isCommon: obj.isCommon,
	};
	if ("armorIndex" in obj) result.armorIndex = obj.armorIndex;
	if ("damageIndex" in obj) result.damageIndex = obj.damageIndex;
	if ("bodyPart" in obj) result.bodyPart = obj.bodyPart;
	switch (properties.category) {
		case "Armor":
		case "Weapons":
		case "Shields":
			result.perks = obj.perks || "noPerks";
			result.material = obj.material ? "isSmithable" : "notSmithable";
			break;
		case "Staves":
			result.magicSchool = obj.magicSchool;
			break;
		case "Clothing":
			result.canWearHelmet = obj.canWearHelmet ? "canWearHelm" : "cannotWearHelm";
			result.hoody = obj.canWearHelmet;
			break;
	}
	return result;
}*/
// КНОПКА СОРТИРОВКИ УРОН/БРОНЯ ----------------------------------------------
function nameSortButtons() {
	const category = properties.category;
	if (category === "Weapons") {
		dom3.sortByOtherName.textContent = "Damage";
	} else if (category !== "Staves") {
		dom3.sortByOtherName.textContent = "Armor";
	}
}
// ОТКРЫТИЕ/СОКРЫТИЕ ПРЕДМЕТОВ ПОСЛЕ ПЕРВОГО ОТКРЫТИЯ ----------------------------------------------
function openResults() { // медленно работать, подумать, как ускорить
	let startTime = Date.now();
	dom3.cardsList.scrollTop = 0;
	properties.type = this.innerText;
	dom3.itemWindowHeader.innerText = properties.category.toUpperCase() + ": " + properties.type.toUpperCase();
	showThisTypeItems();
	nameSortButtons();
	console.log(`openResults: ${Date.now()-startTime} ms`);
}
function toDefaultSortingOrder() {
	const fragment = document.createDocumentFragment();
	const category = properties.category, type = properties.type;
	const arr = Object.values(cachedItems[category][type]);
	if (!areItemsAtoZ.name[category][type]) {
		arr.sort((a, b) => a.nameIndex - b.nameIndex);
		arr.forEach(e => {
			if (!e.equipped) fragment.appendChild(e.card);
		});
		dom3.cardsList.appendChild(fragment);
	}
	areItemsAtoZ.name[category][type] = true;
	areItemsAtoZ.weight[category][type] = false;
	areItemsAtoZ.other[category][type] = false;
	dom3.selectedSortingBtns.forEach(e => {
		e.dataset.sortingSelected = false;
		e.dataset.sortingOrder = "desc";
	});
	dom3.sortByName.dataset.sortingSelected = true;
	dom3.sortingDirection.forEach(e => e.classList.add("hidden"));
	dom3.sortByName.querySelector('[data-sorting-order="desc"]').classList.remove("hidden");
	for (let key of Object.keys(activeSortButton)) {
		activeSortButton[key] = false;
	}
	activeSortButton.name = true;
}
function hideItems() {
	let startTime = Date.now();
	Object.values(cachedItems[properties.category][properties.type]).forEach(e => {
		//if (!e.equipped) e.card.classList.add("hidden");
		e.card.classList.add("hidden");
	});
	toDefaultSortingOrder();
	closeFilter();
	hideFilterCategories();
	uncheckAllCheckboxes();
	clearSearch(true);
	console.log(`hideItems: ${Date.now()-startTime} ms`);
}
function showThisTypeItems() {
	let startTime = Date.now();
	Object.values(cachedItems[properties.category][properties.type]).forEach(e => {
		//if (!e.equipped) e.card.classList.remove("hidden");
		if (!e.isCommon && !e.equipped) {
			e.card.classList.remove("hidden");
		} else if (e.isCommon && !e.secondEquipped) {
			e.card.classList.remove("hidden");
		}
	});
	console.log(`showThisTypeItems: ${Date.now()-startTime} ms`);
}
function closeFilter() {
	dom3.filterWindow.classList.remove("openFilter");
	dom3.filterButton.classList.remove("filter-active");
}
function hideFilterCategories() { // filterCategories используется у фильтров...
	for (let i of Object.values(filterCategories)) i.classList.add("hidden");
}
// Может стоит добавить кнопку "Отменить все фильтры"?
function uncheckAllCheckboxes() { // checkedFilterOptions используется у фильтров...
	for (let i of Object.values(dom3.checkboxes)) i.checked = false;
	for (let i of Object.values(cachedItems[properties.category][properties.type])) i.inFilter = false;
	checkedFilterOptions.splice(0, checkedFilterOptions.length);
}
function closeMenus() {
	menuState.builds && toggleBuild();
	menuState.customization && toggleCustomizationMenu();
}