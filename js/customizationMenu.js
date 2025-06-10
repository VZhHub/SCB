"use strict";
const myVars2 = {
	cardsContainer: document.querySelector("#cardsContainer"),
	closeItemsButton: document.querySelector("#itemsWindow .closeWindow"),
	sortByName: document.querySelector("#sortByName"),
	sortByWeight: document.querySelector("#sortByWeight"),
	sortByOther: document.querySelector("#sortByOther"),
	customizationMenu: document.querySelector("#customizationMenu"),
	categoryButtons: document.querySelectorAll("#customizationMenu>div>button"),
	itemTypesContainers: document.querySelectorAll("#customizationMenu>div>div"),
	typeButtons: document.querySelectorAll("#customizationMenu>div>div>button"),
	itemsCloseBlock: document.querySelector("#itemsWindowCloseBlock"),
	sortButtons: document.querySelectorAll("#sortByName, #sortByWeight, #sortByOther"),
	itemsTemplate: document.querySelector("#itemsTemplate"),
	itemWindowHeader: document.querySelector("#itemsWindow .submenu-title"),
	selectedSortingBtns: document.querySelectorAll("[data-sorting-selected]"),
	sortingDirection: document.querySelectorAll(".sortingDirection"),
	sortByOtherName: document.querySelector("#sortByOther span:first-child"),
	filter: document.querySelector("#filter"),
	checkboxes: document.querySelectorAll("#filterWindow input"),
	chooseHandContainer: document.querySelector("#chooseHandContainer"),
	choosingHand: document.querySelector("#choosingHand"),
	equippedItemsContainer: document.querySelector("#equippedItemsContainer"),
	equippedCardsWrapper: document.querySelector("#equippedCardsWrapper"),
	cardsList: document.querySelector("#cardsList"),
	equippedCards: document.querySelector("#equippedCards"),
	itemReplacement: document.querySelector("#itemReplacement"),
	sameItem: document.querySelector("#sameItem"),
	equip2H: document.querySelector("#equip2H"),
	itemsWindowContainer: document.querySelector("#itemsWindowContainer"),
	descriptionContainer: document.querySelector("#descriptionContainer"),
	equipHoody: document.querySelector("#equipHoody"),
	equipHoody2: document.querySelector("#equipHoody2"),
	unequipHoody: document.querySelector("#unequipHoody"),
	itemsWrapper: document.querySelector("#itemsWrapper"),
	unequipMiniatureContainer: document.querySelector(".unequip-miniature-container"),
	unequipMiniatureName: document.querySelector(".unequip-miniature span"),
	totalDamage: document.querySelector(".total__damage"),
	totalMagRes: document.querySelector(".total__mag-res"),
	totalArmor: document.querySelector(".total__armor"),
	totalPerks: document.querySelector(".total__perks"),
	totalWeight: document.querySelector(".total__weight"),
	unequipItemFromMenu: document.querySelector(".unequip-item-from-menu"),
	unequipItemFromMenuBtns: document.querySelectorAll(".unequip-item-from-menu button"),
};

// ПРОВЕРЬ ВСЕ ПРОСЛУШИВАТЕЛИ, ЧТОБЫ НЕ ЗАБЫТЬ TOUCHSTART
// Везде, где есть style, постараться заменить на classList

// Одни и те ж функции во множестве циклов
// ВОЗМОЖНО стоит запускать некоторые функции после события load а не при действиях пользователя

if (window.matchMedia("(pointer:fine)").matches) {
	for (let i of myVars2.categoryButtons) i.addEventListener("click", openCategory);
	for (let i of myVars2.typeButtons) {
		i.addEventListener("click", function disappearEnvelope() {
			properties.type = this.innerText;
			areItemsAtoZ.name[properties.category][properties.type] = true;
			areItemsAtoZ.weight[properties.category][properties.type] = false;
			areItemsAtoZ.other[properties.category][properties.type] = false;
			makeItemsAndDisappear();
			this.addEventListener("click", openResults);
			this.removeEventListener("click", disappearEnvelope);
		});
	}
	myVars2.itemsCloseBlock.addEventListener("click", hideItems);
	myVars2.closeItemsButton.addEventListener("click", hideItems);
	//myVars2.closeItemsButton.addEventListener("click", e => equipItem.rejectHand.call(e));
	//myVars2.sortByName.addEventListener("click", sortByName);
	/*myVars2.sortByName.addEventListener("click", () => {
		Sorting.stateForName();
		Sorting.sortItems(cachedItems[properties.category][properties.type], "nameIndex", Sorting.nameState, "name");
	});*/
	//myVars2.sortByWeight.addEventListener("click", sortByWeight);
	/*myVars2.sortByWeight.addEventListener("click", () => {
		Sorting.stateForWeight();
		Sorting.sortItems(cachedItems[properties.category][properties.type], "weightIndex", Sorting.weightState);
	});*/
	myVars2.sortByName.addEventListener("click", () => {sortBy("name", "nameIndex")});
	myVars2.sortByWeight.addEventListener("click", () => {sortBy("weight", "weightIndex")});
	myVars2.sortByOther.addEventListener("click", () => {sortBy("other", "")});
	//myVars2.sortByOther.addEventListener("click", sortByOther);
	myVars2.sortButtons.forEach(e => e.addEventListener("click", selectSortingButton));
	myVars2.filter.addEventListener("click", filterToggle);
	for (let i of myVars2.checkboxes) i.addEventListener("click", showChosenFilterOptions);
} else {
	for (let i of myVars2.categoryButtons) i.addEventListener("touchstart", openCategory);
	for (let i of myVars2.typeButtons) {
		i.addEventListener("touchstart", function disappearEnvelope() {
			properties.type = this.innerText;
			areItemsAtoZ.name[properties.category][properties.type] = true;
			areItemsAtoZ.weight[properties.category][properties.type] = false;
			areItemsAtoZ.other[properties.category][properties.type] = false;
			makeItemsAndDisappear();
			this.addEventListener("touchstart", openResults);
			this.removeEventListener("touchstart", disappearEnvelope);
		});
	}
	myVars2.itemsCloseBlock.addEventListener("touchstart", hideItems);
	myVars2.closeItemsButton.addEventListener("touchstart", hideItems);
	/*myVars2.sortByName.addEventListener("touchstart", sortByName);
	myVars2.sortByWeight.addEventListener("touchstart", sortByWeight);
	myVars2.sortByOther.addEventListener("touchstart", sortByOther);*/
	myVars2.sortByName.addEventListener("touchstart", () => {sortBy("name", "nameIndex")});
	myVars2.sortByWeight.addEventListener("touchstart", () => {sortBy("weight", "weightIndex")});
	myVars2.sortByOther.addEventListener("touchstart", () => {sortBy("other", "")});
	myVars2.sortButtons.forEach(e => e.addEventListener("touchstart", selectSortingButton));
	myVars2.filter.addEventListener("touchstart", filterToggle);
	for (let i of myVars2.checkboxes) i.addEventListener("touchstart", showChosenFilterOptions);
}


