const myVars = {
	a: document.querySelector("#searchSection"),
	b: document.querySelector("#searchResult"),
	get c() {return window.getComputedStyle(this.a).getPropertyValue("display");},
	d: document.querySelector("#searchBar"),
	e: document.querySelector("#searchTemplate"),
	f: document.querySelector("#deleteText"),
	g: document.querySelector("#magnifier"),
	h: document.querySelector("#searchBtn"),
	i: document.querySelector("#closeSearch"),
	j: document.querySelector("#blackout"),
	k: document.querySelector("#inputContainer"),
	l: document.querySelector("#customizeBuildBtn"),
	m: document.querySelector("#manageBuildBtn"),
	n: document.querySelector("#closeMyBuildsBtn"),
	o: document.querySelector("#closeBlock"),
	p: document.querySelector("#cancelBuild"),
	r: document.querySelector("#saveBuild"),
	s: document.querySelector("#addNewBuildBtn"),
	t: document.querySelector("#renameBuildContainer"),
	u: document.querySelector("#renameBuildWindow"),
	v: document.querySelector("#deleteBuildContainer"),
	w: document.querySelector("#deleteBuild"),
	x: document.querySelector("#nameYourBuild"),
	y: document.querySelector("#races"),
	z: document.querySelector("#renameYourBuild"),
	aa: document.querySelector("#warning"),
	ab: document.querySelector("#buildSubmenuContainer"),
	ac: document.querySelector("#nameYourBuildLabel"),
	ad: document.querySelector("#racesLabel"),
	ae: document.querySelector("#yourBuildName"),
	af: document.querySelector("#noBuildsYet"),
	ag: document.querySelector("#rightCol"),
	ah: document.querySelector("#newBuildsContainer"),
	ai: document.querySelector("#myBuildsContainer"),
	aj: document.querySelector("#customizationContainer"),
	ak: document.querySelector("#closeCustomizeBtn"),
};

// ----------ГОТОВО, НЕ ТРОЖЬ!----------
// ----------ГОТОВО, НЕ ТРОЖЬ!----------
if (window.matchMedia("(pointer:fine)").matches) {
	myVars.h.addEventListener("click", searchSwitch);
	myVars.i.addEventListener("click", searchSwitch);
	myVars.f.addEventListener("click", clearSearch);
} else {
	myVars.h.addEventListener("touchstart", searchSwitch);
	myVars.i.addEventListener("touchstart", searchSwitch);
	myVars.f.addEventListener("touchstart", clearSearch);
}
myVars.d.addEventListener("input", findSomething);
myVars.d.addEventListener("focus", () => myVars.k.style.borderColor = "orange");
myVars.d.addEventListener("blur", () => myVars.k.style.borderColor = "#5b6c87");
function searchSwitch() {
	clear(myVars.b);
	switch(myVars.c) {
		case "grid":
		hideEl(myVars.a);
		clearSearch();
		hideEl(myVars.j);
		break;
		case "none":
		showEl(myVars.a, "grid");
		myVars.d.focus();
		showEl(myVars.j, "block");
		break;
	}
}
function findSomething() {
	clear(myVars.b);
	if (myVars.d.value.toUpperCase() === "") {
		showEl(myVars.g, "grid");
		hideEl(myVars.f);
		return false;
	}
	hideEl(myVars.g);
	showEl(myVars.f, "grid");
	let guess = myVars.d.value.toUpperCase().match(/\S+/g);
	for(let i of lightArmorSortedMap.keys()) {
		if(guess.every((e) => i.toUpperCase().includes(e))) {
			let node = myVars.e.content.cloneNode(true);
			node.children[0].children[1].innerText = lightArmorSortedMap.get(i).name;
			myVars.b.appendChild(node);
		}
	}
}
function clearSearch() {
	myVars.d.value = "";
	findSomething();
}
function clear(x) {
	while (x.firstChild) {
		x.removeChild(x.firstChild);
	}
}
// ----------ГОТОВО, НЕ ТРОЖЬ!----------
// ----------ГОТОВО, НЕ ТРОЖЬ!----------




