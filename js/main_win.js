import {dom} from "./dom.js";
import {raceSkills} from "./other.js";
import {setMagicResistances} from "./magic_resistances.js";
import {replaceOrKeepItem} from "./equip_items.js";
import {charSkills, currentSkillTree} from "./skills.js";
import {itemsOpen, hideItems} from "./items_menu.js";
import {calcWeaponSkillMod, calcArmorSkillMod, calcTotalValue} from "./calc_items_values.js";
import {displayUnarmedDamage} from "./unarmed_damage.js";
import {setRaceAbilityDesc} from "./passive_effects.js";
let anyBuild = false;
let menuOpen = false;
let chosenRace;
const matchQuery = window.matchMedia("(max-width: 909px");
if (matchQuery.matches) dom.H1.textContent = "SCB";
matchQuery.addEventListener("change", e => {
	if (e.matches) {
		dom.H1.textContent = "SCB";
	} else {
		dom.H1.textContent = "SKYRIM CHARACTER BUILDER";
	}
})
dom.saveCharacter.addEventListener("click", saveYourBuild);
for (const button of dom.closeModal) button.addEventListener("click", () => closeModal(button));
dom.closeMenu.addEventListener("click", toggleMenu);
dom.characterButton.addEventListener("click", e => {
	openCreateChar();
	focusCharName(e);
	hideWarning();
	if (menuOpen) toggleMenu();
});
dom.menuButton.addEventListener("click", () => {
	isThereAnyBuild();
	createBuildFirst();
	replaceOrKeepItem("No");
});
function toggleMenu() {
	dom.menu.classList.toggle("menu--slide-down");
	dom.menuButton.classList.toggle("is-open");
	dom.menuOptions.scrollTop = 0;
	for (const i of dom.typeContainers) {
		i.classList.add("hidden");
		i.parentElement.style.order = "";
	}
	menuOpen = !menuOpen;
}
function isThereAnyBuild() {
	clearTimeout(createBuildFirst.timerID);
	if (anyBuild) toggleMenu();
}
function createBuildFirst() {
	if (!anyBuild) {
		dom.warning.classList.remove("hidden");
		createBuildFirst.timerID = setTimeout(() => dom.warning.classList.add("hidden"), 2000);
	}
}
function hideWarning() {
	dom.warning.classList.add("hidden");
}
function openCreateChar() {
	dom.overlay.classList.remove("hidden");
	dom.createCharacter.classList.remove("hidden");
}
function saveYourBuild(event) {
	let a = dom.races, b = dom.characterName;
	if (b.value && a.value) {
		setMagicResistances(chosenRace, -1);
		const race = dom.races.value;
		chosenRace = race;
		for (const [key, value] of Object.entries(raceSkills[race])) {
			charSkills[key].ownSkill = value;
			charSkills[key].total = value;
			calcWeaponSkillMod(key);
			calcArmorSkillMod(key);
		}
		for (const i of document.querySelectorAll(".statistics")) i.classList.remove("hidden");
		if (!anyBuild) document.querySelector(".info-win__statistics-section .nothing-there-yet").classList.add("hidden");
		anyBuild = true;
		dom.currentName.textContent = b.value;
		dom.currentRace.textContent = a.value;
		dom.treeSkillLevel.textContent = charSkills[currentSkillTree].total;
		dom.skillTreeRace.textContent = race;
		setMagicResistances(race, 1);
		displayUnarmedDamage();
		calcTotalValue();
		setRaceAbilityDesc();
		return true;
	} else {
		validateInput(dom.characterName, dom.races);
		event.stopImmediatePropagation();
		return false;
	}
}
function closeModal(button) {
	const selectors = button?.dataset.closeModal?.split(" ") ?? [];
	for (const selector of selectors) {
		const el = document.querySelector(selector);
		if (el) el.classList.add("hidden");
	}
	removeValidation();
	replaceOrKeepItem("No");
	if (itemsOpen) hideItems();
}
function closeOnKey() {
	const overlay = dom.overlay?.dataset.closeModal?.split(" ").map(e => document.querySelector(e)) ?? [];
	for (const el of overlay) if (el) el.classList.add("hidden");
	replaceOrKeepItem("No");
	removeValidation();
	if (itemsOpen) hideItems();
}
function focusCharName(e) {
	e.preventDefault();
	dom.characterName.focus();
}
function validateInput(...args) {
	for (const arg of args) {
		if (!arg.value) {
			arg.classList.add("check-validity");
			arg.reportValidity();
		}
	}
}
function removeValidation() {
	dom.characterName.classList.remove("check-validity");
	dom.races.classList.remove("check-validity");
}
window.addEventListener("keydown", e => {
	if (e.key === "Escape") closeOnKey();
});
function isVisible(el) {
	return !el.classList.contains("hidden");
}
document.addEventListener("keydown", e => {
	if (e.key === "Enter" && isVisible(dom.createCharacter)) saveYourBuild(e) && closeOnKey();
});
export {chosenRace, toggleMenu};