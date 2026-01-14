const magicResistances = new Map();
for (const i of document.querySelectorAll("[data-resistances]")) {
	magicResistances.set(i.dataset.resistances, i);
}
function displayResistances() {
	for (const [key, value] of Object.entries(currentRes)) {
		if (key.includes("Total")) {
			if (value >= 97.75) {
				magicResistances.get(key).textContent = 97.75 + " %";
			} else {
				magicResistances.get(key).textContent = value + " %";
			}
		} else if (key === "disease") {
			if (value >= 100) {
				magicResistances.get(key).textContent = 100 + " %";
			} else {
				magicResistances.get(key).textContent = value + " %";
			}
		} else {
			if (value >= 85) {
				magicResistances.get(key).textContent = 85 + " %";
			} else {
				magicResistances.get(key).textContent = value + " %";
			}
		}
	}
}