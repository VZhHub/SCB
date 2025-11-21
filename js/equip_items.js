"use strict";
const dom4 = {
	// на главном экране
	equippedItemsContainer: document.querySelector("#equippedItemsContainer"),
	unequipMiniatureContainer: document.querySelector(".unequip-miniature-container"),
	unequipMiniatureName: document.querySelector(".unequip-miniature span"),
	//-----
	// контейнер с картами
	itemCards: document.querySelector(".items-window__cards-list"),
	// контейнер с вариантами одевания - преименуй!!
	equipOptionsContainer: document.querySelector(".equip-options-window"),
	// для заблюривания
	itemsWindowWrapper: document.querySelector(".items-window__wrapper"),
	// снятие предметов из меню -- функция ещё не установлена
	unequipItemFromMenu: document.querySelector(".unequip-item-from-menu"),
	unequipItemFromMenuBtns: document.querySelectorAll(".unequip-item-from-menu button"),
	unequipItemFromMenuName: document.querySelector(".unequip-item-from-menu span"),
	// обёртка для надетых предметов в меню
	equippedCardsWrapper: document.querySelector(".equipped-items__wrapper"),
	// выбор руки
	selectHand: document.querySelector(".choose-hand"),
	itemReplacement: document.querySelector(".item-replacement"),
	//equip2H: document.querySelector(".equip-2H"),
	sameItem: document.querySelector(".same-item"),
	sameItemButton: document.querySelector(".same-item__button"),
	// видимо, описание предметов на гл.экране
	descriptionContainer: document.querySelector("#descriptionContainer"),
	// экипированные карточки
	equippedCards: document.querySelector(".equipped-items"),
	totalDamage: document.querySelector(".total__damage"),
	totalMagRes: document.querySelector(".total__mag-res"),
	totalArmor: document.querySelector(".total__armor"),
	totalWeight: document.querySelector(".total__weight"),
	// использовалось в removeCard, видимо, связано с категорией предметов
	itemsWindow: document.querySelector(".items-window"),
	// используется в функции getSortingDirection в removeCard - ненужно
	selectedSortingBtns: document.querySelectorAll("[data-sorting-selected]"),
	// используется в removeCard для вставки карточек обратно - убрать
	cardsList: document.querySelector(".items-window__cards-list"),
	// новое
	itemReplacement: document.querySelector(".item-replacement"),
	itemReplacementFirstItem: document.querySelector(".item-replacement__first-item"),
	itemReplacementUnequipFirst: document.querySelector(".item-replacement__unequip-first"),
	itemReplacementUnequipSecond: document.querySelector(".item-replacement__unequip-second"),
	itemReplacementUnequipBody: document.querySelector(".item-replacement__unequip-body"),
	itemReplacementUnequipHead: document.querySelector(".item-replacement__unequip-head"),
	itemReplacementUnequipBoth: document.querySelector(".item-replacement__unequip-both"),
};
dom4.itemCards.addEventListener("click", e => {
	if (e.target.closest(".item-card__equip-button")) {
		equipItem(e.target);
	}
});
dom4.selectHand.querySelectorAll("button").forEach(button => button.addEventListener("click", e => chooseHand(e.target)));
dom4.itemReplacement.querySelectorAll("button").forEach(button => button.addEventListener("click", e => replaceOrKeepItem(e.target)));
dom4.equippedCardsWrapper.addEventListener("click", toggleItemDetails);
dom4.sameItemButton.addEventListener("click", confirmSameItem);
dom4.equippedCardsWrapper.addEventListener("click", e => {
	if (e.target.closest(".equipped-item__unequip-button")) unequipFromItemMenu(e.target.dataset.unequipButton);
});
dom4.unequipItemFromMenuBtns.forEach(button => button.addEventListener("click", e => replaceOrKeepItem(e.target)));
dom4.equippedItemsContainer.addEventListener("mouseover", e => {
	const slot = e.target.closest(".occupied");
	if (slot) slot.querySelector("button").classList.add("show");
});
dom4.equippedItemsContainer.addEventListener("mouseout", e => {
	const slot = e.target.closest(".occupied");
	if (slot) slot.querySelector("button").classList.remove("show");
});
dom4.equippedItemsContainer.addEventListener("click", e => {
	const button = e.target;
	if (button.classList.contains("inventory__button")) unequipFromMainWindow(button.dataset.slot);
});
dom4.unequipMiniatureContainer.querySelectorAll("button").forEach(button => button.addEventListener("click", e => replaceOrKeepItem(e.target)));
const slot = {
	Neck: document.querySelector("#neckSlot"),
	Head: document.querySelector("#headSlot"),
	Back: document.querySelector("#backSlot"),
	Arms: document.querySelector("#armsSlot"),
	Right: document.querySelector("#rightSlot"),
	Left: document.querySelector("#leftSlot"),
	Body: document.querySelector("#bodySlot"),
	Finger: document.querySelector("#fingerSlot"),
	Legs: document.querySelector("#legsSlot"),
};
const itemMenuEquipSlots = Object.fromEntries([...document.querySelectorAll(".equipped-item")].map(e => [e.dataset.itemMenuSlot, {
	itemSlot: e,
	details: e.querySelector(".equipped-item__details"),
	name: e.querySelector(".equipped-item__name"),
	otherName: e.querySelector(".equipped-item__stat-other-text"),
	otherValue: e.querySelector(".equipped-item__stat-other-value"),
	weightValue: e.querySelector(".equipped-item__stat-weight-value"),
	description: e.querySelector(".equipped-item__text"),
	img: e.querySelector(".equipped-item__img"),
}]));
const slotContent = {
	Neck: {
		equippedItem: null,
	},
	Head: {
		equippedItem: null,
	},
	Back: {
		equippedItem: null,
	},
	Arms: {
		equippedItem: null,
	},
	Right: {
		equippedItem: null,
	},
	Left: {
		equippedItem: null,
	},
	Both: {
		equippedItem: null,
	},
	Body: {
		equippedItem: null,
	},
	Finger: {
		equippedItem: null,
	},
	Legs: {
		equippedItem: null,
	},
};
const resolution = new Map();
const cachedImages = new Map();