let yourBuilds = [];
if (window.matchMedia("(pointer:fine)").matches) {
	myVars.l.addEventListener("click", isThereAnyBuild);
	myVars.l.addEventListener("click", createBuildFirst);
	myVars.j.addEventListener("click", blackoutFunc);
	myVars.m.addEventListener("click", showMyBuilds);
	myVars.n.addEventListener("click", showMyBuilds);
	myVars.o.addEventListener("click", closeCreateCharMenu);
	myVars.p.addEventListener("click", closeCreateCharMenu);
	myVars.r.addEventListener("click", saveYourBuild);
	myVars.s.addEventListener("click", openCreateCharMenu);
	myVars.t.addEventListener("click", closeRenameBuild);
	myVars.u.addEventListener("click", stopPropagation);
	myVars.u.children[3].addEventListener("click", saveRenamed);
	myVars.u.children[2].addEventListener("click", closeRenameBuild);
	myVars.v.addEventListener("click", closeDeleteBuild);
	myVars.w.addEventListener("click", stopPropagation);
	document.querySelector("#deleteBuildContainer button:first-of-type").addEventListener("click", closeDeleteBuild);
	document.querySelector("#deleteBuildContainer button:last-of-type").addEventListener("click", deleteBuildYes);
	myVars.ak.addEventListener("click", switchCustomizations);
	} else {
	myVars.l.addEventListener("touchstart", isThereAnyBuild);
	myVars.l.addEventListener("touchstart", createBuildFirst);
	myVars.j.addEventListener("touchstart", blackoutFunc);
	myVars.m.addEventListener("touchstart", showMyBuilds);
	myVars.o.addEventListener("touchstart", closeCreateCharMenu);
	myVars.p.addEventListener("touchstart", closeCreateCharMenu);
	myVars.r.addEventListener("touchstart", saveYourBuild);
	myVars.n.addEventListener("touchstart", showMyBuilds);
	myVars.s.addEventListener("touchstart", openCreateCharMenu);
	myVars.t.addEventListener("touchstart", closeRenameBuild);
	myVars.u.addEventListener("touchstart", stopPropagation);
	myVars.u.children[3].addEventListener("touchstart", saveRenamed);
	myVars.u.children[2].addEventListener("touchstart", closeRenameBuild);
	myVars.v.addEventListener("touchstart", closeDeleteBuild);
	myVars.w.addEventListener("touchstart", stopPropagation);
	document.querySelector("#deleteBuildContainer button:first-of-type").addEventListener("touchstart", closeDeleteBuild);
	document.querySelector("#deleteBuildContainer button:last-of-type").addEventListener("touchstart", deleteBuildYes);
	myVars.ak.addEventListener("touchstart", switchCustomizations);
}
myVars.x.addEventListener("focus", nameBorderColor);
myVars.x.addEventListener("blur", nameBorderColor);
myVars.y.addEventListener("focus", racesBorderColor);
myVars.y.addEventListener("blur", racesBorderColor);
myVars.z.addEventListener("focus", (event) => {clearTimeout(saveRenamed.timerID); event.target.placeholder = "";});


// ТОЛЬКО ДЛЯ МОБИЛЬНЫХ!
/*visualViewport.onresize = function() {
	let a = myVars.ab, b = myVars.t;
	a.style.height = visualViewport.height + "px";
	b.style.height = visualViewport.height + "px";
}*/

function showMyBuilds() {
	let a = myVars.ai;
	hideEl(myVars.aa);
	if(a.style.transform === "scaleY(1)") {
		a.style.transform = "scaleY(0)";
		} else {
		a.style.transform = "scaleY(1)";
	}
}
function openCreateCharMenu() {
	myVars.j.style.zIndex = "3";
	showEl(myVars.ab, "grid");
	showEl(myVars.j, "block");
	myVars.x.focus();
	myVars.y.value = "empty";
}
function closeCreateCharMenu() {
	myVars.j.style.zIndex = "1";
	myVars.x.style.borderColor = "#5b6c87";
	myVars.x.value = "";
	myVars.x.removeAttribute("disabled");
	myVars.y.value = "empty";
	myVars.y.style.borderColor = "#5b6c87";
	myVars.y.removeAttribute("disabled");
	myVars.ac.textContent = "Name your build";
	myVars.ac.style.color = "#fff";
	myVars.ad.textContent = "Choose race";
	myVars.ad.style.color = "#fff";
	hideEl(myVars.ab);
	hideEl(myVars.j);
	clearTimeout(youForgotName.timerID);
	clearTimeout(youForgotRace.timerID);
}
function nameBorderColor() {
	let a = myVars.x;
	a.style.borderColor === "orange" ? a.style.borderColor = "#5b6c87" : a.style.borderColor = "orange";
}
function racesBorderColor() {
	let a = myVars.y;
	a.style.borderColor === "orange" ? a.style.borderColor = "#5b6c87" : a.style.borderColor = "orange";
}


