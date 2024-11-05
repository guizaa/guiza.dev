$("#content").css("visibility", "visible");
$("#content").css("opacity", 1);

$("#content").animate({ scrollTop: $("#content")[0].scrollHeight }, 0, function () {
	$(this).animate({ scrollTop: 0 }, 1000);
});
