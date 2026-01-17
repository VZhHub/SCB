import {dom} from "./dom.js";
import {isDesktop} from "./other.js";
import {slotContent} from "./equip_items.js";
import {setMagicResistances} from "./magic_resistances.js";
import {displayUnarmedDamage} from "./unarmed_damage.js";
import {setTheLordStone, setAncientKnowledge, setSeekerMod, displayPhysValues} from "./calc_items_values.js";
import {setBoonDescription} from "./passive_effects.js";
const standingStones = {
	"The Apprentice Stone": "Magicka regenerates 100% faster, but you have a 100% weakness to Magic.",
	"The Atronach Stone": "50% spell absorption, +50 Magicka, and Magicka regenerates 50% slower.",
	"The Lady Stone": "Health regenerates 25% faster and Stamina regenerates 25% faster.",
	"The Lord Stone": "+50 to Armor and 25% resistance to Magic.",
	"The Mage Stone": "All magic skills improve 20% faster.",
	"The Ritual Stone": "Once a day, you can reanimate nearby corpses to fight for you.",
	"The Serpent Stone": "Once a day, you can use a ranged paralyzing poison that paralyzes the opponent for 5 seconds and deals 5 damage per second.",
	"The Shadow Stone": "Once a day, you can become invisible for 60 seconds.",
	"The Steed Stone": "All worn armor is weightless and carries no movement penalty. You can carry 100 more weight.",
	"The Thief Stone": "All stealth skills improve 20% faster.",
	"The Tower Stone": "Once a day, you can unlock any lock up to Expert level.",
	"The Warrior Stone": "All combat skills improve 20% faster.",
};
const blessings = {
	"Agent of Dibella": "You do 10% more combat damage to the opposite sex.",
	"Agent of Mara": "15% Resist Magic.",
	"Ancient Knowledge": "Knowledge gained from the Lexicon gives you a 25% bonus when wearing Dwarven Armor and Blacksmithing increases 15% faster.",
	"Companion's Insight": "Your attacks, shouts, and destruction spells do no damage to your followers when in combat.",
	"Dragon Infusion": "Dragons do 25% less melee damage.",
	"Dragonborn Flame": "When your Fire Breath Shout kills an enemy, a fire wyrm emerges from their corpse to fight for you for 60 seconds.",
	"Dragonborn Force": "Your Unrelenting Force shout does more damage and using all three words may disintegrate enemies.",
	"Dragonborn Frost": "Your Frost Breath Shout encases foes in ice for 15 seconds.",
	"Eternal Spirit": "While Ethereal, you recover health 25% faster.",
	"The Fire Within": "Fire Breath shout deals 25% more damage.",
	"Force Without Effort": "You stagger 25% less and foes stagger 25% more.",
	"Lover's Insight": "Do 10% more damage and get 10% better prices from people of the opposite sex.",
	"Prowler's Profit": "Anywhere gems might be found, members of the Thieves Guild always seem to find a few more.",
	"Sailor's Repose": "Healing spells cure 10% more.",
	"Scholar's Insight": "Reading Skill Books gives you an extra Skill Point.",
	"Seeker of Might": "Combat skills are all 10% more effective.",
	"Seeker of Shadows": "Stealth skills are all 10% more effective.",
	"Seeker of Sorcery": "All spells cost 10% less magicka. Enchantments are 10% more powerful.",
	"Sinderion's Serendipity": "There is a 25% chance of creating a duplicate potion when using your alchemy skill.",
};
const tripletBlocks = {
	"Companion's Insight": ["Lover's Insight", "Scholar's Insight"],
	"Lover's Insight": ["Companion's Insight", "Scholar's Insight"],
	"Scholar's Insight": ["Companion's Insight", "Lover's Insight"],
	"Dragonborn Flame": ["Dragonborn Force", "Dragonborn Frost"],
	"Dragonborn Force": ["Dragonborn Flame", "Dragonborn Frost"],
	"Dragonborn Frost": ["Dragonborn Flame", "Dragonborn Force"],
	"Seeker of Might": ["Seeker of Shadows", "Seeker of Sorcery"],
	"Seeker of Shadows": ["Seeker of Might", "Seeker of Sorcery"],
	"Seeker of Sorcery": ["Seeker of Might", "Seeker of Shadows"]
};
const selectedBlessings = new Set();
const blessingsLabels = new Map();
const blessingsInputs = new Map();
const selectedStandingStones = new Set();
const standingStonesLabels = new Map();
const standingStonesInputs = new Map();
let standingStoneSavedInAC = null;
if (isDesktop) {
	dom.boonsOptions.addEventListener("mouseover", e => showBoonDetails(e));
	dom.boonsOptions.addEventListener("mouseout", e => hideBoonDetails(e));
} else {
	dom.boonsOptions.addEventListener("click", e => boonDetailsOnTap(e));
}
dom.boonsButton.addEventListener("click", () => {
	dom.par.textContent = "";
	dom.fieldsetDivs.forEach(e => e.scrollTop = 0);
	dom.overlay.classList.remove("hidden");
	dom.boons.classList.remove("hidden");
});
dom.standingStonesLabels.forEach(e => standingStonesLabels.set(e.textContent, e));
dom.standingStonesInputs.forEach(e => standingStonesInputs.set(e.value, e));
dom.standingStones.addEventListener("change", e => isStoneSelected(e));
dom.blessingsLabels.forEach(e => blessingsLabels.set(e.textContent, e));
dom.blessingsInputs.forEach(e => blessingsInputs.set(e.value, e));
dom.blessings.addEventListener("change", e => isBlessingSelected(e));
function showBoonDetails(e) {
	const boon = e.target;
	if (boon.closest(".boons__label")) {
		const key = boon.textContent;
		dom.par.textContent = standingStones[key] || blessings[key];
	}
}
function hideBoonDetails(e) {
	if (e.target.closest(".boons__label")) dom.par.textContent = "";
}
function boonDetailsOnTap(e) {
	const boon = e.target;
	if (boon.closest(".boons__label")) {
		const key = boon.value;
		if (!boon.checked) {
			dom.par.textContent = "";
		} else {
			dom.par.textContent = standingStones[key] || blessings[key];
		}
	}
}
function isStoneSelected(e) {
	const el = e.target.closest(".boons__label").querySelector("input");
	const name = el.value;
	if (selectedStandingStones.has(name)) {
		deselectStone(el);
		setMagicResistances(name, -1);
		setTheLordStone(name, -1);
		setBoonDescription(name, false);
		displayUnarmedDamage();
		displayPhysValues();
	} else {
		selectStone(el);
		setMagicResistances(name, 1);
		setTheLordStone(name, 1);
		setBoonDescription(name, true);
		displayUnarmedDamage();
		displayPhysValues();
	}
}
function selectStone(el) {
	if (checkAetherialCrown() && selectedStandingStones.size === 0) {
		addStandingStone(el);
	} else if (checkAetherialCrown() && selectedStandingStones.size === 1) {
		addStandingStone(el);
		saveStandingStoneInAC(el);
		disableOtherStones();
	} else {
		addStandingStone(el);
		disableOtherStones();
	}
}
function deselectStone(el) {
	if (checkAetherialCrown() && selectedStandingStones.size === 2) {
		if (standingStoneSavedInAC === el.value) removeSavedStandingStoneFromAC();
		removeStandingStone(el);
		enableOtherStones();
	} else if (checkAetherialCrown() && selectedStandingStones.size === 1) {
		removeSavedStandingStoneFromAC();
		removeStandingStone(el);
	} else {
		removeStandingStone(el);
		enableOtherStones();
	}
}
function checkAetherialCrown() {
	return slotContent.Head?.name === "Aetherial Crown";
}
function disableOtherStones() {
	for (const [key, value] of standingStonesInputs) {
		if (!selectedStandingStones.has(key)) {
			value.disabled = true;
			standingStonesLabels.get(key).style.pointerEvents = "none";
		}
	}
}
function enableOtherStones() {
	dom.standingStonesInputs.forEach(e => {
		standingStonesLabels.get(e.value).style.pointerEvents = "initial";
		e.disabled = false
	});
}
function addStandingStone(el) {
	selectedStandingStones.add(el.value);
}
function removeStandingStone(el) {
	selectedStandingStones.delete(el.value);
}
function removeSavedStandingStoneFromAC() {
	standingStoneSavedInAC = null;
}
function saveStandingStoneInAC(el) {
	standingStoneSavedInAC = el.value;
}
function equipAetherialCrown(name) {
	if (name === "Aetherial Crown" && selectedStandingStones.size === 1) {
		if (standingStoneSavedInAC) {
			setBoonDescription(standingStoneSavedInAC, true);
			setTheLordStone(standingStoneSavedInAC, 1);
			setMagicResistances(standingStoneSavedInAC, 1);
			displayUnarmedDamage();
			displayPhysValues();
			selectedStandingStones.add(standingStoneSavedInAC);
			standingStonesInputs.get(standingStoneSavedInAC).checked = true;
			standingStonesInputs.get(standingStoneSavedInAC).disabled = false;
		} else {
			enableOtherStones();
		}
	}
}
function unequipAetherialCrown(name) {
	if (name === "Aetherial Crown" && selectedStandingStones.size === 2) {
		setBoonDescription(standingStoneSavedInAC, false);
		setTheLordStone(standingStoneSavedInAC, -1);
		setMagicResistances(standingStoneSavedInAC, -1);
		displayUnarmedDamage();
		displayPhysValues();
		selectedStandingStones.delete(standingStoneSavedInAC);
		standingStonesInputs.get(standingStoneSavedInAC).checked = false;
		standingStonesInputs.get(standingStoneSavedInAC).disabled = true;
	} else if (name === "Aetherial Crown" && selectedStandingStones.size === 1) {
		disableOtherStones();
	}
}
function isBlessingSelected(e) {
	const el = e.target.closest(".boons__label").querySelector("input");
	const name = el.value;
	if (el.checked) {
		selectedBlessings.add(name);
		tripletBlocks[name]?.forEach(a => {
			blessingsLabels.get(a).style.pointerEvents = "none";
			blessingsInputs.get(a).disabled = true
		});
		setMagicResistances(name, 1);
		setAncientKnowledge(name, 1);
		setSeekerMod(name, 1);
		setBoonDescription(name, true);
		displayUnarmedDamage();
		displayPhysValues();
	} else {
		selectedBlessings.delete(name);
		tripletBlocks[name]?.forEach(a => {
			blessingsLabels.get(a).style.pointerEvents = "initial";
			blessingsInputs.get(a).disabled = false
		});
		setMagicResistances(name, -1);
		setAncientKnowledge(name, -1);
		setSeekerMod(name, -1);
		setBoonDescription(name, false);
		displayUnarmedDamage();
		displayPhysValues();
	}
}
export {selectedBlessings, equipAetherialCrown, unequipAetherialCrown, standingStones, blessings};