function youForgotName() {
	let a = myVars.ac, b = myVars.x
	if (b.value === "") {
		a.textContent = "Name your build!";
		a.style.color = "red";
		b.style.borderColor = "orange";
		b.disabled = true;
		clearTimeout(youForgotName.timerID1);
		youForgotName.timerID = setTimeout(() => {
			a.textContent = "Name your build";
			a.style.color = "#fff";
			b.style.borderColor = "#5b6c87";
			b.disabled = false;
		}, 800);
	}
}
function youForgotRace() {
	let a = myVars.ad, b = myVars.y;
	if (b.value === "empty") {
		a.textContent = "Choose race!";
		a.style.color = "red";
		b.style.borderColor = "orange";
		b.disabled = true;
		clearTimeout(youForgotRace.timerID2);
		youForgotRace.timerID = setTimeout(() => {
			a.textContent = "Choose race";
			a.style.color = "#fff";
			b.style.borderColor = "#5b6c87";
			b.disabled = false;
		}, 800);
	}
}
function saveYourBuild() {
	let a = myVars.y, b = myVars.x,	node = document.querySelector(".myBuildsTemplate").content.cloneNode(true), optionsButton = node.children[0].children[1], miniOptions = node.children[0].children[2], buildName = node.children[0].children[0].children[0].children[1], myBuild = node.children[0].children[0], rename = miniOptions.children[0], deleteBuild = miniOptions.children[1];
	if (b.value !== "" && a.value !== "empty") {
		myVars.ah.appendChild(node);
		showEl(myVars.ag, "block");
		hideEl(myVars.af);
		yourBuilds.push(b.value);
		myVars.ae.textContent = b.value;
		buildName.textContent = b.value;
		document.getElementById("characterRace").textContent = a.value;
		document.getElementById("characterLevel").textContent = "Level 1";
		if (window.matchMedia("(pointer:fine)").matches) {
			optionsButton.addEventListener("click", openMiniOptions);
			miniOptions.addEventListener("click", stopPropagation);
			rename.addEventListener("click", openRenameBuild);
			myBuild.addEventListener("click", selectBuild);
			deleteBuild.addEventListener("click", openDeleteBuild);
			} else {
			optionsButton.addEventListener("touchstart", openMiniOptions);
			miniOptions.addEventListener("touchstart", stopPropagation);
			rename.addEventListener("touchstart", openRenameBuild);
			myBuild.addEventListener("touchstart", selectBuild);
			deleteBuild.addEventListener("touchstart", openDeleteBuild);
		}
		changeContainerOverflow();
		closeCreateCharMenu();
		} else {
		youForgotName();
		youForgotRace();
	}
}

function selectBuild(event) {
	event.stopPropagation();
	if(Array.from(document.querySelectorAll(".options")).every((e) => {return e.style.display === "" || e.style.display === "none";})) {
		myVars.ae.textContent = yourBuilds[yourBuilds.indexOf(this.children[0].children[1].textContent)];
	}
	closeMiniOptions();
}
function openMiniOptions(event) {
	event.stopPropagation();
	if(this.nextElementSibling.style.display === "block") {
		this.nextElementSibling.style.display = "none";
		} else {
		closeMiniOptions();
		this.nextElementSibling.style.display = "block";
		miniOptionsPosition(this);
		if (window.matchMedia("(pointer:fine)").matches) {
			document.addEventListener("click", closeMiniOptions);
			} else {
			document.addEventListener("touchstart", closeMiniOptions);
		}
	}
}
function closeMiniOptions() {
	let miniOpt = document.querySelectorAll(".options");
	for(let i of miniOpt) i.style.display = "none";
	document.removeEventListener("click", closeMiniOptions);
	document.removeEventListener("touchstart", closeMiniOptions);
}
function checkNumberOfBuilds() {
	return myVars.ah.childElementCount;
}
function changeContainerOverflow() {
	if(checkNumberOfBuilds() < 2) {
		myVars.ah.style.overflowY = "visible";
		myVars.ai.style.overflow = "visible";
		} else {
		myVars.ah.style.overflowY = "scroll";
		myVars.ai.style.overflow = "hidden";
	}
}
function miniOptionsPosition(x) {
	if(x.getBoundingClientRect().top - myVars.ah.getBoundingClientRect().top < myVars.ah.getBoundingClientRect().bottom - x.getBoundingClientRect().bottom) {
		x.nextElementSibling.setAttribute("class", "options optionsBottom upArrow");
		} else {
		x.nextElementSibling.setAttribute("class", "options optionsTop downArrow");
	}
}

