const mapPassiveEffects = new Map();
const dlPassEff = document.querySelector(".passive-effects-dl");
const passEffTemp = document.querySelector(".passive-effects-template");
let passEffcounter = 0, racialPassive = false;
function setBoonDescription(boon, bool) {
	const boonDesc = standingStones[boon] ?? blessings[boon];
	if (bool) {
		const fragment = passEffTemp.content.cloneNode(true);
		const term = fragment.querySelector(".passive-effects-term");
		const desc = fragment.querySelector(".passive-effects-desc");
		term.textContent = boon;
		desc.textContent = boonDesc;
		dlPassEff.appendChild(fragment);
		mapPassiveEffects.set(boon, [term, desc]);
		if (passEffcounter === 0 && !racialPassive) toggleTitle(".passive-effects-wrapper");
		++passEffcounter;
		document.querySelector(".passive-effects-wrapper .nothing-there-yet").classList.add("hidden");
	} else {
		for (const i of mapPassiveEffects.get(boon)) i.remove();
		mapPassiveEffects.delete(boon);
		--passEffcounter;
		if (passEffcounter === 0 && !racialPassive) toggleTitle(".passive-effects-wrapper");
	}
}
function setRaceAbilityDesc() {
	console.log(chosenRace)
	if (!racialBonuses[chosenRace]) return;
	for (const [key, value] of Object.entries(racialBonuses[chosenRace])) {
		const fragment = passEffTemp.content.cloneNode(true);
		const term = fragment.querySelector(".passive-effects-term");
		const desc = fragment.querySelector(".passive-effects-desc");
		term.textContent = key;
		desc.textContent = value;
		dlPassEff.appendChild(fragment);
	}
	racialPassive = true;
	document.querySelector(".passive-effects-wrapper .nothing-there-yet").classList.add("hidden");
}
const racialBonuses = {
	Argonian: {
		"Resist Disease": "Your Argonian blood gives you 50% resistant to disease.",
		"Waterbreathing": "You can stay underwater without drowning.",
	},
	Breton: {
		"Resist Magic": " Breton blood grants you a 25% resistance to magic.",
	},
	"Dark Elf": {
		"Resist Fire": "Your Dark Elf blood gives you 50% resistance to fire.",
	},
	"High Elf": {
		Highborn: "High Elves are born with 50 extra magicka.",
	},
	Imperial: {
		"Imperial Luck": "Imperials always find more gold.",
	},
	Khajiit: {
		Claws: "Khajiit claws do 12 points of damage in addition to unarmed damage.",
	},
	Nord: {
		"Resist Frost": "Your Nord blood gives you 50% resistance to frost.",
	},
	Redguard: {
		"Resist Poison": "Your Redguard blood gives you 50% resistance to poison.",
	},
	"Wood Elf": {
		"Resist Disease": "Your Wood Elf blood gives you 50% resistance to disease.",
		"Resist Poison": "Your Wood Elf blood gives you 50% resistance to poison.",
	},
};