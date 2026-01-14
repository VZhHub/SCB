const bonusPerks = ["Well Fitted", "Custom Fit"];
const sameTypeBonus = {
	"Well Fitted": {
		chosen: false,
		applied: false,
	},
	"Custom Fit": {
		chosen: false,
		applied: false,
	},
};
function setBonusForSameType(perk, sign) {
	if (perk === "Well Fitted" || perk === "Custom Fit") {
		const p = sameTypeBonus[perk];
		const t = perk === "Well Fitted" ? "Heavy" : "Light";
		const ar = t + " Armor";
		const sameT = [slotContent.Head?.type, slotContent.Body?.type, slotContent.Arms?.type, slotContent.Legs?.type].every(e => e === t);
		if (sign === 1) {
			p.chosen = true;
			if (sameT) {
				p.applied = true;
				sumOfModifiers[ar].sameType += sign * .25;
				//applyModifiers();
				calcTotalValue();
			}
		} else if (sign === -1) {
			p.chosen = false;
			if (sameT) {
				p.applied = false;
				sumOfModifiers[ar].sameType += sign * .25;
				//applyModifiers();
				calcTotalValue();
			}
		}
	}
}
function cancelBonusForSameTypeArmor(slot) {
	if (slot === "Body" || slot === "Head" || slot === "Legs" || slot === "Arms") {
		for (let i of bonusPerks) {
			const obj = sameTypeBonus[i];
			if (obj.chosen && obj.applied) {
				const ar = i === "Well Fitted" ? "Heavy Armor" : "Light Armor";
				obj.applied = false;
				sumOfModifiers[ar].sameType -= .25;
				//applyModifiers();
				calcTotalValue();
				return;
			}
		}
	}
}
function addBonusForSameTypeArmor(slot) {
	if (slot === "Body" || slot === "Head" || slot === "Legs" || slot === "Arms") {
		for (let i of bonusPerks) {
			const obj = sameTypeBonus[i];
			if (obj.chosen && !obj.applied) {
				const t = i === "Well Fitted" ? "Heavy" : "Light";
				const ar = t + " Armor";
				if ([slotContent.Head?.type, slotContent.Body?.type, slotContent.Arms?.type, slotContent.Legs?.type].every(e => e === t)) {
					obj.applied = true;
					sumOfModifiers[ar].sameType += .25;
					//applyModifiers();
					calcTotalValue();
					return;
				}
			}
		}
	}
}