const myVars2 = {
	al: document.querySelectorAll("#weapons button"),
	am: document.querySelector("#itemsList"),
	an: document.querySelector("#sortByName span:last-child"),
	ao: document.querySelector("#itemsWindow"),
	ap: document.querySelector("#sortByWeight span:last-child"),
	ar: document.querySelector("#sortByRating span:last-child"),
	as: document.querySelector("#sortByName div"),
	at: document.querySelector("#sortByWeight div"),
	au: document.querySelector("#sortByRating div"),
	av: document.querySelector("#itemsWindow>div>button"),
	aw: document.querySelector("#sortByName"),
	ax: document.querySelector("#sortByWeight"),
	ay: document.querySelector("#sortByRating"),
	az: document.querySelectorAll("#armor button"),
	ba: document.querySelectorAll("#shields button"),
	bb: document.querySelectorAll("#jewelry button"),
	bc: document.querySelectorAll("#staves button"),
	bd: document.querySelectorAll("#clothing button"),
};


// Одни и те ж функции во множестве циклов
// ВОЗМОЖНО стоит запускать некоторые функции после события load а не при действиях пользователя

if (window.matchMedia("(pointer:fine)").matches) {
	for (let i of document.querySelectorAll("#customizationOptions>li>button")) i.addEventListener("click", openCategory);
	//for (i of myVars2.al) i.addEventListener("click", openResults);
	//for (i of myVars2.az) i.addEventListener("click", openResults);
	for (let i of myVars2.al) i.addEventListener("click", generateResultsAndDisappear);
	for (let i of myVars2.az) i.addEventListener("click", generateResultsAndDisappear);
	for (let i of myVars2.ba) i.addEventListener("click", generateResultsAndDisappear);
	for (let i of myVars2.bb) i.addEventListener("click", generateResultsAndDisappear);
	for (let i of myVars2.bc) i.addEventListener("click", generateResultsAndDisappear);
	for (let i of myVars2.bd) i.addEventListener("click", generateResultsAndDisappear);
	//myVars2.bd.addEventListener("click", generateResultsAndDisappear);
	myVars2.av.addEventListener("click", backToCategory);
	myVars2.aw.addEventListener("click", sortByName);
	myVars2.ax.addEventListener("click", sortByWeight);
	myVars2.ay.addEventListener("click", sortByRating);
} else {
	for (let i of document.querySelectorAll("#customizationOptions>li>button")) i.addEventListener("touchstart", openCategory);
	//for (i of myVars2.al) i.addEventListener("touchstart", openResults);
	//for (i of myVars2.az) i.addEventListener("touchstart", openResults);
	for (let i of myVars2.al) i.addEventListener("touchstart", generateResultsAndDisappear);
	for (let i of myVars2.az) i.addEventListener("touchstart", generateResultsAndDisappear);
	for (let i of myVars2.ba) i.addEventListener("touchstart", generateResultsAndDisappear);
	for (let i of myVars2.bb) i.addEventListener("touchstart", generateResultsAndDisappear);
	for (let i of myVars2.bc) i.addEventListener("touchstart", generateResultsAndDisappear);
	for (let i of myVars2.bd) i.addEventListener("touchstart", generateResultsAndDisappear);
	//myVars2.bd.addEventListener("touchstart", generateResultsAndDisappear);
	myVars2.av.addEventListener("touchstart", backToCategory);
	myVars2.aw.addEventListener("touchstart", sortByName);
	myVars2.ax.addEventListener("touchstart", sortByWeight);
	myVars2.ay.addEventListener("touchstart", sortByRating);
}


//const itemType = [];
function openCategory() {
	let startTime = Date.now();
	openCategory.category = this.innerText;
	/*if (!this.nextElementSibling) {
		for (i of document.querySelectorAll("#customizationOptions>li>menu")) {
			i.style.display = "none";
			i.parentElement.style.order = "";
		}
		this.parentElement.style.order = "-1";
	}*/ 
	if (this.nextElementSibling.style.display === "block") {
		hideEl(this.nextElementSibling);
		this.parentElement.style.order = "";
	} else {
		for (let i of document.querySelectorAll("#customizationOptions>li>menu")) {
			i.style.display = "none";
			i.parentElement.style.order = "";
		}
		//for (i of document.querySelectorAll("#customizationOptions>li")) i.style.order = "";
		document.querySelector("#customizationOptions").scrollTop = "0";
		showEl(this.nextElementSibling, "block");
		this.parentElement.style.order = "-1";
	}
	console.log(`openCategory: ${Date.now()-startTime}ms`);
}

