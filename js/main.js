"use strict";
const dom = {
	searchResult: document.querySelector("#searchResult"),
	// get c использовал для мобилок, пока не удалять
	get c() {return window.getComputedStyle(this.a).getPropertyValue("display");},
	searchInput: document.querySelector("#searchInput"),
	searchTemplate: document.querySelector("#searchTemplate"),
	clearInput: document.querySelector("#clearInput"),
	magnifier: document.querySelector("#magnifier"),
	searchBtn: document.querySelector("#searchBtn"),
	// overlay используется в другом файле, осторожно
	overlay: document.querySelector("#overlay"),
	customizeBuildsBtn: document.querySelector("#customizeBuildsBtn"),
	manageBuildsBtn: document.querySelector("#manageBuildsBtn"),
	closeBuildsBtn: document.querySelector("#closeBuildsBtn"),
	saveBuild: document.querySelector("#saveBuild"),
	addNewBuildBtn: document.querySelector("#addNewBuildBtn"),
	renameBuildContainer: document.querySelector("#renameBuildContainer"),
	renameBuildWindow: document.querySelector("#renameBuildWindow"),
	deleteBuildContainer: document.querySelector("#deleteBuildContainer"),
	nameYourBuild: document.querySelector("#nameYourBuild"),
	races: document.querySelector("#races"),
	renameYourBuild: document.querySelector("#renameYourBuild"),
	warning: document.querySelector("#warning"),
	buildSubmenuContainer: document.querySelector("#buildSubmenuContainer"),
	yourBuildName: document.querySelector("#yourBuildName"),
	noBuildsYet: document.querySelector("#noBuildsYet"),
	newBuildsContainer: document.querySelector("#newBuildsContainer"),
	buildsContainer: document.querySelector(".builds-container"),
	customizationContainer: document.querySelector(".customization-container"),
	createBuildContainer: document.querySelector("#createBuildContainer"),
	closeCustomizeBtn: document.querySelector("#closeCustomizeBtn"),
	clearForm: document.querySelectorAll("[data-clear-form]"),
	openModal: document.querySelectorAll("[data-open-modal]"),
	closeModal: document.querySelectorAll("[data-close-modal]"),
	deleteBuildYes: document.querySelector("#deleteBuildContainer button:last-of-type"),
	myBuildsTemplate: document.querySelector("#myBuildsTemplate"),
	buildName: document.querySelector("#buildName"),
	buildRace: document.querySelector("#buildRace"),
	buildLevel: document.querySelector("#buildLevel"),
	deleteBuildName: document.querySelector("#deleteBuild span"),
	itemsTypesContainer: document.querySelectorAll("#customizationMenu>div>div"),
	customizationMenu: document.querySelector("#customizationMenu"),
	header: document.querySelector("header"),
	main: document.querySelector("main"),
	statistics: document.querySelector("#statistics"),
};
// Некоторые функции используют очистку или фокус - можно соединить

// СТАРЫЙ ВАРИАНТ ПОИСКА ПРЕДМЕТОВ - пока не удалять
/*
dom.searchInput.addEventListener("input", findSomething);
function findSomething() {
	clear(dom.searchResult);
	if (dom.searchInput.value.toUpperCase() === "") {
		showEl(dom.magnifier, "grid");
		hideEl(dom.clearInput);
		return false;
	}
	hideEl(dom.magnifier);
	showEl(dom.clearInput, "grid");
	let guess = dom.searchInput.value.toUpperCase().match(/\S+/g);
	for(let i of lightArmorSortedMap.keys()) {
		if(guess.every((e) => i.toUpperCase().includes(e))) {
			let node = dom.searchTemplate.content.cloneNode(true);
			node.children[0].children[1].innerText = lightArmorSortedMap.get(i).name;
			dom.searchResult.appendChild(node);
		}
	}
}*/

// ОЧИСТКА РЕЗУЛЬТАТОВ ПОИСКА
/*
function clear(x) {
	while (x.firstChild) {
		x.removeChild(x.firstChild);
	}
}*/

// НЕ ЗАБУДЬ ПРО TOUCHSTART

