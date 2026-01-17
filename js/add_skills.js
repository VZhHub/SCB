import {dom} from "./dom.js";
import {currentSkillTree, charSkills} from "./skills.js";
const skills = new Map();
const perks = new Map();
function updateTextPerk(clickedPerk, perk) {
	perks.get(currentSkillTree).get(clickedPerk).textContent = clickedPerk + " " + perk.rankNow + "/" + perk.maxRank;
}
function addPerkSection() {
	const node = dom.template.content.cloneNode(true);
	const section = node.querySelector("section");
	const h3 = node.querySelector("h3");
	h3.textContent = currentSkillTree;
	dom.characterSkills.appendChild(node);
	skills.set(currentSkillTree, section);
}
function returnLi(clickedPerk, perk) {
	const li = document.createElement("li");
	const rank = perk.isRanked ? " " + perk.rankNow + "/" + perk.maxRank : "";
	li.textContent = clickedPerk + rank;
	return li;
}
function addLiPerks(clickedPerk, li) {
	if (!perks.get(currentSkillTree)) {
		perks.set(currentSkillTree, new Map().set(clickedPerk, li));
	} else {
		perks.get(currentSkillTree).set(clickedPerk, li);
	}
}
function updateTextSkill(tree) {
	tree = tree ?? currentSkillTree;
	if (!skills.get(tree)) return;
	skills.get(tree).querySelector("h3").textContent = tree + " " + charSkills[tree].total;
}
function deleteLiPerks(clickedPerk, skillTree) {
	const tree = perks.get(skillTree);
	tree.get(clickedPerk).remove();
	tree.delete(clickedPerk);
}
function deletePerkSection(skillTree) {
	if (perks.get(skillTree).size === 0) {
		skills.get(skillTree).remove();
		skills.delete(skillTree);
	}
}
export {skills, addPerkSection, returnLi, addLiPerks, updateTextSkill, deleteLiPerks, deletePerkSection, updateTextPerk};