async function equipItem(e) {
	const name = e.dataset.itemName;
	const item = cachedItems[properties.category][properties.type][name];
	const promise = new Promise((resolve, reject) => {
		resolution.set("First", {resolve, reject});
	});
	const param = distributor(item);
	slotChecker(param, name, item);
	try {
		const result = await promise;
		bundleFunc(result, item, name);
	} catch (err) {
		console.log(err);
	}
	resolution.clear();
}
function distributor(item) {
	if (item.hands !== undefined) {
		if (item.hands === "One") {
			return "One";
		} else {
			return "Two";
		}
	} else if (item.isShield !== undefined) {
		return "Shield";
	} else {
		return item.bodyPart;
	}
}
async function slotChecker(param, name, item) {
	if (param === "One") {
		openEquipOptionsContainer();
		openSelectHandWindow(name);
		const hand = await new Promise((resolve, reject) => {
			resolution.set("Second", {resolve, reject});
		});
		if (!slotContent[hand].equippedItem && !slotContent.Both.equippedItem) {
			closeSelectHandWindow();
			closeEquipOptionsContainer();
			resolution.get("First").resolve(hand);
		} else {
			if (name === slotContent[hand].equippedItem?.name) {
				const promise = new Promise((resolve, reject) => {
					resolution.set("Second", {resolve, reject});
				});
				try {
					closeSelectHandWindow();
					toggleSameItemWindow();
					const result = await promise;
				} catch (err) {
					resolution.get("First").reject(err);
				}
				closeEquipOptionsContainer();
			} else if (slotContent.Both.equippedItem) {
				closeSelectHandWindow();
				replacer(name, hand, "Both", false);
			} else {
				closeSelectHandWindow();
				replacer(name, hand, hand, false);
			}
		}
	} else if (param === "Two") { //двуручка
		if (!slotContent.Left.equippedItem && !slotContent.Right.equippedItem && !slotContent.Both.equippedItem) {
			resolution.get("First").resolve("Both");
		} else {
			openEquipOptionsContainer();
			replacer(name, "Both", "Both", false);
		}
	} else if (param === "Shield") {
		if (slotContent.Both.equippedItem) {
			openEquipOptionsContainer();
			replacer(name, "Left", "Both", false);
		} else if (slotContent.Left.equippedItem) {
			openEquipOptionsContainer();
			replacer(name, "Left", "Left", false);
		} else {
			resolution.get("First").resolve("Left");
		}
	} else {
		if (param === "Head") {
			if (!slotContent.Head.equippedItem) {
				if (!slotContent.Body.equippedItem) {
					resolution.get("First").resolve(param);
				} else {
					if (!slotContent.Body.equippedItem.cannotWearHelmet) {
						resolution.get("First").resolve(param);
					} else {
						openEquipOptionsContainer();
						replacer(name, param, "Body", true);
					}
				}
			} else {
				openEquipOptionsContainer();
				replacer(name, param, param, false);
			}
		} else if (param === "Body") {
			const isHooded = item.cannotWearHelmet || false;
			if (!slotContent.Body.equippedItem) {
				if (!slotContent.Head.equippedItem) {
					resolution.get("First").resolve(param);
				} else {
					if (!isHooded) {
						resolution.get("First").resolve(param);
					} else {
						openEquipOptionsContainer();
						replacer(name, param, "Head", true);
					}
				}
			} else {
				openEquipOptionsContainer();
				if (isHooded) {
					if (slotContent.Head.equippedItem) {
						replacer(name, param, "Both", true);
					}
				} else {
					replacer(name, param, param, false);
				}
			}
		} else {
			if (slotContent[param].equippedItem) {
				openEquipOptionsContainer();
				replacer(name, param, param, false);
			} else {
				resolution.get("First").resolve(param);
			}
		}
	}
}
async function replacer(name, firstSlot, secondSlot, isHooded) {
	const promise = new Promise((resolve, reject) => {
		resolution.set("Second", {resolve, reject});
	});
	openReplaceItemWindow(secondSlot, name, isHooded)
	const replaceOrKeep = await new Promise((resolve, reject) => {
		resolution.set("Third", {resolve, reject});
	});
	try {
		decideToReplaceItem(replaceOrKeep, secondSlot, isHooded);
		const result = await promise;
		resolution.get("First").resolve(firstSlot);
	} catch (err) {
		resolution.get("First").reject(err);
	}
	closeReplaceItemWindow()
	closeEquipOptionsContainer();
}
function decideToReplaceItem(decision, slotName, isHooded) {
	if (decision === "Yes") {
		if (slotName === "Both") {
			if (isHooded) {
				unequipItem("Head");
				unequipItem("Body");
			} else {
				if (slotContent.Both.equippedItem) {
					unequipItem("Both", true);
				} else {
					if (slotContent.Left.equippedItem) unequipItem("Left", true);
					if (slotContent.Right.equippedItem) unequipItem("Right", true);
				}
			}
		} else if (slotName === "Left" || slotName === "Right") {
			if (slotContent.Both.equippedItem) {
				unequipItem("Both");
			} else {
				unequipItem(slotName);
			}
		} else {
			unequipItem(slotName);
		}
		resolution.get("Second").resolve("Item replaced");
	} else {
		resolution.get("Second").reject("Item kept");
	}
}
function unequipItem(slotName, hideSlot = false, menuIsOpen) {
	const menuSlot = itemMenuEquipSlots[slotName];
	const item = slotContent[slotName].equippedItem;
	unequipAetherialCrown(slotContent.Head.equippedItem.name);
	menuSlot.img.removeChild(menuSlot.img.firstChild); 
	if (slotName === "Both") {
		slot.Left.removeChild(slot.Left.lastChild);
		slot.Right.removeChild(slot.Right.lastChild);
	} else {
		slot[slotName].removeChild(slot[slotName].lastChild);
	}
	adjustCardByCommonness(item, false, menuIsOpen);
	if (hideSlot) {
		menuSlot.itemSlot.classList.add("hidden");
		slotContent[slotName].equippedItem = null;
		adjustSlot(slotName, false);
	}
	toggleEquippedCardsPanel();
}
function adjustCardByCommonness(item, bool, menuIsOpen = true) {
	const meth = bool ? "add" : "remove";
	if (bool) {
		if (item.isCommon) {
			if (!item.firstEquipped) {
				item.firstEquipped = bool;
				item.equipped = bool;
			} else {
				item.secondEquipped = bool;
				item.card.classList[meth]("hidden");
			}
		} else {
			item.equipped = bool;
			item.card.classList[meth]("hidden");
		}
	} else {
		const sameCatType = item.category === properties.category && item.type === properties.type;
		if (item.isCommon) {
			if (item.secondEquipped) {
				item.secondEquipped = bool;
				if (sameCatType && menuIsOpen) item.card.classList[meth]("hidden");
			} else {
				item.firstEquipped = bool;
				item.equipped = bool;
			}
		} else {
			item.equipped = bool;
			if (sameCatType && menuIsOpen) item.card.classList[meth]("hidden");
		}
	}
}
function bundleFunc(result, item, name) {
	equipItemInItemWindowSlot(item, result);
	adjustCardByCommonness(item, true);
	makeImg(result, item, name);
	setSlotContent(result, item);
	adjustSlot(result, true);
	toggleEquippedCardsPanel();
	equipAetherialCrown(name);
	// нужно добавить описание и исправить функции ниже
	/*makeDescription(result); 
	calcTotalValues(properties.category, properties.type, 1, name);
	calcMagRes(name, 1);*/
}
function equipItemInItemWindowSlot(item, slotName) {
	const slot = itemMenuEquipSlots[slotName];
	slot.itemSlot.classList.remove("hidden");
	slot.name.textContent = item.name;
	if (item.armorRating !== undefined) {
		slot.otherName.textContent = "Armor:";
		slot.otherValue.textContent = item.armorRating;
	} else if (item.damage !== undefined) {
		slot.otherName.textContent = "Damage:";
		slot.otherValue.textContent = item.damage;
	} else {
		slot.otherName.textContent = "";
		slot.otherValue.textContent = "";
	}
	slot.weightValue.textContent = item.weight;
	slot.description.textContent = item.description;
	const imgCopy = item.img.cloneNode(true);
	slot.img.appendChild(imgCopy);
}
function makeImg(slotName, item, name) {
	if (!cachedImages.has(name)) {
		const img = document.createElement("img");
		img.src = item.pathM;
		img.alt = name;
		img.title = name;
		switch (slotName) {
			case "Body":
				img.width = 200;
				img.height = 200;
				break;
			case "Head":
			case "Left":
			case "Right":
			case "Legs":
			case "Both":
				img.width = 160;
				img.height = 160;
				break;
			default:
				img.width = 140;
				img.height = 140;
		}
		img.style.display = "block";
		cachedImages.set(name, img);
		if (slotName === "Both") {
			[slot.Left, slot.Right].forEach(s => s.appendChild(img.cloneNode(true)));
		} else {
			slot[slotName].appendChild(img.cloneNode(true));
		}
	} else {
		if (slotName === "Both") {
			[slot.Left, slot.Right].forEach(s => s.appendChild(cachedImages.get(name).cloneNode(true)));
		} else {
			slot[slotName].appendChild(cachedImages.get(name).cloneNode(true));
		}
	}
}
function setSlotContent(slotName, item) {
	slotContent[slotName].equippedItem = item;
}
function adjustSlot(slotName, bool) {
	const meth = bool ? "add" : "remove";
	if (slotName === "Both") {
		[slot.Left, slot.Right].forEach(s => {
			s.querySelector("p").classList[meth]("hidden");
			s.classList[meth]("occupied");
		});
	} else {
		slot[slotName].querySelector("p").classList[meth]("hidden");
		slot[slotName].classList[meth]("occupied");
	}
}
function toggleEquippedCardsPanel() {
	if (Object.values(slotContent).every(e => e.equippedItem === null)) {
		dom4.equippedCards.classList.remove("showEquipped");
	} else {
		dom4.equippedCards.classList.add("showEquipped");
	}
}
function chooseHand(e) {
	resolution.get("Second").resolve(e.textContent);
}
function replaceOrKeepItem(e) {
	resolution.get("Third").resolve(e.textContent);
}
function openEquipOptionsContainer() {
	dom4.equipOptionsContainer.classList.remove("hidden");
	dom4.itemsWindowWrapper.classList.add("blurred");
}
function closeEquipOptionsContainer() {
	dom4.equipOptionsContainer.classList.add("hidden");
	dom4.itemsWindowWrapper.classList.remove("blurred");
}
function openSelectHandWindow(name) {
	dom4.selectHand.classList.remove("hidden");
	dom4.selectHand.querySelector(".first-item").textContent = name; // не забыть исправить классы в html
}
function closeSelectHandWindow() {
	dom4.selectHand.classList.add("hidden");
}
function toggleSameItemWindow() {
	dom4.sameItem.classList.toggle("hidden");
}
function confirmSameItem() {
	resolution.get("Second").reject("Same item");
	toggleSameItemWindow();
}
function toggleItemDetails(e) {
	const button = e.target.closest(".equipped-item__info-button");
	if (button) {
		const selector = button.dataset.toggleDetails;
		const details = itemMenuEquipSlots[selector].details;
		if (!details.style.maxHeight) {
			details.style.maxHeight = details.scrollHeight + "px";
		} else {
			details.style.maxHeight = null;
		}
		button.classList.toggle("equipped-item__info-button--turn");
	}
}
function openReplaceItemWindow(slotName, name, isHooded) {
	dom4.itemReplacement.classList.remove("hidden");
	dom4.itemReplacementFirstItem.textContent = name;
	const firstP = dom4.itemReplacementUnequipFirst;
	if (isHooded) {
		const bodyName = slotContent.Body.equippedItem.name, headName = slotContent.Head.equippedItem.name;
		const unequipBody = dom4.itemReplacementUnequipBody, unequipHead = dom4.itemReplacementUnequipHead, unequipBoth = dom4.itemReplacementUnequipBoth;
		switch(slotName) {
			case "Body":
				unequipBody.classList.remove("hidden");
				unequipBody.querySelector(".item-replacement__second-item").textContent = bodyName;
				break;
			case "Head":
				unequipHead.classList.remove("hidden");
				unequipHead.querySelector(".item-replacement__second-item").textContent = headName;
				break;
			case "Both":
				unequipBoth.classList.remove("hidden");
				unequipBoth.querySelector(".item-replacement__second-item").textContent = bodyName;
				unequipBoth.querySelector(".item-replacement__third-item").textContent = headName;
				break;
		}
	} else if (slotName === "Both") {
		const left = slotContent.Left.equippedItem, right = slotContent.Right.equippedItem, both = slotContent.Both.equippedItem, secondP = dom4.itemReplacementUnequipSecond;
		if (both) {
			firstP.classList.remove("hidden");
			firstP.querySelector(".item-replacement__second-item").textContent = both.name;
		} else {
			if (left) {
				firstP.classList.remove("hidden");
				firstP.querySelector(".item-replacement__second-item").textContent = left.name;
			}
			if (right) {
				secondP.classList.remove("hidden");
				secondP.querySelector(".item-replacement__third-item").textContent = right.name;
			}
		}
	} else {
		firstP.classList.remove("hidden");
		firstP.querySelector(".item-replacement__second-item").textContent = slotContent[slotName].equippedItem.name;
	}
}
function closeReplaceItemWindow() {
	[dom4.itemReplacement, dom4.itemReplacementUnequipFirst, dom4.itemReplacementUnequipSecond, dom4.itemReplacementUnequipBody, dom4.itemReplacementUnequipHead, dom4.itemReplacementUnequipBoth].forEach(e => e.classList.add("hidden"));
}
async function unequipFromItemMenu(slotName) {
	openEquipOptionsContainer();
	toggleUnequipItemFromItemMenu();
	await unequipConditions(slotName, dom4.unequipItemFromMenuName, true);
	toggleUnequipItemFromItemMenu();
	closeEquipOptionsContainer();
}
function toggleUnequipItemFromItemMenu() {
	dom4.unequipItemFromMenu.classList.toggle("hidden");
}
async function unequipFromMainWindow(slotName) {
	toggleUnequipFromMainWindow();
	await unequipConditions(slotName, dom4.unequipMiniatureName, false);
	toggleUnequipFromMainWindow();
}
function toggleUnequipFromMainWindow() {
	dom4.unequipMiniatureContainer.classList.toggle("hidden");
	dom4.equippedItemsContainer.classList.toggle("blurred");
}
async function unequipConditions(slotName, nameField, menuIsOpen) {
	const defSlot = (slotName === "Left" || slotName === "Right") && slotContent.Both.equippedItem ? "Both" : slotName;
	nameField.textContent = slotContent[defSlot].equippedItem.name;
	const decision = await new Promise(resolve => resolution.set("Third", {resolve}));
	if (decision === "Yes") unequipItem(defSlot, true, menuIsOpen);
	resolution.clear();
}