if (window.matchMedia("(pointer:fine)").matches) {
	dom.saveBuild.addEventListener("click", saveYourBuild);
	dom.renameBuildWindow.children[3].addEventListener("click", saveRenamed);
	dom.deleteBuildYes.addEventListener("click", deleteBuildYes);
	dom.clearForm.forEach(e => {
		e.addEventListener("click", () => clearForms(e));
	});
	dom.openModal.forEach(button => {
		button.addEventListener("click", () => openModal(button));
	});
	dom.closeModal.forEach(button => {
		button.addEventListener("click", () => closeModal(button));
	});
	dom.closeCustomizeBtn.addEventListener("click", toggleCustomizations);
	dom.searchBtn.addEventListener("click", () => dom.searchInput.focus());
	dom.addNewBuildBtn.addEventListener("click", openCreateCharMenu);
	dom.manageBuildsBtn.addEventListener("click", toggleBuilds);
	dom.closeBuildsBtn.addEventListener("click", toggleBuilds);
	dom.customizeBuildsBtn.addEventListener("click", isThereAnyBuild);
	dom.customizeBuildsBtn.addEventListener("click", createBuildFirst);
} else {
	dom.saveBuild.addEventListener("touchstart", saveYourBuild);
	dom.renameBuildWindow.children[3].addEventListener("touchstart", saveRenamed);
	dom.deleteBuildYes.addEventListener("touchstart", deleteBuildYes);
	dom.clearForm.forEach(e => {
		e.addEventListener("touchstart", () => clearForms(e));
	});
	dom.openModal.forEach(button => {
		button.addEventListener("touchstart", () => openModal(button));
	});
	dom.closeModal.forEach(button => {
		button.addEventListener("touchstart", () => closeModal(button));
	});
	dom.closeCustomizeBtn.addEventListener("touchstart", toggleCustomizations);
	dom.searchBtn.addEventListener("touchstart", () => dom.searchInput.focus());
	dom.addNewBuildBtn.addEventListener("touchstart", openCreateCharMenu);
	dom.manageBuildsBtn.addEventListener("touchstart", toggleBuilds);
	dom.closeBuildsBtn.addEventListener("touchstart", toggleBuilds);
	dom.customizeBuildsBtn.addEventListener("touchstart", isThereAnyBuild);
	dom.customizeBuildsBtn.addEventListener("touchstart", createBuildFirst);
}

// MAIN BUTTONS
function toggleBuilds() {
	clearTimeout(createBuildFirst.timerID);
	dom.warning.classList.add("hidden");
	dom.buildsContainer.classList.toggle("builds-container--slide-out-right");
	//dom.header.classList.toggle("moveLeft");
	//dom.main.classList.toggle("moveLeft");
	dom.statistics.classList.toggle("moveLeft");
	dom.customizeBuildsBtn.disabled = !dom.customizeBuildsBtn.disabled;
	document.querySelectorAll(".toggleOptions").forEach(el => el.classList.remove("toggleOptions"));
}
function isThereAnyBuild() {
	clearTimeout(createBuildFirst.timerID);
	if (buildsCount) {
		toggleCustomizations();
	}
}
function createBuildFirst() {
	if (!buildsCount) {
		dom.warning.classList.remove("hidden");
		createBuildFirst.timerID = setTimeout(() => dom.warning.classList.add("hidden"), 2000);
	}
}
//-----------------------------------