// i.type == this.innerText.match(i.type)?.toString();


const observerOptions = {
	root: document.querySelector("#itemsList"),
	rootMargin: "180px",
	threshold: 0.0,
};
const observer = new IntersectionObserver(addImgPath, observerOptions);


// Забыл добавить кол-во использования для оружия и посохов!!
// А также из каких материалов, доп.эффект (броня) итд - проверь!!
// Надо это сделать как доп инфу
function generateResultsAndDisappear() {
	let startTime = Date.now();
	openResults.type = this.innerText;
	let a = document.querySelector(".itemsTemplate");
	for (let i of allItems.values()) {
		if (i.category === openCategory.category && i.type == this.innerText.match(i.type)) {
			let node = a.content.cloneNode(true);
			showEl(node.children[0], "grid");
			node.children[0].setAttribute("class", `itemsContainer ${openCategory.category} ${this.innerText}`);
			document.querySelector("#itemsWindow .submenuTitle").innerText = openCategory.category.toUpperCase() + ": " + this.innerText.toUpperCase();
			node.querySelector(".itemName").innerText = i.name;
			node.querySelector(".itemWeight").innerText = i.weight;
			if (i.descr != 0) node.querySelector(".description").innerText = i.descr;
			let rating = node.querySelector(".itemRating");
			switch (i.category) {
				case "Weapons":
					rating.innerText = i.damage;
					break;
				case "Staves":
				case "Clothing":
					rating.innerText = "";
					break;
				default:
					rating.innerText = i.armor;
			}
			addClassAttToItems(openCategory.category, this.innerText, node, i);
			myVars2.am.appendChild(node);
		}
	}
	if (window.matchMedia("(pointer:fine)").matches) {
		this.addEventListener("click", openResults);
	} else {
		this.addEventListener("touchstart", openResults);
	}
	showEl(myVars2.ao, "grid");
	showEl(myVars.j, "block");
	document.querySelectorAll(".itemsContainer").forEach((x) => observer.observe(x));
	sortByName();
	displayItemsRating();
	showFilterDependingOnCategory(openCategory.category);
	uncheckAllCheckboxes();
	this.removeEventListener("click", generateResultsAndDisappear);
	this.removeEventListener("touchstart", generateResultsAndDisappear);
	console.log(`generateResultsAndDisappear: ${Date.now()-startTime}ms`);
}


function addImgPath(entries, observer) {
	let startTime = Date.now();
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			let name = entry.target.querySelector("h2").innerText;
			let imageName = name.match(/\S+/g).join("_").toLowerCase();
			let image = entry.target.querySelector("img");
			image.alt = name;
			image.src = `./screenshots/${imageName}.png`;
			observer.unobserve(entry.target);
		}
	});
	console.log(`addImgPath: ${Date.now()-startTime}ms`);
}
// Сделать проверку, если стоит хоть одна галочка в фильре, то при открытии отображать только то, что выбрано в фильре (сложно)
function openResults() {
	let startTime = Date.now();
	openResults.type = this.innerText;
	sortByName();
	showEl(myVars2.ao, "grid");
	showEl(myVars.j, "block");
	document.querySelector("#itemsWindow .submenuTitle").innerText = openCategory.category.toUpperCase() + ": " + this.innerText.toUpperCase();
	displayItemsRating();
	showThisTypeItems(openCategory.category, this.innerText);
	showFilterDependingOnCategory(openCategory.category);
	console.log(`openResults: ${Date.now()-startTime} ms`);
}
function hideItems() {
	let startTime = Date.now();
	for (let i of myVars2.am.children) i.style.display = "none";
	console.log(`hideItems: ${Date.now()-startTime} ms`);
}
function showThisTypeItems(x, y) {
	let startTime = Date.now();
	for (let i of myVars2.am.children) if (i.matches(`.${x}.${y}`)) showEl(i, "grid");
	console.log(`showThisTypeItems: ${Date.now()-startTime} ms`);
}
function displayItemsRating() {
	let startTime = Date.now();
	switch (openCategory.category) {
		case "Staves":
		case "Clothing":
			document.querySelector("#sortByRating").style.display = "none";
			break;
		case "Weapons":
			document.querySelector("#sortByRating").style.display = "block";
			document.querySelector("#sortByRating span:first-child").innerText = "Damage";
			break;
		default:
			document.querySelector("#sortByRating").style.display = "block";
			document.querySelector("#sortByRating span:first-child").innerText = "Armor";
	}
	console.log(`displayItemsRating: ${Date.now()-startTime} ms`);
}
/*function addImgPath(x) {
	let arr = [];
	for (i of allItems.values()) {
		if (i.category === openCategory.category && x.innerText.match(i.type)?.toString() === i.type) {
			arr.push(i.name.match(/\S+/g).join("_").toLowerCase());
		}
	}
	let allImgs = [...document.querySelectorAll(".itemsContainer img")];
	for (let i = 0, len = allImgs.length; i < len; i++) {
		allImgs[i].setAttribute("src", `./screenshots/${arr[i]}.png`);
	}
}*/
/*function addItemImg(x, y) {
	let a = y.match(/\S+/g).join("_").toLowerCase();
	x.setAttribute("src", `./screenshots/${a}.png`);
	x.setAttribute("loading", "lazy");
	x.setAttribute("alt", y);
}*/