// ОБЯЗАТЕЛЬНО ПРОВЕРЬ ВСЁ - ГДЕ МОЖНО, СОБЕРИ ОБЪЕКТЫ DOM И ВЫНЕСИ В ОБЪЕКТЫ/МАССИВЫ, ЧТОБЫ СОКРАТИТЬ ОБРАЩЕНИЯ К DOM

const properties = {
	category: undefined,
	type: undefined,
};
const cachedItems = {};
const areItemsAtoZ = {
	name: {},
	weight: {},
	other: {},
};
const observerOptions = {
	root: document.querySelector("#cardsContainer"),
	rootMargin: "180px",
	threshold: 0.0,
};
const observer = new IntersectionObserver(addImgPath, observerOptions);


function openCategory() {
	properties.category = this.textContent;
	if (!areItemsAtoZ.name.hasOwnProperty(properties.category)) {
		areItemsAtoZ.name[properties.category] = {};
		areItemsAtoZ.weight[properties.category] = {};
		areItemsAtoZ.other[properties.category] = {};
	}
	//Sorting.sortingState.name[properties.category] = {};
	//Sorting.sortingState.weight[properties.category] = {};
	//Sorting.sortingState.other[properties.category] = {};
	const isClose = this.nextElementSibling.classList.contains("hidden");
	const orderNum = this.parentElement.style.order;
	for (let i of myVars2.itemTypesContainers) {
		i.classList.add("hidden");
		i.parentElement.style.order = "";
	}
	if (orderNum !== "-1") this.parentElement.style.order = "-1";
	if (isClose) this.nextElementSibling.classList.remove("hidden");
	myVars2.customizationMenu.scrollTop = "0";
}


