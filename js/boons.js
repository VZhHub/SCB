const dom6 = {
	boonsOptions: document.querySelector(".boons__options"),
	standingStones: document.querySelector(".boons__fieldset:first-child"),
	standingStonesInputs: document.querySelectorAll(".boons__fieldset:first-child input"),
	blessings: document.querySelector(".boons__fieldset:last-child"),
	blessingsInputs: document.querySelectorAll(".boons__fieldset:last-child input"),
	par: document.querySelector(".boons__p"),
};
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
};// не забудь про этериевую корону!!
// также стоит подумать про другие параметры - абсорпция маны, скорость регенерации итд - писать всё это в пассивные эффекты
const blessings = {
	"Agent of Dibella": "You do 10% more combat damage to the opposite sex.",
	"Agent of Mara": "15% Resist Magic.",
	//"Ahzidals Genius": "Increases your Enchanting skill by 10 points if wearing any four relics of Ahzidal.", // напиши функцию, которая будет проверять, экипированы ли все 4 (кольца тоже считаются)
	"Ancient Knowledge": "Knowledge gained from the Lexicon gives you a 25% bonus when wearing Dwarven Armor and Blacksmithing increases 15% faster.",
	"Companion's Insight": "Your attacks, shouts, and destruction spells do no damage to your followers when in combat.", // можно выбрать только одно из трёх - Companion's Insight, Lover's Insight, Scholar's Insight
	"Dragon Infusion": "Dragons do 25% less melee damage.",
	"Dragonborn Flame": "When your Fire Breath Shout kills an enemy, a fire wyrm emerges from their corpse to fight for you for 60 seconds.", // можно выбрать только одно из трёх - Dragonborn Flame, Dragonborn Force, Dragonborn Frost
	"Dragonborn Force": "Your Unrelenting Force shout does more damage and using all three words may disintegrate enemies.",
	"Dragonborn Frost": "Your Frost Breath Shout encases foes in ice for 15 seconds.",
	"Eternal Spirit": "While Ethereal, you recover health 25% faster.", // можно выбрать только одно из трёх - Eternal Spirit, Force Without Effort, The Fire Within
	"The Fire Within": "Fire Breath shout deals 25% more damage.",
	"Force Without Effort": "You stagger 25% less and foes stagger 25% more.",
	"Lover's Insight": "Do 10% more damage and get 10% better prices from people of the opposite sex.",
	// Nightingale Armor Full Set - см. additional effects в items_constructor. Возможно, тоже стоит поступить как с комплектом Азидала
	"Prowler's Profit": "Anywhere gems might be found, members of the Thieves Guild always seem to find a few more.",
	"Sailor's Repose": "Healing spells cure 10% more.",
	"Scholar's Insight": "Reading Skill Books gives you an extra Skill Point.",
	"Seeker of Might": "Combat skills are all 10% more effective.", // можно выбрать только одно из трёх - Seeker of Might, Seeker of Shadows, Seeker of Sorcery
	"Seeker of Shadows": "Stealth skills are all 10% more effective.",
	"Seeker of Sorcery": "All spells cost 10% less magicka. Enchantments are 10% more powerful.",
	// Shrouded Armor Full Set - см. additional effects в items_constructor. Возможно, тоже стоит поступить как с комплектом Азидала
	"Sinderion's Serendipity": "There is a 25% chance of creating a duplicate potion when using your alchemy skill.",
};

// пассивки для вампов различаются в зависимости от фазы - та ещё проблема
const vampires = {
	"Champion of the Night": "Illusion spells cast by a Vampire are 25% more powerful.",
	"Nightstalker's Footsteps": "25% harder to detect while sneaking.",
	"Resist Disease": "Your Vampiric blood gives you 100% resistance to disease.",
	"Resist Poison": "Your Vampiric blood gives you 100% resistance to poison.",
	//"Resist Frost": // в зависимости от фазы от 20 % до 50%
	//"Weakness to Fire": // в зависимости от фазы от 20 % до 50%
	//"Weakness to Sunlight": // в зависимости от фазы от снижает атрибуты от -15 до -60
};
const werewolf = {
	"Beast Blood": "Grants a 100% resistance to all diseases, but also prevents you from gaining resting bonuses.",
};
const standingStonesEffects = {
	"The Apprentice Stone": {
		magic: -1,
	},
	"The Lord Stone": {
		armor: 50,
		magic: 0.25,
	},
};

dom6.boonsOptions.addEventListener("mouseover", e => showBoonDetails(e));
dom6.boonsOptions.addEventListener("mouseout", e => hideBoonDetails(e));

function showBoonDetails(e) {
	const boon = e.target;
	if (boon.closest(".boons__label")) {
		const key = boon.textContent;
		dom6.par.textContent = standingStones[key] || blessings[key];
	}
}
function hideBoonDetails(e) {
	if (e.target.closest(".boons__label")) dom6.par.textContent = "";
}

const selectedStandingStones = new Set();
const standingStonesInputs = new Map();
let standingStoneSavedInAC = null;

dom6.standingStonesInputs.forEach(e => standingStonesInputs.set(e.value, e));

dom6.standingStones.addEventListener("change", e => isStoneSelected(e));

function isStoneSelected(e) {
	const el = e.target.closest(".boons__label").querySelector("input");
	if (selectedStandingStones.has(el.value)) {
		deselectStone(el);
	} else {
		selectStone(el);
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
	return slotContent.Head.equippedItem?.name === "Aetherial Crown";
}
function disableOtherStones() {
	for (let [key, value] of standingStonesInputs) {
		if (!selectedStandingStones.has(key)) {
			value.disabled = true;
		}
	} 
}
function enableOtherStones() {
	dom6.standingStonesInputs.forEach(e => e.disabled = false);
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
		selectedStandingStones.delete(standingStoneSavedInAC);
		standingStonesInputs.get(standingStoneSavedInAC).checked = false;
		standingStonesInputs.get(standingStoneSavedInAC).disabled = true;
	} else if (name === "Aetherial Crown" && selectedStandingStones.size === 1) {
		disableOtherStones();
	}
}

//const selectedBlessings = new Set(); // пока не нужно
const blessingsInputs = new Map();
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

dom6.blessingsInputs.forEach(e => blessingsInputs.set(e.value, e));

dom6.blessings.addEventListener("change", e => isBlessingSelected(e));

function isBlessingSelected(e) {
	const el = e.target.closest(".boons__label").querySelector("input");
	const name = el.value;
	if (el.checked) {
		//selectedBlessings.add(name);
		tripletBlocks[name]?.forEach(a => blessingsInputs.get(a).disabled = true);
	} else {
		//selectedBlessings.delete(name);
		tripletBlocks[name]?.forEach(a => blessingsInputs.get(a).disabled = false);
	}
}