function backToCategory() {
	//sortByName();
	hideItems();
	hideEl(myVars.j);
	styleSorting("transparent", "transparent", "transparent", myVars2.ap, myVars2.ar, myVars2.an);
	myVars2.an.innerText = "";
	hideEl(myVars2.ao);
	closeFilterWindow();
	uncheckAllCheckboxes();
	revertFilter();
	filterValues.splice(0);
}
function styleSorting(a, b, c, d, e, f) {
	myVars2.am.scrollTop = 0;
	myVars2.as.style.backgroundColor = a;
	myVars2.at.style.backgroundColor = b;
	myVars2.au.style.backgroundColor = c;
	f.style.display = "inline";
	d.innerText = "";
	e.innerText = "";
	d.style.display = "none";
	e.style.display = "none";
}
function sortByName() {
	sortBy(0, myVars2.an, ".itemName", "A-Z", "Z-A");
	styleSorting("rgba(0, 200, 0, .5)", "transparent", "transparent", myVars2.ap, myVars2.ar, myVars2.an);
}
function sortByWeight() {
	sortBy(1, myVars2.ap, ".itemWeight", "↓", "↑");
	styleSorting("transparent", "rgba(0, 200, 0, .5)", "transparent", myVars2.an, myVars2.ar, myVars2.ap);
}
function sortByRating() {
	sortBy(1, myVars2.ar, ".itemRating", "↓", "↑");
	styleSorting("transparent", "transparent", "rgba(0, 200, 0, .5)", myVars2.an, myVars2.ap, myVars2.ar);
}
function sortBy(d, e, f, g, h) {
	let a = Array.from(myVars2.am.children).sort((b, c) => {
		let B = b.querySelector(`${f}`).innerText, C = c.querySelector(`${f}`).innerText;
		if (d === 0) return B > C ? 1 : B === C ? 0 : -1;
		if (d === 1) return B - C;
	});
	if (e.innerText === g) {
		e.innerText = h;
		for (let i = 0, len = a.length; i < len; i++) {
			a[i].style.order = -i;
		}
	} else {
		e.innerText = g;
		for (let i = 0, len = a.length; i < len; i++) {
			a[i].style.order = i;
		}
	}
}

// ФИЛЬТР

// Там где Артефакт / не Артефакт надо в input type сделать radio, а не checkbox. И в остальных с такой же логикой
document.querySelector("#filter").addEventListener("click", filterSwitch);
document.querySelector("#filter").addEventListener("click", filterBackgroundColor);
//document.querySelector("#cannotTemper").addEventListener("click", cannotTemper);
//document.querySelector("#canTemper").addEventListener("click", canTemper);
//for (let i of document.querySelectorAll("#smithingPerks input")) i.addEventListener("click", filterBySmithingPerk );
//for (let i of document.querySelectorAll("#enchanted input")) i.addEventListener("click", isEnchanted);
for (let i of document.querySelectorAll("#filterWindow input")) i.addEventListener("click", filterFunc);
//document.querySelector("#steelPerk").addEventListener("click", showItemsWithPerk);

