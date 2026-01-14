document.querySelector(".tree-header__buttons").addEventListener("click", e => changeSkillLevel(e));
let charLevel = 1;
let xpToNextLevel = (charLevel + 3) * 25;
const xpBySkillTree = {
	Alchemy: 0,
	Alteration: 0,
	Archery: 0,
	Block: 0,
	Conjuration: 0,
	Destruction: 0,
	Enchanting: 0,
	"Heavy Armor": 0,
	Illusion: 0,
	"Light Armor": 0,
	Lockpicking: 0,
	"One-Handed": 0,
	Pickpocket: 0,
	Restoration: 0,
	Smithing: 0,
	Sneak: 0,
	Speech: 0,
	"Two-Handed": 0,
};
let totalXP = 0;
function calcCharLevel(skill, bool) {
	const a = raceSkills[chosenRace][skill] + 1;
	const b = charSkills[skill].ownSkill;
	const n = b - a + 1;
	xpBySkillTree[skill] = (a + b) * n * .5;
	totalXP = Object.values(xpBySkillTree).reduce((total, num) => total + num);
	if (bool) {
		while (totalXP > xpToNextLevel) {
			xpToNextLevel += (++charLevel + 3) * 25;
		}
	} else {
		while (xpToNextLevel > totalXP && charLevel > 1) {
			xpToNextLevel -= (charLevel-- + 3) * 25;
		}
	}
	dom.buildLevel.textContent = charLevel;
	charNameLevel.get(currentCharName).textContent = charLevel;
}
function changeSkillLevel(e) {
	const button = e.target;
	if (button.closest(".tree-header__button")) {
		const mod = Number(button.dataset.changeSkill);
		const skill = charSkills[currentSkillTree];
		const lowestSkill = raceSkills[chosenRace][currentSkillTree];
		if (skill.ownSkill + mod >= 100) {
			skill.ownSkill = 100;
		} else if (skill.ownSkill + mod <= lowestSkill) {
			skill.ownSkill = lowestSkill;
		} else {
			skill.ownSkill += mod;
		}
		calcWeaponSkillMod(currentSkillTree);
		calcArmorSkillMod(currentSkillTree);
		calcTotalValue();
		domm.treeSkillLevel.textContent = skill.total = skill.ownSkill + skill.otherSource;
		updateTextSkill(currentSkillTree);
		if (mod < 0) {
			calcCharLevel(currentSkillTree, false);
		} else {
			calcCharLevel(currentSkillTree, true);
		}
	}
}