// Забыл добавить кол-во использования для оружия и посохов!!
// А также из каких материалов, доп.эффект (броня) итд - проверь!!
// Надо это сделать как доп инфу
// А надо ли? Может лучше это всё оставить для оуна статистики?
const bigImg = bigImgFunc();
const biggerIMGContainer = document.querySelector(".biggerIMGContainer");
myVars2.cardsContainer.addEventListener("mouseover", e => {
	if (e.target.classList.contains("itemMiniature")) {
		bigImg.show.call(e.target);
	}
});
myVars2.cardsContainer.addEventListener("mouseout", e => {
	if (e.target.classList.contains("itemMiniature")) {
		bigImg.hide.call(e.target);
	}
});
myVars2.equippedCardsWrapper.addEventListener("mouseover", e => {
	if (e.target.classList.contains("itemMiniature")) {
		bigImg.show.call(e.target);
	}
});
myVars2.equippedCardsWrapper.addEventListener("mouseout", e => {
	if (e.target.classList.contains("itemMiniature")) {
		bigImg.hide.call(e.target);
	}
});
//const equipItem = equipItemFunc();
myVars2.cardsContainer.addEventListener("click", e => {
	if (e.target.classList.contains("equipItemButton")) {
		//equipItem.getCached.call(e.target);
		equipItem.call(e.target);
		//e.target.textContent = "Unequip";
	}
});
class UnequipFromMenu {
	static #itemSlot;
	static set itemSlot(x) {
		this.#itemSlot = x;
	}
	static unequip(btn) {
		if ( btn.textContent === "Yes") removeCard(this.#itemSlot);
		myVars2.chooseHandContainer.classList.add("hidden");
		myVars2.itemsWrapper.classList.remove("blurred");
		myVars2.unequipItemFromMenu.classList.add("hidden");
	}
}
myVars2.equippedCardsWrapper.addEventListener("click", e => {
	//if (e.target.classList.contains("equipItemButton")) removeCard.call(e.target, e.target.dataset.slot, true);
	if (e.target.classList.contains("equipItemButton")) {
		myVars2.chooseHandContainer.classList.remove("hidden");
		myVars2.itemsWrapper.classList.add("blurred");
		myVars2.unequipItemFromMenu.classList.remove("hidden");
		myVars2.unequipItemFromMenu.querySelector("span").textContent = slotContent[e.target.dataset.slot].equippedItem;
		UnequipFromMenu.itemSlot = e.target.dataset.slot;
	}
});
myVars2.unequipItemFromMenuBtns.forEach(a => a.addEventListener("click", () => UnequipFromMenu.unequip(a)));

myVars2.choosingHand.querySelector("button:first-of-type").addEventListener("click", e => checkSlotForOneHanded.call(e.target));
myVars2.choosingHand.querySelector("button:last-of-type").addEventListener("click", e => checkSlotForOneHanded.call(e.target));

myVars2.itemReplacement.querySelector("button:first-of-type").addEventListener("click", e => decideToReplaceItem.call(e.target));
myVars2.itemReplacement.querySelector("button:last-of-type").addEventListener("click", e => decideToReplaceItem.call(e.target));

myVars2.equipHoody.querySelector("button:first-of-type").addEventListener("click", e => decideToEquipHoody.call(e.target));
myVars2.equipHoody.querySelector("button:last-of-type").addEventListener("click", e => decideToEquipHoody.call(e.target));
myVars2.equipHoody2.querySelector("button:first-of-type").addEventListener("click", e => decideToEquipHoodyUnequipOther.call(e.target));
myVars2.equipHoody2.querySelector("button:last-of-type").addEventListener("click", e => decideToEquipHoodyUnequipOther.call(e.target));
myVars2.unequipHoody.querySelector("button:first-child").addEventListener("click", e => decideToUnequipHoody.call(e.target));
myVars2.unequipHoody.querySelector("button:last-child").addEventListener("click", e => decideToUnequipHoody.call(e.target));

myVars2.equip2H.querySelector("button:first-of-type").addEventListener("click", e => decideToReplaceItem.call(e.target));
myVars2.equip2H.querySelector("button:last-of-type").addEventListener("click", e => decideToReplaceItem.call(e.target));

myVars2.sameItem.querySelector("button").addEventListener("click", confirmSameItem);
myVars2.equippedItemsContainer.querySelectorAll(".slot").forEach(a => a.addEventListener("mouseover", () => {
	if (a.classList.contains("occupied")) a.querySelector("button").classList.add("show");
}));
myVars2.equippedItemsContainer.querySelectorAll(".slot").forEach(a => a.addEventListener("mouseout", () => {
	a.querySelector("button").classList.remove("show");
}));

const classMap = {
	Armor: Armor,
	Weapons: Weapons,
	Shields: Shields,
	Staves: Staves,
	Jewelry: Jewelry,
	Clothing: Clothing,
};

function makeItemsAndDisappear(sortedArr = null) {
	const renderStart = performance.now();
	myVars2.cardsList.scrollTop = 0;
	cachingItems();
	if (!sortedArr) {
		classMap[properties.category].makeItem(properties.type);
		return;
	}
	console.log(sortedArr);
	myVars2.itemWindowHeader.innerText = properties.category.toUpperCase() + ": " + properties.type.toUpperCase();
	const docFrag = document.createDocumentFragment();
	for (let i = 0, len = sortedArr.length; i < len; i++) {
		const node = itemsTemplate.content.cloneNode(true);
		observer.observe(node.firstElementChild);
		//node.firstElementChild.setAttribute("data-category-type", `${properties.category} ${properties.type}`); // используется cachingItems() для добавления в cachedItems - нафиг не надо, т.к. cachedItems использует для имён properties.category properties.type
		// четыре ниже нужны для сортировки по имени, весу итд - тоже переделать
		//node.firstElementChild.setAttribute("data-name-index", sortedArr[i].nameIndex);
		//node.firstElementChild.setAttribute("data-weight-index", sortedArr[i].weightIndex);
		//if ("damageIndex" in sortedArr[i]) node.children[0].setAttribute("data-damage-index", sortedArr[i].damageIndex);
		//if ("armorIndex" in sortedArr[i]) node.children[0].setAttribute("data-armor-index", sortedArr[i].armorIndex);
		
		//node.firstElementChild.setAttribute("data-filter-info", addFilterOptions(sortedArr[i]));
		//addFilterOptions3(sortedArr[i]);

		cachedItems[properties.category][properties.type][sortedArr[i].name] = addFilterOptions3(sortedArr[i], node.firstElementChild); // добавил
		
		if (sortedArr[i].description) node.querySelector(".description").textContent = sortedArr[i].description;
		node.querySelector(".itemName").textContent = sortedArr[i].name;
		node.querySelector(".itemWeight").textContent = sortedArr[i].weight;
		
		const equipButton = node.querySelector(".equipItemButton");
		equipButton.setAttribute("data-item-name", sortedArr[i].name);
		//equipButton.addEventListener("click", () => equipItemFunc(equipButton)); // делигировать как bigImg!!!
		
		const itemMiniature = node.querySelector(".itemMiniature");
		const smallMiniatureName = sortedArr[i].name.match(/\S+/g).join("_").toLowerCase() + "_" + "S";
		itemMiniature.dataset.src = `./editedImages/${smallMiniatureName}.png`;
		
		const mediumMiniatureName = smallMiniatureName.replace("_S", "_M");
		const mediumMiniaturePath = `./editedImages/${mediumMiniatureName}.png`;
		const bodyPart = "hands" in sortedArr[i] ? sortedArr[i].hands : "isShield" in sortedArr[i] ? "Shield" : sortedArr[i].bodyPart;
		const characteristic = "damage" in sortedArr[i] ? sortedArr[i].damage : "armorRating" in sortedArr[i] ? sortedArr[i].armorRating : false;
		cacheIt(sortedArr[i].name, {"path": mediumMiniaturePath, "bodyPart": bodyPart, "characteristic": characteristic, "weight": sortedArr[i].weight,});
		
		const rating = node.querySelector(".itemRating");
		switch (sortedArr[i].category) {
			case "Weapons":
				rating.textContent = sortedArr[i].damage;
				break;
			case "Staves":
				break;
			default:
				rating.textContent = sortedArr[i].armorRating;
		}
		docFrag.appendChild(node);
	}
	myVars2.cardsList.appendChild(docFrag);
	//cachingItems(); // нужно будет перекинуть в начало, чтобы потом использовать addFilterOptions
	sortingCategoryName(); // не забудь про него
	console.log(`🧩 Render time in makeItemsAndDisappear(): ${performance.now() - renderStart}ms`);
}
function addFilterOptions3(obj, card) {
	const result = {
		card: card,
		name: obj.name,
		equipped: false,
		equippedNow: false,
		nameIndex: obj.nameIndex,
		weightIndex: obj.weightIndex,
		artifact: obj.artifact ? "isArtifact" : "notArtifact",
		enchantable: obj.enchantable ? "isEnchantable" : "notEnchantable",
		description: obj.description ? "isEnchanted" : "notEnchanted",
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
}

// ЭКИПИРОВКА ПРЕДМЕТОВ ----------------------------------------------
const slot = {
	neck: document.querySelector("#neckSlot"),
	head: document.querySelector("#headSlot"),
	back: document.querySelector("#backSlot"),
	arms: document.querySelector("#armsSlot"),
	right: document.querySelector("#rightSlot"),
	left: document.querySelector("#leftSlot"),
	body: document.querySelector("#bodySlot"),
	finger: document.querySelector("#fingerSlot"),
	legs: document.querySelector("#legsSlot"),
};
const slotContent = {
	neck: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	head: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	back: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	arms: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	right: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	left: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	both: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	body: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	finger: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
	legs: {
		equippedItem: null,
		itemsInSlot: new Map(),
		occupied: false,
	},
};
/*myVars2.equippedItemsContainer.querySelectorAll("button").forEach(a => a.addEventListener("click", () => {
		if (slotContent.both.occupied && (a.dataset.slot === "left" || a.dataset.slot === "right")) {
			removeCard("both");
		} else {
			removeCard(a.dataset.slot);
		}
	}));*/
myVars2.equippedItemsContainer.querySelectorAll("button").forEach(a => a.addEventListener("click", () => {
	/*if (slotContent.both.occupied && (a.dataset.slot === "left" || a.dataset.slot === "right")) {
		if (slotContent.both.occupied) removeCard("both");
	} else {
		if (slotContent[a.dataset.slot].occupied) removeCard(a.dataset.slot);
	}*/
	myVars2.unequipMiniatureContainer.classList.remove("hidden");
	myVars2.equippedItemsContainer.classList.add("blurred");
	console.log(a.dataset.slot)
	if (slotContent.both.occupied) {
		myVars2.unequipMiniatureName.textContent = slotContent.both.equippedItem;
	} else {
		myVars2.unequipMiniatureName.textContent = slotContent[a.dataset.slot].equippedItem;
	}
	unequipMiniature.buttonSlot = a.dataset.slot;
}));
myVars2.unequipMiniatureContainer.querySelectorAll("button").forEach(a => a.addEventListener("click", unequipMiniature));
function unequipMiniature() {
	if (this.textContent === "Yes") {
		if (slotContent.both.occupied && (unequipMiniature.buttonSlot === "left" || unequipMiniature.buttonSlot === "right")) {
			removeCard("both");
		} else {
			removeCard(unequipMiniature.buttonSlot);
		}
	}
	myVars2.unequipMiniatureContainer.classList.add("hidden");
	myVars2.equippedItemsContainer.classList.remove("blurred");
}
const cache = new Map();
const everEquipped = new Map();
let resolveFirst, resolveSecond, resolveThird, name, arm, docFrag, itemCard, bodyPart;
function cacheIt(name, obj) { // используется при открытии окна
	cache.set(name, obj);
}
async function equipItem() {
	name = this.dataset.itemName;
	bodyPart = cache.get(name).bodyPart.toLowerCase();
	docFrag = document.createDocumentFragment();
	itemCard = this.parentElement;
	const promise = new Promise((resolve, reject) => {
		resolveFirst = {resolve, reject};
	});
	if (bodyPart === "one") {
		myVars2.chooseHandContainer.classList.remove("hidden");
		myVars2.choosingHand.classList.remove("hidden");
		myVars2.choosingHand.querySelector(".firstItem").textContent = name;
		//myVars2.cardsContainer.classList.add("blurred");
		myVars2.itemsWrapper.classList.add("blurred");
		try {
			const result = await promise; // жду результата checkSlotForOneHanded
			//Weapons.getItemObject(properties.type, name);
			makeDescription(arm);
			calcTotalValues(properties.category, properties.type, 1, name);
			calcMagRes(name, 1)
		} catch (err) { // не сделано
			//myVars2.cardsContainer.classList.remove("blurred"); // Вот это нафига тут?
			console.error(err);
		}
	} else if (bodyPart === "shield") {// ждём checkSlotForShield
		try {
			checkSlotForShield();
			const result = await promise;
			makeDescription("left");
			calcTotalValues(properties.category, properties.type, 1, name);
			calcMagRes(name, 1)
		} catch (err) {
			console.error(err);
		}
	} else if (bodyPart === "two") {
		try {
			checkSlotForTwoHanded();
			const result = await promise;
			makeDescription("both");
			calcTotalValues(properties.category, properties.type, 1, name);
			calcMagRes(name, 1)
		} catch (err) {
			console.error(err);
		}
	} else {
		try {
			checkSlotForApparel();
			const result = await promise;
			makeDescription(bodyPart);
			calcTotalValues(properties.category, properties.type, 1, name);
			calcMagRes(name, 1)
		} catch (err) {
			console.error(err);
		}
	}
}
function makeDescription(slotName) {
	const obj = classMap[properties.category].getItemObject(properties.type, name);
	const category = properties.category;
	const itemInfo = myVars2.descriptionContainer.querySelector(`[data-itemDescr=${slotName}][data-category=${category}]`);
	itemInfo.querySelector(".itemName span").textContent = obj.name;
	itemInfo.querySelector(".itemWeight span").textContent = obj.weight;
	itemInfo.querySelector(".itemArtifact span").textContent = obj.artifact ? "Yes" : "No";
	itemInfo.querySelector(".itemDescription span").textContent = obj.description || "-";
	if (bodyPart === "one" || bodyPart === "two") {
		itemInfo.querySelector(".itemUses span").textContent = obj.uses;
	}

	if (category === "Weapons") itemInfo.querySelector(".itemDamage span").textContent = obj.damage || "-";
	if (category === "Weapons" || category === "Armor" || category === "Shields") {
		itemInfo.querySelector(".itemMaterial span").textContent = obj.material || "Item cannot be tempered";
		itemInfo.querySelector(".itemPerks span").textContent = obj.perks || "None";
		itemInfo.querySelector(".itemProfit span").textContent = obj.profit ? "Yes" : "No";
	}
	if (category === "Armor") {
		itemInfo.querySelector(".itemArmor span").textContent = obj.armorRating;
		itemInfo.querySelector(".itemAddEff span").textContent = obj.additionalEffect || "-";
	}
	if (category === "Jewelry" || category === "Clothing" || category === "Shields") itemInfo.querySelector(".itemArmor span").textContent = obj.armorRating;
	if (category === "Staves") {
		itemInfo.querySelector(".itemMSchool span").textContent = obj.magicSchool || "None";
		itemInfo.querySelector(".itemMEffect span").textContent = obj.magicEffect;
	}
	itemInfo.classList.remove("hidden");
}
function setSlotContent(arm) {
	slotContent[arm].occupied = true;
	slotContent[arm].equippedItem = name;
	if (!slotContent[arm].itemsInSlot.has(name)) slotContent[arm].itemsInSlot.set(name);
}
function makeItemCard(arm, x = false) {
	const cardCopy = itemCard.cloneNode(true);
	const item = cachedItems[properties.category][properties.type][name];
	item[arm] = cardCopy;
	cardCopy.querySelector("button").dataset.slot = arm;
	cardCopy.querySelector("button").textContent = "Unequip";
	cardCopy.querySelector("button").classList.add("unequip");
	cardCopy.classList.add("equipped");
	myVars2.equippedCardsWrapper.appendChild(cardCopy);
	if (x) {
		itemCard.classList.add("hidden");
		item.equipped = true;
	}
}
function removeCard(arm, x = false) {
	let itemSlot;
	x ? itemSlot = this.dataset.slot : itemSlot = arm;
	const itemName = slotContent[itemSlot].equippedItem;
	const cardsWindow = cachedItems[slotContent[itemSlot].category][slotContent[itemSlot].type];
	const itemToRemove = cardsWindow[itemName];
	const category = slotContent[itemSlot].category;
	itemToRemove[itemSlot].classList.add("hidden");
	if (itemSlot === "both") {
		cache.get(itemName).left.classList.add("hidden");
		cache.get(itemName).right.classList.add("hidden");
	} else {
		cache.get(itemName)[itemSlot].classList.add("hidden"); // экипипрованная картинка
	}
	if (!itemToRemove.equipped) {
		itemToRemove.equippedNow = false;
	}
	if (itemToRemove.equipped) {
		if (itemToRemove.category === properties.category && itemToRemove.type === properties.type && !myVars2.itemsWindowContainer.classList.contains("hidden")) itemToRemove.card.classList.remove("hidden");
		itemToRemove.equipped = false;
		const tempArr = Object.values(cardsWindow);
		tempArr.sort((a, b) => a.nameIndex - b.nameIndex);
		tempArr.forEach(e => {
			if (!e.equipped) docFrag.appendChild(e.card);
		});
		myVars2.cardsList.appendChild(docFrag);
		myVars2.cardsList.scrollTop = 0;
	}
	if (itemSlot === "both") {
		restoreSlot("left");
		restoreSlot("right");
	} else {
		restoreSlot(itemSlot);
	}
	slotContent[itemSlot].equippedItem = null;
	slotContent[itemSlot].occupied = false;
	toggleEquippedCardsPanel();
	calcTotalValues(slotContent[itemSlot].category, slotContent[itemSlot].type, -1, itemName);
	calcMagRes(itemName, -1)
	myVars2.descriptionContainer.querySelector(`[data-itemDescr=${itemSlot}][data-category=${category}]`).classList.add("hidden");
}
function saveCategoryAndType(x) { // возможно стоит объединить с setSlotContent
	slotContent[x]["category"] = properties.category;
	slotContent[x]["type"] = properties.type;
}
async function checkSlotForOneHanded() {
	arm = this.textContent.toLowerCase();
	if (!slotContent[arm].occupied && !slotContent.both.occupied) {
		equipOneHanded();
		myVars2.choosingHand.classList.add("hidden");
		resolveFirst.resolve(this.textContent); // вот тут надо будет заменить текст
	} else {
		const promise = new Promise((resolve, reject) => {
			resolveSecond = {resolve, reject};
		});
		if (name === slotContent[arm].equippedItem) {
			myVars2.choosingHand.classList.add("hidden");
			myVars2.sameItem.classList.remove("hidden");
			const result = await promise; // ожидаем confirmSameItem
			resolveFirst.resolve("Same item");
		} else {
			myVars2.choosingHand.classList.add("hidden");
			myVars2.itemReplacement.classList.remove("hidden");
			if (slotContent[arm].occupied) myVars2.itemReplacement.querySelectorAll(".firstItem").forEach(e => e.textContent = slotContent[arm].equippedItem);
			if (slotContent.both.occupied) myVars2.itemReplacement.querySelectorAll(".firstItem").forEach(e => e.textContent = slotContent.both.equippedItem);
			myVars2.itemReplacement.querySelector(".secondItem").textContent = name;
			try {
				const result = await promise; // ждём результат decideToReplaceItem
				resolveFirst.resolve(this.textContent);
			} catch (err) {
				resolveFirst.reject(err);
			}
			myVars2.itemReplacement.classList.add("hidden");
		}
	}
	myVars2.chooseHandContainer.classList.add("hidden");
	//myVars2.cardsContainer.classList.remove("blurred");
	myVars2.itemsWrapper.classList.remove("blurred");
}
function decideToReplaceItem() {
	if (this.textContent === "Yes") {
		if (bodyPart === "two") {
			if (slotContent.both.occupied) {
				removeCard("both");
			} else {
				if (slotContent.left.occupied) removeCard("left");
				if (slotContent.right.occupied) removeCard("right");
			}
		} else if (bodyPart === "one" || bodyPart === "shield") {
			if (slotContent.both.occupied) {
				removeCard("both");
			} else {
				removeCard(arm);
			}
		} else {
			removeCard(bodyPart);
		}
		switch (bodyPart) {
			case "one":
				equipOneHanded();
				break;
			case "two":
				equipTwoHanded();
				break;
			case "shield":
				equipShield();
				break;
			default:
				equipApparel();
				break;
		}
		resolveSecond.resolve("Item replaced");
	} else {
		resolveSecond.reject("Item kept");
	}
}
function equipOneHanded() {
	const item = cachedItems[properties.category][properties.type][name];
	if (everEquipped.has(name)) {
		if (item.isCommon) {
			if (slotContent[arm].itemsInSlot.has(name)) {
				showHiddenItem(arm);
				if (item.equippedNow) {
					itemCard.classList.add("hidden");
					item.equipped = true;
				} else {
					item.equippedNow = true;
				}
			} else {
				if (item.equippedNow) {
					makeItemCard(arm, true);
				} else {
					makeItemCard(arm);
					item.equippedNow = true;
				}
				makeImg(arm);
			}
		} else {
			if (slotContent[arm].itemsInSlot.has(name)) {
				showHiddenItem(arm);
				itemCard.classList.add("hidden");
				item.equipped = true;
			} else {
				makeItemCard(arm, true);
				makeImg(arm);
			}
		}
	} else {
		if (item.isCommon) {
			makeItemCard(arm);
			item.equippedNow = true;
		} else {
			makeItemCard(arm, true);
		}
		makeImg(arm);
		infoToKeepCardHidden();
		everEquipped.set(name);
	}
	saveCategoryAndType(arm);
	setSlotContent(arm);
	adjustSlot(arm);
	toggleEquippedCardsPanel();
}
// нужна функция, которая будет чекать экипированные предметы и писать их названия в окно в span
async function checkSlotForShield() {
	if (!slotContent.left.occupied && !slotContent.both.occupied) {
		equipShield();
		resolveFirst.resolve("Shield equipped");
	} else {
		const promise = new Promise((resolve, reject) => {
			resolveSecond = {resolve, reject};
		});
		myVars2.chooseHandContainer.classList.remove("hidden");
		myVars2.itemReplacement.classList.remove("hidden");
		myVars2.itemReplacement.querySelectorAll(".firstItem").forEach(e => e.textContent = slotContent.left.equippedItem)
		myVars2.itemReplacement.querySelector(".secondItem").textContent = name;
		//myVars2.cardsContainer.classList.add("blurred");
		myVars2.itemsWrapper.classList.add("blurred");
		try {
			const result = await promise; // ждём результат decideToReplaceItem
			resolveFirst.resolve("Shield equipped");
		} catch (err) {
			resolveFirst.reject(err);
		}
		myVars2.chooseHandContainer.classList.add("hidden");
		myVars2.itemReplacement.classList.add("hidden");
		//myVars2.cardsContainer.classList.remove("blurred");
		myVars2.itemsWrapper.classList.remove("blurred");
	}
}
async function checkSlotForApparel() { // проверка слота головы и hoody, если да, то замена // а на предмет того, ставим мы мантию или главу, нужно проверять через bodyPart
	// и нужен ещё resolveThird
	if (properties.category === "Clothing") {
		const promise = new Promise((resolve, reject) => {
			resolveThird = {resolve, reject};
		});
		try {
			if (bodyPart === "body" && slotContent.head.occupied && slotContent.body.occupied && checkIfHoody(name)) {
				myVars2.chooseHandContainer.classList.remove("hidden");
				//myVars2.cardsContainer.classList.add("blurred");
				myVars2.itemsWrapper.classList.add("blurred");
				myVars2.equipHoody2.classList.remove("hidden");
				myVars2.equipHoody2.querySelector(".firstItem").textContent = name;
				myVars2.equipHoody2.querySelector(".secondItem").textContent = slotContent.head.equippedItem;
				myVars2.equipHoody2.querySelector(".thirdItem").textContent = slotContent.body.equippedItem;
				const result = await promise;
			} else if (bodyPart === "body" && slotContent.head.occupied && checkIfHoody(name)) {
				myVars2.chooseHandContainer.classList.remove("hidden");
				//myVars2.cardsContainer.classList.add("blurred");
				myVars2.itemsWrapper.classList.add("blurred");
				myVars2.equipHoody.classList.remove("hidden");
				const result = await promise;
			} else if (bodyPart === "head" && slotContent.body.occupied && checkIfHoody(slotContent.body.equippedItem)) {
				myVars2.chooseHandContainer.classList.remove("hidden");
				//myVars2.cardsContainer.classList.add("blurred");
				myVars2.itemsWrapper.classList.add("blurred");
				myVars2.unequipHoody.classList.remove("hidden");
				const result = await promise;
			}
			//const result = await promise;
			//resolveThird.resolve("Hooded item equipped");
		} catch (err) {
			resolveThird.reject(err);
			return;
		}
	}
	if (!slotContent[bodyPart].occupied) {
		equipApparel();
		resolveFirst.resolve("Apparel equipped");
	} else {
		const promise = new Promise((resolve, reject) => {
			resolveSecond = {resolve, reject};
		});
		myVars2.chooseHandContainer.classList.remove("hidden");
		myVars2.itemReplacement.classList.remove("hidden");
		myVars2.itemReplacement.querySelectorAll(".firstItem").forEach(e => e.textContent = slotContent[bodyPart].equippedItem)
		myVars2.itemReplacement.querySelector(".secondItem").textContent = name;
		//myVars2.cardsContainer.classList.add("blurred");
		myVars2.itemsWrapper.classList.add("blurred");
		try {
			const result = await promise; // ждём результат decideToReplaceItem
			resolveFirst.resolve("Shield equipped");
		} catch (err) {
			resolveFirst.reject(err);
		}
		myVars2.chooseHandContainer.classList.add("hidden");
		myVars2.itemReplacement.classList.add("hidden");
		//myVars2.cardsContainer.classList.remove("blurred");
		myVars2.itemsWrapper.classList.remove("blurred");
	}
}
function checkIfHoody(x) {
	return !cachedItems[properties.category][properties.type][x].hoody;
}
function decideToEquipHoody() {
	if (this.textContent === "Yes") {
		removeCard("head");
		resolveThird.resolve("Hooded item equipped");
	} else {
		resolveThird.reject("Hooded item not equipped");
	}
	//myVars2.cardsContainer.classList.remove("blurred");
	myVars2.itemsWrapper.classList.remove("blurred");
	myVars2.chooseHandContainer.classList.add("hidden");
	myVars2.equipHoody.classList.add("hidden");
}
function decideToUnequipHoody() {
	if (this.textContent === "Yes") {
		removeCard("body");
		resolveThird.resolve("Hooded item equipped");
	} else {
		resolveThird.reject("Hooded item not equipped");
	}
	//myVars2.cardsContainer.classList.remove("blurred");
	myVars2.itemsWrapper.classList.remove("blurred");
	myVars2.chooseHandContainer.classList.add("hidden");
	myVars2.unequipHoody.classList.add("hidden");
}
function decideToEquipHoodyUnequipOther() {
	if (this.textContent === "Yes") {
		removeCard("body");
		removeCard("head");
		resolveThird.resolve("Hooded item equipped");
	} else {
		resolveThird.reject("Hooded item not equipped");
	}
	//myVars2.cardsContainer.classList.remove("blurred");
	myVars2.itemsWrapper.classList.remove("blurred");
	myVars2.chooseHandContainer.classList.add("hidden");
	myVars2.equipHoody2.classList.add("hidden");
}
function equipApparel() {
	const item = cachedItems[properties.category][properties.type][name];
	if (everEquipped.has(name)) {
		showHiddenItem(bodyPart);
		itemCard.classList.add("hidden");
		item.equipped = true;
	} else {
		makeItemCard(bodyPart, true);
		makeImg(bodyPart);
		infoToKeepCardHidden();
		everEquipped.set(name);
	}
	saveCategoryAndType(bodyPart);
	setSlotContent(bodyPart);
	adjustSlot(bodyPart);
	toggleEquippedCardsPanel();
}
async function checkSlotForTwoHanded() {
	if (!slotContent.left.occupied && !slotContent.right.occupied && !slotContent.both.occupied) {
		equipTwoHanded();
		resolveFirst.resolve("Two-handed equipped");
	} else {
		const promise = new Promise((resolve, reject) => {
			resolveSecond = {resolve, reject};
		});
		myVars2.chooseHandContainer.classList.remove("hidden");
		myVars2.equip2H.classList.remove("hidden");
		myVars2.equip2H.querySelector(".firstItem").textContent = name;
		if (slotContent.left.occupied) myVars2.equip2H.querySelector(".secondItem").textContent = slotContent.left.equippedItem;
		if (slotContent.both.occupied) myVars2.equip2H.querySelector(".secondItem").textContent = slotContent.both.equippedItem;
		if (slotContent.left.occupied && slotContent.right.occupied) myVars2.equip2H.querySelector(".and").classList.remove("hidden");
		if (slotContent.right.occupied) myVars2.equip2H.querySelector(".thirdItem").textContent = slotContent.right.equippedItem;
		//myVars2.cardsContainer.classList.add("blurred");
		myVars2.itemsWrapper.classList.add("blurred");
		try {
			const result = await promise;
			resolveFirst.resolve("Two-handed equipped");
		} catch (err) {
			resolveFirst.reject(err);
		}
		console.log("kek")
		myVars2.chooseHandContainer.classList.add("hidden");
		myVars2.equip2H.classList.add("hidden");
		myVars2.equip2H.querySelector(".secondItem").textContent = "";
		myVars2.equip2H.querySelector(".and").classList.add("hidden");
		myVars2.equip2H.querySelector(".thirdItem").textContent = "";
		//myVars2.cardsContainer.classList.remove("blurred");
		myVars2.itemsWrapper.classList.remove("blurred");
	}
}
function equipTwoHanded() {
	const item = cachedItems[properties.category][properties.type][name];
	if (everEquipped.has(name)) {
		item["both"].classList.remove("hidden");
		cache.get(name)["left"].classList.remove("hidden");
		cache.get(name)["right"].classList.remove("hidden");
		itemCard.classList.add("hidden");
		item.equipped = true;
	} else {
		makeItemCard("both", true);
		for (let i of ["left", "right"]) makeImg(i);
		infoToKeepCardHidden();
		everEquipped.set(name);
	}
	for (let i of ["left", "right"]) adjustSlot(i);
	saveCategoryAndType("both");
	setSlotContent("both");
	toggleEquippedCardsPanel();
	resolveFirst.resolve("Two-handed equipped");
}
function equipShield() {
	arm = "left";
	const item = cachedItems[properties.category][properties.type][name];
	if (everEquipped.has(name)) {
		showHiddenItem(arm);
		itemCard.classList.add("hidden");
		item.equipped = true;
	} else {
		makeItemCard(arm, true);
		makeImg(arm);
		infoToKeepCardHidden();
		everEquipped.set(name);
	}
	saveCategoryAndType(arm);
	setSlotContent(arm);
	adjustSlot(arm);
	toggleEquippedCardsPanel();
}
function showHiddenItem(arm) {
	cachedItems[properties.category][properties.type][name][arm].classList.remove("hidden");
	cache.get(name)[arm].classList.remove("hidden");
}
function infoToKeepCardHidden() {
	const item = cachedItems[properties.category][properties.type][name];
	item["category"] = properties.category;
	item["type"] = properties.type;
}
function confirmSameItem() {
	resolveSecond.resolve("Same item");
	myVars2.sameItem.classList.add("hidden");
}
function makeImg(slotName) {
	const img = document.createElement("img");
	img.src = cache.get(name).path;
	img.alt = name;
	img.title = name;
	switch (bodyPart) {
		case "body":
			img.width = 200;
			img.height = 200;
			break;
		case "head":
		case "left":
		case "right":
		case "legs":
			img.width = 160;
			img.height = 160;
			break;
		default:
			img.width = 140;
			img.height = 140;
	}
	img.style.display = "block";
	slot[slotName].appendChild(img);
	cache.get(name)[slotName] = img;
}
function adjustSlot(slotName) {
	slot[slotName].querySelector("p").classList.add("hidden");
	slot[slotName].classList.add("occupied");
}
function restoreSlot(slotName) {
	slot[slotName].querySelector("p").classList.remove("hidden");
	slot[slotName].classList.remove("occupied");
}
function toggleEquippedCardsPanel() {
	if (Object.values(slotContent).every(e => e.occupied === false)) {
		myVars2.equippedCards.classList.remove("showEquipped");
	} else {
		myVars2.equippedCards.classList.add("showEquipped");
	}
}
function calcTotalValues(itemCategory, itemType, sign, itemName) {
	const obj = classMap[itemCategory].getItemObject(itemType, itemName);
	switch (itemCategory) {
		case "Weapons":
			myVars2.totalDamage.textContent = Number(myVars2.totalDamage.textContent) + sign * Number(obj.damage);
			break;
		case "Armor":
			myVars2.totalArmor.textContent = Number(myVars2.totalArmor.textContent) + sign * Number(obj.armorRating);
	}
	myVars2.totalWeight.textContent = Number(myVars2.totalWeight.textContent) + sign * Number(obj.weight);
}


// СОРТИРОВКА ----------------------------------------------
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
	let fragment = document.createDocumentFragment();
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

// ЛЕНИВАЯ ЗАГРУЗКА ----------------------------------------------
function addImgPath(entries, observer) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			let image = entry.target.querySelector(".itemMiniature");
			image.src = image.dataset.src;
			image.onload = () => image.classList.add("loaded");
			observer.unobserve(entry.target);
		}
	});
}
function bigImgFunc() {
	const cache = new Map();
	return {
		show() {
			if (!this.getAttribute("src")) return;
			const srcName = this.getAttribute("src").replace("_S", "_B");
			if (!cache.has(srcName)) {
				const img = document.createElement("img");
				img.src = srcName;
				img.alt = "";
				img.width = 400;
				img.height = 400;
				img.style.display = "block";
				biggerIMGContainer.appendChild(img);
				cache.set(srcName, img);
				img.onload = () => biggerIMGContainer.classList.add("visible");
			} else {
				cache.get(srcName).style.display = "block";
				biggerIMGContainer.classList.add("visible");
			}
		},
		hide() {
			if (!this.getAttribute("src")) return;
			const srcName = this.getAttribute("src").replace("_S", "_B");
			biggerIMGContainer.classList.remove("visible");
			const entry = cache.get(srcName);
			if (entry) entry.style.display = "none";
		},
	};
}


