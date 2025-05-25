const quotes = ["I used to be an adventurer like you. Then I took an arrow in the knee...",
"Let me guess... Someone stole your sweetroll.", "M'aiq wishes you well."];
animateQuotes();
function animateQuotes() {
	let quote = document.getElementById("quote");
	for (let i of quotes) {
		let span1 = document.createElement("span"), span2 = document.createElement("span");
		quote.appendChild(span1).textContent = i;
		quote.appendChild(span2);
		span2.style.display = "inline-block";
		span2.style.width = document.getElementById("quotesContainer").clientWidth + "px";
	}
	quote.removeChild(quote.lastElementChild);
	let quoteWidth = document.getElementById("quote").clientWidth;
	animateQuotes.timeThrough = quoteWidth/30;
	animateQuotes.animationState = quote.animate({left: `${-quoteWidth}px`}, {duration: animateQuotes.timeThrough * 1000, iterations: Infinity});
}
document.addEventListener("visibilitychange", () => {
	if(document.hidden) {
		animateQuotes.animationState.playbackRate = 0;
		animateQuotes.animationState.pause();
	} else {
		animateQuotes.animationState.playbackRate = 1;
		animateQuotes.animationState.play();
	}
});