"use strict";
const dom5 = {
	cardsContainer: document.querySelector(".items-window__cards"),
	equippedCardsWrapper: document.querySelector(".equipped-items__wrapper"),
};
const observerOptions = {
	root: document.querySelector(".items-window__cards"),
	rootMargin: "180px",
	threshold: 0.0,
};
const observer = new IntersectionObserver(addImgPath, observerOptions);
const bigImg = bigImgFunc();
const biggerIMGContainer = document.querySelector(".items-window__bigger-img");
dom5.cardsContainer.addEventListener("mouseover", e => {
	if (e.target.classList.contains("item-card__image")) {
		bigImg.show.call(e.target);
	}
});
dom5.cardsContainer.addEventListener("mouseout", e => {
	if (e.target.classList.contains("item-card__image")) {
		bigImg.hide.call(e.target);
	}
});
dom5.equippedCardsWrapper.addEventListener("mouseover", e => {
	if (e.target.classList.contains("item-card__image")) {
		bigImg.show.call(e.target);
	}
});
dom5.equippedCardsWrapper.addEventListener("mouseout", e => {
	if (e.target.classList.contains("item-card__image")) {
		bigImg.hide.call(e.target);
	}
});
function addImgPath(entries, observer) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			let image = entry.target.querySelector(".item-card__image");
			image.src = image.dataset.src;
			image.onload = () => image.classList.add("loaded");
			observer.unobserve(entry.target);
		}
	});
}
function bigImgFunc() {
	const cache = new Map();
	return {
		show() {
			//if (!this.getAttribute("src")) return; // Зачем??
			const srcName = this.getAttribute("src").replace("_S", "_B");
			if (!cache.has(srcName)) {
				const img = document.createElement("img");
				img.src = srcName;
				img.alt = "";
				img.width = 400;
				img.height = 400;
				img.style.display = "block";
				biggerIMGContainer.appendChild(img);
				cache.set(srcName, img);
				img.onload = () => biggerIMGContainer.classList.add("visible");
			} else {
				cache.get(srcName).style.display = "block";
				biggerIMGContainer.classList.add("visible");
			}
		},
		hide() {
			//if (!this.getAttribute("src")) return; // Зачем??
			const srcName = this.getAttribute("src").replace("_S", "_B");
			biggerIMGContainer.classList.remove("visible");
			const entry = cache.get(srcName);
			if (entry) entry.style.display = "none";
		},
	};
}