// ОТКРЫТИЕ/СОКРЫТИЕ ПРЕДМЕТОВ ПОСЛЕ ПЕРВОГО ОТКРЫТИЯ ----------------------------------------------
function openResults() { // медленно работать, подумать, как ускорить
	let startTime = Date.now();
	myVars2.cardsList.scrollTop = 0;
	properties.type = this.innerText;
	myVars2.itemWindowHeader.innerText = properties.category.toUpperCase() + ": " + properties.type.toUpperCase();
	showThisTypeItems();
	sortingCategoryName();
	console.log(`openResults: ${Date.now()-startTime} ms`);
}
function toDefaultSortingOrder() {
	let fragment = document.createDocumentFragment();
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	if (!areItemsAtoZ.name[properties.category][properties.type]) {
		/*cachedItems[properties.category][properties.type].forEach(e => {
			e.style.order = e.dataset.nameIndex;
		});*/
		arr.sort((a, b) => a.nameIndex - b.nameIndex);
		arr.forEach(e => {
			if (!e.equipped) fragment.appendChild(e.card);
		});
		myVars2.cardsList.appendChild(fragment);
	}
	areItemsAtoZ.name[properties.category][properties.type] = true;
	areItemsAtoZ.weight[properties.category][properties.type] = false;
	areItemsAtoZ.other[properties.category][properties.type] = false;
	myVars2.selectedSortingBtns.forEach(e => {
		e.dataset.sortingSelected = false;
		e.dataset.sortingOrder = "desc";
	});
	myVars2.sortByName.dataset.sortingSelected = true;
	//sortingOrder = true;
	myVars2.sortingDirection.forEach(e => e.classList.add("hidden"));
	myVars2.sortByName.querySelector('[data-sorting-order="desc"]').classList.remove("hidden");
}
function hideItems() { // надо просто все объекты категории добавить в fragment и переменную сохранить, а потом снова туда же вставлять в showThisTypeItems
	let startTime = Date.now();
	Object.values(cachedItems[properties.category][properties.type]).forEach(e => {
		if (!e.equipped) e.card.classList.add("hidden");
	});
	//for (let i of myVars2.cardsList.children) i.classList.add("hidden");
	toDefaultSortingOrder();
	closeFilter();
	hideFilterCategories();
	uncheckAllCheckboxes();
	console.log(`hideItems: ${Date.now()-startTime} ms`);
}
function showThisTypeItems() {
	let startTime = Date.now();
	Object.values(cachedItems[properties.category][properties.type]).forEach(e => {
		if (!e.equipped) e.card.classList.remove("hidden");
	});
	console.log(`showThisTypeItems: ${Date.now()-startTime} ms`);
}