function filterSwitch() {
	document.querySelector("#filterWindow").style.display === "block" ? document.querySelector("#filterWindow").style.display = "none" : document.querySelector("#filterWindow").style.display = "block";
	document.querySelector("#filterWindow").scrollTop = 0;
}
function filterBackgroundColor() {
	document.querySelector("#filterWindow").style.display === "block" ? document.querySelector("#filter").style.backgroundColor = "#0c7212" : document.querySelector("#filter").style.backgroundColor = "transparent";
}

// Возможно не стоит снимать галочки и отменять фильтрацию после закрытия окна, чтобы не приходилось её проставлять заново после открытия
// Может лучше добавить кнопку "Отменить все фильтры"?
// Так же стоит подумать о том, чтобы сохранялись параметры фильтрации для каждого перса, когда между ними переключаешься (но это будет муторно)
function uncheckAllCheckboxes() {
	/*for (i of document.querySelectorAll("#itemsList>div")) {
		if (i.matches(`.${openCategory.category}.${openResults.type}`)) hideEl(i);
	}*/
	for (let i of document.querySelectorAll("#filterWindow input")) i.checked = false;
}
function closeFilterWindow() {
	if (document.querySelector("#filterWindow").style.display === "block") {
		filterSwitch();
		filterBackgroundColor();
	}
}
function addClassAttToItems(a, b, c, d) {
	let string = "itemsContainer";
	string += " " + a + " " + b;
	d.artifact == 1 ? string += " " + "isArtifact" : string += " " + "notArtifact";
	d.canEnch == 1 ? string += " " + "canBeEnch" : string += " " + "cannotBeEnch";
	d.descr == 0 ? string += " " + "notEnchanted" : string += " " + "isEnchanted";
	if (a == "Armor" || a == "Clothing" || a == "Jewelry") string += " " + d.bodyPart;
	switch (a) {
		case "Armor":
		case "Weapons":
		case "Shields":
			d.perks == 0 ? string += " " + "None" : string += " " + d.perks;
			d.material == 0 ? string += " " + "cannotTemper" : string += " " + "canTemper";
			break;
		case "Staves":
			string += " " + d.magSchool;
			break;
		case "Clothing":
			d.canHelm == 1 ? string += " " + "canHelm" : string += " " + "cannotHelm";
			break;
	}
	c.children[0].setAttribute("class", string);
}
function showFilterDependingOnCategory(a) {
	document.querySelector("#artifact").style.display = "block";
	document.querySelector("#canEnch").style.display = "block";
	document.querySelector("#enchanted").style.display = "block";
	if (a == "Armor" || a == "Clothing") document.querySelector("#bodyPart").style.display = "block";
	switch(a) {
		case "Armor":
		case "Weapons":
		case "Shields":
			document.querySelector("#smithingPerks").style.display = "block";
			document.querySelector("#tempering").style.display = "block";
			break;
		case "Staves":
			document.querySelector("#magicSchool").style.display = "block";
			break;
		case "Clothing":
			document.querySelector("#canWearHelm").style.display = "block";
			break;
	}
}
function revertFilter() {
	for (let i of document.querySelector("#filterWindow").children) i.style.display = "none";
}

// Функции опций фильтра-----------------------------------
const filterValues = [];
function filterFunc() {
	myVars2.am.scrollTop = 0;
	if (this.checked) {
		for (let i of myVars2.am.children) {
			if (!i.matches(`.${this.value}`)) hideEl(i);
		}
		filterValues.push(this.value);
	} else {
		filterValues.splice(filterValues.indexOf(this.value), 1);
		for (let i of myVars2.am.children) {
			if (filterValues.every(e => i.matches(`.${e}`)) && i.matches(`.${openCategory.category}.${openResults.type}`)) {
				showEl(i, "grid");
			}
		}
	}
}


// kek.filter(e => e.match("Steel"))
//document.querySelector("#itemsList").children[7].getAttribute("class").includes("Steel")




/*if (i.artifact == 0) {}
if (i.canEnch == 0) {} // Can be enchanted?
if (i.descr == 0) {} // Is enchanted?
if (i.bodyPart == "Arms") {}
if (i.magSchool == "Alteration") {}
if (i.canHelm == 0) {}
if (i.perks == "Steel") {}*/