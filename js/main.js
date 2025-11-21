"use strict";
const dom = {
	// get c использовал для мобилок, пока не удалять
	get c() {return window.getComputedStyle(this.a).getPropertyValue("display");},
	// overlay используется в другом файле, осторожно
	overlay: document.querySelector("#overlay"),
	mainButtonsCustomization: document.querySelector(".main-buttons__customization"),
	mainButtonsBuilds: document.querySelector(".main-buttons__builds"),
	closeBuildsBtn: document.querySelector("#closeBuildsBtn"),
	saveBuild: document.querySelector("#saveBuild"),
	addNewBuildBtn: document.querySelector("#addNewBuildBtn"),
	renameBuildContainer: document.querySelector("#renameBuildContainer"),
	renameBuildWindow: document.querySelector("#renameBuildWindow"),
	deleteBuildContainer: document.querySelector("#deleteBuildContainer"),
	nameYourBuild: document.querySelector("#nameYourBuild"),
	races: document.querySelector("#races"),
	renameYourBuild: document.querySelector("#renameYourBuild"),
	warning: document.querySelector(".warning"),
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
	dom.addNewBuildBtn.addEventListener("click", openCreateCharMenu);
	dom.mainButtonsBuilds.addEventListener("click", toggleBuilds);
	dom.closeBuildsBtn.addEventListener("click", toggleBuilds);
	dom.mainButtonsCustomization.addEventListener("click", isThereAnyBuild);
	dom.mainButtonsCustomization.addEventListener("click", createBuildFirst);
}

// MAIN BUTTONS
const menuState = {
	builds: false,
	customization: false,
};
function unblockCustomizationButton() {
	dom.mainButtonsCustomization.disabled = !dom.mainButtonsCustomization.disabled;
	dom.buildsContainer.removeEventListener("transitionend", unblockCustomizationButton);
}
function toggleBuildHelper() {
	dom.customizationContainer.classList.add("customization-container--slide-right");
	dom.customizationContainer.classList.remove("customization-container--slide-left");
	dom.mainButtonsBuilds.disabled = !dom.mainButtonsBuilds.disabled;
	dom.mainButtonsCustomization.disabled = !dom.mainButtonsCustomization.disabled;
	dom.buildsContainer.removeEventListener("transitionend", toggleBuildHelper);
}
function toggleBuild() {
	menuState.builds = !menuState.builds;
	dom.buildsContainer.classList.toggle("builds-container--slide-left");
	dom.buildsContainer.classList.remove("builds-container--slide-right");
	dom.mainButtonsBuilds.classList.toggle("manageBuildsBtn--selected");
	dom.mainButtonsCustomization.classList.remove("customizeBuildsBtn--selected");
	if (!menuState.customization) {
		dom.mainButtonsCustomization.disabled = !dom.mainButtonsCustomization.disabled;
		dom.buildsContainer.addEventListener("transitionend", unblockCustomizationButton);
	}
	if (menuState.customization) {
		dom.customizationContainer.classList.remove("customization-container--on-top");
		dom.mainButtonsBuilds.disabled = !dom.mainButtonsBuilds.disabled;
		dom.mainButtonsCustomization.disabled = !dom.mainButtonsCustomization.disabled;
		dom.buildsContainer.addEventListener("transitionend", toggleBuildHelper);
		menuState.customization = !menuState.customization;
	}
	dom.buildsContainer.classList.add("builds-container--on-top");
	if (menuState.customization !== menuState.builds) dom.statistics.classList.add("moveLeft");
	if (!menuState.customization && !menuState.builds) dom.statistics.classList.remove("moveLeft");
}
function unblockBuildsButton() {
	dom.mainButtonsBuilds.disabled = !dom.mainButtonsBuilds.disabled;
	dom.customizationContainer.removeEventListener("transitionend", unblockBuildsButton);
}
function customizationMenuHelper() {
	dom.buildsContainer.classList.add("builds-container--slide-right");
	dom.buildsContainer.classList.remove("builds-container--slide-left");
	dom.mainButtonsBuilds.disabled = !dom.mainButtonsBuilds.disabled;
	dom.mainButtonsCustomization.disabled = !dom.mainButtonsCustomization.disabled;
	dom.customizationContainer.removeEventListener("transitionend", customizationMenuHelper);
}
function toggleCustomizationMenu() {
	menuState.customization = !menuState.customization;
	dom.customizationContainer.classList.toggle("customization-container--slide-left");
	dom.customizationContainer.classList.remove("customization-container--slide-right");
	dom.mainButtonsCustomization.classList.toggle("customizeBuildsBtn--selected");
	dom.mainButtonsBuilds.classList.remove("manageBuildsBtn--selected");
	if (!menuState.builds) {
		dom.mainButtonsBuilds.disabled = !dom.mainButtonsBuilds.disabled;
		dom.customizationContainer.addEventListener("transitionend", unblockBuildsButton);
	}
	if (menuState.builds) {
		dom.buildsContainer.classList.remove("builds-container--on-top");
		dom.mainButtonsCustomization.disabled = !dom.mainButtonsCustomization.disabled;
		dom.mainButtonsBuilds.disabled = !dom.mainButtonsBuilds.disabled;
		dom.customizationContainer.addEventListener("transitionend", customizationMenuHelper);
		menuState.builds = !menuState.builds;
	}
	dom.customizationContainer.classList.add("customization-container--on-top");
	if (menuState.customization !== menuState.builds) dom.statistics.classList.add("moveLeft");
	if (!menuState.customization && !menuState.builds) dom.statistics.classList.remove("moveLeft");
}
function toggleBuilds() {
	clearTimeout(createBuildFirst.timerID);
	dom.warning.classList.add("hidden");
	toggleBuild();
	document.querySelectorAll(".toggleOptions").forEach(el => el.classList.remove("toggleOptions"));
}
function toggleCustomizations() {
	toggleCustomizationMenu();
	dom.customizationMenu.scrollTop = 0;
	for (let i of dom.itemsTypesContainer) {
		i.classList.add("hidden");
		i.parentElement.style.order = "";
	}
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