// ХРЕНЬ ----------------------------------------------
function cachingItems() { // возможно отпадёт необходимость в этой функции
	if (!(properties.category in cachedItems)) cachedItems[properties.category] = {};
	//if (!(properties.type in cachedItems)) cachedItems[properties.category][properties.type] = document.querySelectorAll(`[data-category-type="${properties.category} ${properties.type}"]`); 
	if (!(properties.type in cachedItems)) cachedItems[properties.category][properties.type] = {};
}

// КНОПКА СОРТИРОВКИ УРОН/БРОНЯ ----------------------------------------------
function sortingCategoryName() {
	/*if (cachedItems[properties.category][properties.type][0].dataset.damageIndex !== undefined) {
		myVars2.sortByOtherName.textContent = "Damage";
	} else if (cachedItems[properties.category][properties.type][0].dataset.armorIndex !== undefined) {
		myVars2.sortByOtherName.textContent = "Armor";
	}*/
	if (properties.category === "Weapons") {
		myVars2.sortByOtherName.textContent = "Damage";
	} else if (properties.category !== "Staves") {
		myVars2.sortByOtherName.textContent = "Armor";
	}
}

// ФИЛЬТР ----------------------------------------------
const filterOptions = document.querySelectorAll("#filterWindow input");
const filter = {
	filterWindow: document.querySelector("#filterWindow"),
	filterButton: document.querySelector("#filter"),
};
const filterCategories = {
	bodyPart: document.querySelector("#bodyPart"),
	smithingPerks: document.querySelector("#smithingPerks"),
	tempering: document.querySelector("#tempering"),
	magicSchool: document.querySelector("#magicSchool"),
	canWearHelmet: document.querySelector("#canWearHelmet"),
};