const state = {
	opened: [],
};
const events = ["click", "keydown"];
// В deleteBuildYes добавить очистку yourBuilds
const yourBuilds = [];
let buildsCount = 0;
function createNode() {}
// SAVE BUILD
function saveYourBuild(event) {
	let a = dom.races,
	b = dom.nameYourBuild,
	node = dom.myBuildsTemplate.content.cloneNode(true),
	optionsButton = node.querySelector(".optionsButton"),
	miniOptions = node.querySelector(".options"),
	characterName = node.querySelector(".characterName"),
	characterRace = node.querySelector(".characterRace"),
	buildInfo = node.querySelector(".buildInfo"),
	myBuild = node.querySelector(".myBuild"),
	rename = miniOptions.children[0],
	deleteBuild = miniOptions.children[1];
	if (b.value && a.value) {
		dom.newBuildsContainer.insertBefore(node, dom.newBuildsContainer.children[0]);
		dom.noBuildsYet.classList.add("hidden");
		yourBuilds.push(b.value);
		buildsCount++;
		//dom.yourBuildName.textContent = b.value; // Надо делать классом вместе с characterName
		characterName.textContent = b.value;
		characterRace.textContent = a.value;
		dom.buildName.textContent = b.value;
		dom.buildRace.textContent = a.value;
		//document.getElementById("yourCharacterLevel").textContent = "Level: 1"; // Не удалять, готово!!!
		if (window.matchMedia("(pointer:fine)").matches) {
			optionsButton.addEventListener("click", openMiniOptions);
			rename.addEventListener("click", () => openModal(rename));
			rename.addEventListener("click", openRenameBuild);
			buildInfo.addEventListener("click", () => selectBuild(buildInfo));
			deleteBuild.addEventListener("click", () => openModal(deleteBuild));
			deleteBuild.addEventListener("click", openDeleteBuild);
			} else {
			optionsButton.addEventListener("touchstart", openMiniOptions);
			rename.addEventListener("touchstart", () => openModal(rename));
			rename.addEventListener("touchstart", openRenameBuild);
			buildInfo.addEventListener("touchstart", () => selectBuild(buildInfo));
			deleteBuild.addEventListener("touchstart", () => openModal(deleteBuild));
			deleteBuild.addEventListener("touchstart", openDeleteBuild);
		}
		selectBuild(buildInfo);
		return true;
	} else {
		validateInput(dom.nameYourBuild, dom.races);
		event.stopImmediatePropagation();
		return false;
	}
}

// TOGGLE MODALS
function openModal(button) {
	const selectors = button?.dataset.openModal?.split(" ") ?? [];
	for (let selector of selectors) {
		const el = document.querySelector(selector);
		if (el) el.classList.remove("hidden");
	}
}
function closeModal(button = null) {
	if (button != null) {
		const selectors = button?.dataset.closeModal?.split(" ") ?? [];
		for (let selector of selectors) {
			const el = document.querySelector(selector);
			if (el) el.classList.add("hidden");
		}
	} else {
		const overlay = dom.overlay?.dataset.closeModal?.split(" ").map(e => document.querySelector(e)) ?? [];
		for (let el of overlay) {
			if (el) el.classList.add("hidden");
		}
	}
	removeValidation(button);
}
//-----------------------------------


// ТОЛЬКО ДЛЯ МОБИЛЬНЫХ!
/*visualViewport.onresize = function() {
	let a = dom.buildSubmenuContainer, b = dom.renameBuildContainer;
	a.style.height = visualViewport.height + "px";
	b.style.height = visualViewport.height + "px";
}*/
//--------------------------------------------------------



// CREATE CHARACTER MENU
function openCreateCharMenu() {
	dom.nameYourBuild.focus();
	document.querySelectorAll(".toggleOptions").forEach(el => el.classList.remove("toggleOptions"));
}
//-------------------------------------------------

// elements-decor FOR CREATING CHAR
// Возможно можно как removeValidation
function validateInput(...args) {
	for (let arg of args) {
		if (!arg.value) {
			arg.classList.add("checkValidity");
			arg.reportValidity();
		}
	}
}
function removeValidation(arg = null) {
	const selectors = arg?.dataset.removeValidation?.split(" ") ?? [];
	if (arg != null) {
		for (let selector of selectors) {
			const el = document.querySelector(selector);
			el.classList.remove("checkValidity");
		}
	} else {
		const overlay = dom.overlay?.dataset.removeValidation?.split(" ") ?? [];
		overlay.forEach(e => {
			document.querySelector(e).classList.remove("checkValidity");
		});
	}
}
function clearForms(arg) {
	const selectors = arg.dataset.clearForm?.split(" ") ?? [];
	for (let selector of selectors) {
		const el = document.querySelector(selector);
		el.value = "";
	}
}
//-------------------------------------------

