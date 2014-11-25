$(function ()
{
	var $win = $(window);
	
	//#region 转化工具
	(function ()
	{
		var products = $(".layer>.layer-nav>ul");
		if (products.length < 1)
			return;

		var speedbar = $(".layer>.speed-bar>.speed");
		var productList = products.children();
		var listLength = productList.length * productList.first().outerWidth(true, true);
		var resize = function ()
		{
			products.css("marginLeft", 0);
			speedbar.css({ marginLeft: 0, width: document.documentElement.clientWidth * 100.0 / listLength + "%" });
		}
		resize();
		$win.bind("resize", resize);
		products.bind("pullmove", function (event)
		{
			products.css('marginLeft', "+=" + (event.pageX - event.prevX));
			speedbar.css("marginLeft", "+=" + (event.prevX - event.pageX) * document.documentElement.clientWidth / listLength + "%");
		}).bind("pullend", function ()
		{
			var marginLeft = parseInt(products.css("marginLeft"));
			var limit = document.documentElement.clientWidth - listLength;
			if (marginLeft > 0 || limit >= 0)
			{
				products.animate({ marginLeft: 0 }, 300);
				speedbar.animate({ marginLeft: 0 }, 300);
			}
			else if (marginLeft < limit)
			{
				products.animate({ marginLeft: limit }, 300);
				speedbar.animate({ marginLeft: -limit * 100 / listLength + "%" }, 300);
			}
		});
	})();
	//#endregion
});