function filterToggle() {
	filter.filterWindow.classList.toggle("openFilter");
	filter.filterButton.classList.toggle("filter-active");
	showFilterCategories(properties.category);
	filter.filterWindow.scrollTop = 0;
}
function closeFilter() {
	filter.filterWindow.classList.remove("openFilter");
	filter.filterButton.classList.remove("filter-active");
}
// Может стоит добавить кнопку "Отменить все фильтры"?
// Так же стоит подумать о том, чтобы сохранялись параметры фильтрации для каждого перса, когда между ними переключаешься (но это будет муторно)
function uncheckAllCheckboxes() {
	for (let i of filterOptions) i.checked = false;
	checkedItems.splice(0, checkedItems.length);
}
function addFilterOptions(x) { // вот тут можно сделать кэш как у добавления предметов // эта функция не используется?
	const result = [
		x.artifact ? "isArtifact" : "notArtifact",
		x.enchantable ? "isEnchantable" : "notEnchantable",
		x.description ? "isEnchanted" : "notEnchanted"
	];
	if ("bodyPart" in x) result.push(x.bodyPart);
	switch (properties.category) {
		case "Armor":
		case "Weapons":
		case "Shields":
			result.push(x.perks || "noPerks");
			result.push(x.material ? "isSmithable" : "notSmithable");
			break;
		case "Staves":
			result.push(x.magicSchool);
			break;
		case "Clothing":
			result.push(x.canWearHelmet ? "canWearHelm" : "cannotWearHelm");
			break;
	}
	return result.join(" ");
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
			filterCategories.canWearHelmet.classList.remove("hidden");
			break;
	}
}
function hideFilterCategories() {
	for (let i of Object.values(filterCategories)) i.classList.add("hidden");
}
const checkedItems = []; // при закрытии или открытии фильтра очищать
const notCheckedItems = new Map();
function showChosenFilterOptions() { // на опциях фильтра находится
	const arr = Object.values(cachedItems[properties.category][properties.type]);
	let fragment = document.createDocumentFragment();
	if (this.checked) {
		checkedItems.push(this.value);
		for (let i of arr) {
			/*if (!i.dataset.filterInfo.includes(this.value)) {
				i.classList.add("hidden"); // у нас i теперь нет - нужно передавать
			}*/
			if (!i.equipped) {
				if (!Object.values(i).some(e => typeof e === "string" && e.includes(this.value))) {
					i.card.classList.add("hidden");
					//fragment.appendChild(i.card);
				}
			}
		}
		//notCheckedItems.set(this.value, fragment);
		//myVars2.cardsList.appendChild(fragment);
	} else {
		checkedItems.splice(checkedItems.indexOf(this.value), 1);
		for (let i of arr) {
			if (checkedItems.every(e => Object.values(i).some(a => typeof a === "string" && a.includes(e))) && !i.equipped) {
				i.card.classList.remove("hidden");
			}
		}
	}
	myVars2.cardsList.scrollTop = 0;
}