// SELECT BUILD
function selectedBuild(x) {
	document.querySelectorAll(".buildInfo").forEach(e => {
		e.classList.remove("selected-build");
	});
	x.classList.add("selected-build");
}
function selectBuild(arg) {
	selectedBuild(arg);
	selectBuild.selectedBuild = arg.parentElement;
	const charName = arg.querySelector(".characterName").textContent;
	const charRace = arg.querySelector(".characterRace").textContent;
	const charLevel = arg.querySelector(".characterLevel").textContent;
	dom.buildName.textContent = charName;
	dom.buildRace.textContent = charRace;
	dom.buildLevel.textContent = charLevel;
	document.querySelectorAll(".toggleOptions").forEach(el => el.classList.remove("toggleOptions"));
}
//---------------------------------------------

// MINI OPTIONS
function openMiniOptions() {
	const buildName = this.parentElement.querySelector(".characterName");
	openMiniOptions.buildToDelete = this.parentElement;
	openMiniOptions.buildName = buildName;
	const el = this.parentElement.lastElementChild;
	const isOpen = el.classList.contains("toggleOptions");
	document.querySelectorAll(".toggleOptions").forEach(el => el.classList.remove("toggleOptions"));
	if (!isOpen) el.classList.add("toggleOptions");
}
function openRenameBuild() {
	dom.renameYourBuild.value = openMiniOptions.buildName.textContent;
	dom.renameYourBuild.focus();
}
function saveRenamed(event) {
	const newName = dom.renameYourBuild.value;
	if (!newName) {
		validateInput(dom.renameYourBuild);
		event.stopImmediatePropagation();
		return false;
	} else {
		openMiniOptions.buildName.textContent = newName;
		dom.buildName.textContent = newName;
		return true;
	}
}
function openDeleteBuild() {
	dom.deleteBuildName.textContent = openMiniOptions.buildName.textContent;
}
function deleteBuildYes() {
	const selectedEl = selectBuild.selectedBuild, miniOptions = openMiniOptions.buildToDelete;
	if (selectedEl === miniOptions) {
		if (miniOptions.previousElementSibling?.firstElementChild) {
			selectBuild(miniOptions.previousElementSibling.firstElementChild);
		} else if (miniOptions.nextElementSibling?.firstElementChild) {
			selectBuild(miniOptions.nextElementSibling.firstElementChild);
		}
	}
	openMiniOptions.buildToDelete.remove();
	buildsCount--;
	if (!dom.newBuildsContainer.childElementCount) dom.noBuildsYet.classList.remove("hidden");
	return true;
}
// ФУНКЦИИ УДАЛЕНИЯ, ДОБАВЛЕНИЯ И ПЕРЕИМЕНОВАНИЯ НИЧЕГО НЕ ДЕЛАЮТ С РАСОЙ И УРОВНЕМ!!!!


function toggleCustomizations() {
	dom.customizationContainer.classList.toggle("customization-container--slide-out-right");
	dom.customizationMenu.scrollTop = 0;
	//dom.header.classList.toggle("moveLeft");
	//dom.main.classList.toggle("moveLeft");
	dom.statistics.classList.toggle("moveLeft");
	dom.manageBuildsBtn.disabled = !dom.manageBuildsBtn.disabled;
	for (let i of dom.itemsTypesContainer) {
		i.classList.add("hidden");
		i.parentElement.style.order = "";
	}
}
//---------------------------------------------------------------


window.addEventListener("keydown", e => {
	if (e.key === "Escape") {
		closeModal();
	}
});
function isVisible(el) {
	return !el.classList.contains("hidden");
}
document.addEventListener("keydown", e => {
	if (e.key === "Enter") {
		switch (true) {
			case isVisible(dom.createBuildContainer):
				saveYourBuild(e) && closeModal();
				break;
			case isVisible(dom.renameBuildContainer):
				saveRenamed(e) && closeModal();
				break;
			case isVisible(dom.deleteBuildContainer):
				deleteBuildYes() && closeModal();
				break;
		}
	}
});