function home_transition() {
let idiv = $("#index_div");
let mainContent = $("#content")

idiv.css("transition", 
	"width 1.25s ease, height 1.25s ease, filter 1s");
idiv.addClass('fullscreen');				
idiv.css("border", "none");
$("#index_text").css("opacity", "0");

setTimeout(function() {
	$("#index_text").css("display", "none");
	idiv.css("filter", "grayscale(100%) brightness(55%) contrast(200%) blur(20px)");
}, 500);

setTimeout(function() {
	mainContent.removeClass("invisible");
//	mainContent.animate({scrollTop: 0}, 1000);
	$("#input").focus();
}, 1000);

}	

let home = $("#home");
let homeColorState = 1;
setInterval(function () {
	if (homeColorState === 0) {
		home.css("color", "white");
		homeColorState = 1;
	}
	else {
		home.css("color", "#B8E9FF");
		homeColorState = 0;
	}	
}, 750);

$("#home").click(home_transition);	

$(window).on('hashchange', function () {
	let hash = window.location.hash;
	console.log(hash);

	if (!hash) {
		window.location.href = "";
	}
	else if (hash === "#home") {
		home_transition();
}
});