function closeRenameBuild() {
	hideEl(myVars.t);
	hideEl(myVars.j);
}
function stopPropagation(event) {
	event.stopPropagation();
}
function openRenameBuild(event) {
	let d = event.target.parentElement.parentElement.children[0].children[0].children[1];
	saveRenamed.sendedName = d.textContent;
	saveRenamed.buildName = d;
	closeMiniOptions();
	showEl(myVars.t, "flex");
	showEl(myVars.j, "block");
	myVars.z.value = "";
	myVars.z.focus();
}
function saveRenamed() {
	let a = myVars.z;
	clearTimeout(saveRenamed.timerID);
	if (a.value !== "") {
		yourBuilds[yourBuilds.indexOf(saveRenamed.sendedName)] = a.value;
		myVars.ae.textContent = a.value;
		saveRenamed.buildName.textContent = a.value;
		closeRenameBuild();
		} else {
		a.placeholder = "Name can't be empty";
		saveRenamed.timerID = setTimeout(() => {a.placeholder = ""}, 800);
	}
}




function openDeleteBuild(event) {
	showEl(myVars.v, "flex");
	showEl(myVars.j, "block");
	closeMiniOptions()
	deleteBuildYes.element = event.target.parentElement.parentElement;
	deleteBuildYes.buildName = event.target.parentElement.parentElement.children[0].children[0].children[1].textContent;
	document.querySelector("#deleteBuild p span").textContent = deleteBuildYes.buildName;
}
function closeDeleteBuild() {
	hideEl(myVars.v);
	hideEl(myVars.j);
}
function deleteBuildYes() {
	let a = myVars.ae, b = deleteBuildYes.element.previousElementSibling, c = deleteBuildYes.element.nextElementSibling;
	if (b !== null) {
		a.textContent = yourBuilds[yourBuilds.indexOf(b.children[0].children[0].children[1].textContent)];
		} else if (c !== null) {
		a.textContent = yourBuilds[yourBuilds.indexOf(c.children[0].children[0].children[1].textContent)];
		} else {
		showEl(myVars.af, "flex");
		myVars.ae.textContent = "Unknown Adventurer";
		hideEl(myVars.ag);
	}
	deleteBuildYes.element.remove();
	closeDeleteBuild();
	yourBuilds.splice(yourBuilds.indexOf(deleteBuildYes.buildName), 1);
	changeContainerOverflow();
}
// ФУНКЦИИ УДАЛЕНИЯ, ДОБАВЛЕНИЯ И ПЕРЕИМЕНОВАНИЯ НИЧЕГО НЕ ДЕЛАЮТ С РАСОЙ И УРОВНЕМ!!!!


function createBuildFirst() {
	if(yourBuilds.length === 0) {
		showEl(myVars.aa, "block");
		createBuildFirst.timerID = setTimeout(() => hideEl(myVars.aa), 2000);
	}
}
function switchCustomizations() {
	let a = myVars.aj;
	if(a.style.transform === "scaleY(1)") {
		a.style.transform = "scaleY(0)";
		} else {
		a.style.transform = "scaleY(1)";
	}
	for (i of document.querySelectorAll("#customizationOptions>li>menu")) {
		i.style.display = "none";
		i.parentElement.style.order = "";
	}
}
function isThereAnyBuild() {
	clearTimeout(createBuildFirst.timerID);
	if(yourBuilds.length > 0) {
		switchCustomizations();
		//showEl(myVars.j, "block");
	}
}
//--------------------------------------
//--------------------------------------
function hideEl(a) {
	a.style.display = "none";
}
function showEl(a, b) {
	a.style.display = b;
}
//--------------------------------------
function blackoutFunc() {
	//let a = document.getElementById("myBuildsContainer"), c = document.getElementById("customizeSubmenu");
	//if (a.style.display === "block") myBuilds();
	//if (c.style.display === "block" || c.style.display === "none") closeSubmenus();
	let a = document.getElementById("myBuildsContainer"), b = document.getElementById("searchSection"), c = document.getElementById("buildSubmenuContainer"), d = document.getElementById("itemsWindow");
	if (a.style.display === "block") myBuilds();
	if (b.style.display === "grid") searchSwitch();
	//if (c.style.display === "grid") buildSwitch();
	if (myVars.ab.style.display === "grid") {
		myVars.y.blur();
		myVars.x.blur();
		closeCreateCharMenu();
	}
	if (myVars.t.style.display === "flex") closeRenameBuild();
	if (myVars.v.style.display === "flex") closeDeleteBuild();
	if (d.style.display !== "none") backToCategory();
}
addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		blackoutFunc();
	}
});
addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		if (myVars.ab.style.display === "grid") {
			myVars.y.blur();
			myVars.x.blur();
			saveYourBuild();
		}
		if (myVars.t.style.display === "flex") saveRenamed();
		if (myVars.v.style.display === "flex") deleteBuildYes();
	}
});