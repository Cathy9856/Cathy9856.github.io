/// <reference path="jquery.js" />
/// <reference path="jquery.mobile.js" />
/// <reference path="Ebdoor.Framework.js" />
$(document).bind("mobileinit", function ()
{
	$.extend($.mobile, {
		autoInitializePage: false
	});
});
$(function ()
{
	var $win = $(window);

	$("a[href='#']").on("tap", function (event)
	{
		event.preventDefault();
	});

	$("img").error(function ()
	{
		this.src = "http://Resource.ebdoor.com/Image/Common/NoImg/200200.jpg";
	});

	//#region PageTop
	(function ()
	{
		var button = $(".e_tophide .btnback>.btn");
		if (button.length < 1)
			return;
		var handle = $(".e_tophide .hidecon");
		var showHeight = 0;
		var marginTop = handle.css("marginTop");
		handle.css("marginTop", 0);
		var hiddenHeight = handle.outerHeight(true, true);
		handle.css("marginTop", marginTop);
		var startY = 0;
		var isClosing = parseInt(handle.css("marginTop")) < 0;

		var move = function (event)
		{
			var offset = (event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY) - startY;
			if (isClosing && offset > 0) handle.css("marginTop", Math.min(0, offset - hiddenHeight));
			else if (!isClosing && offset < 0) handle.css("marginTop", Math.max(-hiddenHeight, offset));
			event.preventDefault();
		};
		var mouseup = function (event)
		{
			var offset = (event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0].pageY : event.pageY) - startY;
			if (offset != 0)
			{
				if (isClosing)
				{
					handle.css("transition", "margin-top 0.3s linear");
					$win.triggerHandler("scrollstart");
					setTimeout(function ()
					{
						$win.triggerHandler("scrollstop");
					}, 300);
					handle.css("marginTop", 0);
				}
				else
				{
					handle.css("transition", "margin-top 0.3s linear");
					$win.triggerHandler("scrollstart");
					setTimeout(function ()
					{
						$win.triggerHandler("scrollstop");
					}, 300);
					handle.css("marginTop", -hiddenHeight);
				}
			}
		}

		var click = function ()
		{
			handle.css("transition", "margin-top 0.3s linear");
			handle.css("marginTop", isClosing ? 0 : -hiddenHeight);
			$win.triggerHandler("scrollstart");
			setTimeout(function ()
			{
				$win.triggerHandler("scrollstop");
				handle.css("transition", "");
			}, 300);
			isClosing = !isClosing;
		};
		if ("ontouchstart" in window && "ontouchmove" in window && "ontouchend" in window)
		{
			button.bind("touchstart", function (event)
			{
				startY = event.originalEvent.touches[0].pageY;
				isClosing = parseInt(handle.css("marginTop")) < 0;
				handle.css("transition", "");

				button.bind("touchmove", move).one("touchend", function (event)
				{
					button.unbind("touchmove", move);
					mouseup(event);
				});
			}).bind("tap", click);
		}
		else
		{
			button.bind("mousedown", function (event)
			{
				handle.css("transition", "");
				startY = event.pageY;
				isClosing = parseInt(handle.css("marginTop")) < 0;

				$(document).bind("mousemove", move).one("mouseup", function (event)
				{
					$.event.remove(document, "mousemove", move);
					mouseup(event);
				});
			}).click(click);
		}

		var defaultText = "请输入产品关键词";
		var textBox = $(".e_tophide .hidecon .search input");
		textBox.focus(function ()
		{
			if (this.value == defaultText) this.value = "";
		}).blur(function ()
		{
			if (!this.value) this.value = defaultText;
		});
		textBox.next().bind("tap", function ()
		{
			var text = textBox.val();
			if (text && text != defaultText)
				window.open(textBox.attr("data-url").replace("{0}", encodeURIComponent(text)));
		});
		textBox.parent().submit(function ()
		{
			var text = textBox.val();
			if (text && text != defaultText)
				window.open(textBox.attr("data-url").replace("{0}", encodeURIComponent(text)));
			return false;
		});
	})();
	//#endregion

	Ebdoor.Effect.autoPlay(".banner .images ul", { positionBar: ".banner .indexer li" });

	//#region 首页推荐产品
	(function ()
	{
		var products = $(".recomprod>ul");
		if (products.length < 1)
			return;

		var speedbar = $(".recomprod .speedbar .speed");
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

	//#region 分页
	(function ()
	{
		var radio = $(".Pager .slider .radio");
		if (radio.length < 1)
			return;
		var bar = $(".Pager .slider .bar");
		var barWidth = 0;
		var barOffset = 0;
		var offsetLeft = parseFloat(bar.css("marginLeft")) - radio.width() / 2;

		var current = $(".Pager .status .cur");
		var totalPages = parseInt($(".Pager .status .all").text());
		var currentPage = parseInt(current.text());

		var pullstart = function (event)
		{
			barWidth = bar.outerWidth();
			barOffset = bar.offset().left;
		};
		var pullmove = function (event)
		{
			var left = Math.max(0, Math.min(event.pageX - barOffset, barWidth));
			current.text(Math.round(left * (totalPages - 1) / barWidth) + 1);
			radio.css("left", left + offsetLeft);
		};
		var pullend = function (event)
		{
			if (currentPage != parseInt(current.text()))
				location.href = radio.attr('data-href').replace("{0}", current.text());
		};
		$(".Pager .slider .radio").bind({ pullstart: pullstart, pullmove: pullmove, pullend: pullend });
		bar.bind("tap", function (event)
		{
			pullstart(event);
			pullmove(event);
			pullend(event);
		});
		var status = $(".Pager .op-line .status");
		status.bind("tap", function ()
		{
			if (status.hasClass("off"))
				$(".Pager .slider").show();
			else
				$(".Pager .slider").hide();
			status.toggleClass("on off");
		}).one("tap", function ()
		{
			radio.css("left", (currentPage - 1) * bar.outerWidth() / (totalPages - 1) + offsetLeft);
		});
	})();
	//#endregion

	//#region 企业介绍
	(function ()
	{
		var companyprofile = $(".companyprofile .company_detail");
		if (companyprofile.length == 0)
			return;
		var unfold = $(".companyprofile .unfold");
		var unfold_off = $(".companyprofile .unfold_off");
		var resize = function ()
		{
			unfold.hide();
			unfold_off.hide();
			companyprofile.css("maxHeight", "");
			if (companyprofile.css("maxHeight") == companyprofile.css("height"))
			{
				unfold.show();
			}
		};
		resize();
		$win.resize(resize);
		unfold.bind("tap", function ()
		{
			companyprofile.css("maxHeight", "none");
			unfold.hide();
			unfold_off.show();
		});
		unfold_off.bind("tap", function ()
		{
			companyprofile.css("maxHeight", "");
			unfold.show();
			unfold_off.hide();
		});
	})();
	//#endregion

	//#region 留言
	if ($("").ajaxForm)
		$(".message>form").ajaxForm({
			beforeSubmit: function (event)
			{
				var title = document.getElementById("title");
				if (!title.value)
				{
					alert("请输入标题！")
					title.focus();
					return false;
				}
				var content = document.getElementById("content");
				if (!content.value)
				{
					alert("请输入内容！")
					content.focus();
					return false;
				}
				var name = document.getElementById("name");
				if (!name.value)
				{
					alert("请输入您的名字！")
					name.focus();
					return false;
				}
				var telphone = document.getElementById("telphone");
				if (!telphone.value)
				{
					alert("请输入电话号码或手机号码！")
					telphone.focus();
					return false;
				}
				if (!/^(\d{3,4}-\d{7,8})|(1\d{10})$/.test(telphone.value))
				{
					alert("请输入正确的电话号码或手机号码，如021-34324565。")
					telphone.focus();
					return false;
				}
				var email = document.getElementById("email");
				if (!email.value)
				{
					alert("请输入电子邮箱地址！")
					email.focus();
					return false;
				}
				if (!/^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/.test(email.value))
				{
					alert("请输入正确的电子邮箱地址！")
					email.focus();
					return false;
				}
			}, "success": function ()
			{
				$(".message > .calling").show();
				setTimeout(function ()
				{
					$(".message > .calling").hide();
				}, 3000);
			}
		});
	//#endregion

	//#region 电话回呼
	(function ()
	{
		var recall = $("body>.Recall");
		if (recall.length == 0)
			return;
		$(".Recall .callMethod>.method>div").bind("tap", function ()
		{
			var self = $(this);
			if (!self.hasClass("checked"))
			{
				self.siblings().andSelf().toggleClass("checked");
				$(".Recall .input").toggle();
			}
		});

		var inputs = $(".Recall .input>input");
		inputs.focus(function ()
		{
			this.type = "number";
			if (this.value && $.data(this, "value") == this.value)
				this.value = "";
			this.className = "";
		}).blur(function ()
		{
			this.type = "text";
			if (!this.value || this.value == $.data(this, "value"))
			{
				this.value = $.data(this, "value")
				this.className = "empty";
			}
		});
		inputs.filter("#area").data("value", "区号");
		inputs.filter("#telphone").data("value", "电话号码");
		inputs.filter("#mobile").data("value", "手机号码");

		$("body>.Recall>form").ajaxForm({
			"beforeSubmit": function (event)
			{
				if ($(".Recall .callMethod>.method>div.checked:first-child").length > 0)
				{
					var area = document.getElementById('area');
					if (!area.value)
					{
						alert("请输入区号！");
						area.focus();
						return false;
					}
					if (!/^\d{3,4}$/.test(area.value))
					{
						alert("请输入正确的区号！");
						area.focus();
						return false;
					}
					var telphone = document.getElementById("telphone");
					if (!telphone.value)
					{
						alert("请输入电话号码！");
						telphone.focus();
						return false;
					}
					if (!/^\d{7,8}$/.test(telphone.value))
					{
						alert("请输入正确的电话号码！");
						telphone.focus();
						return false;
					}
					$(".Recall .callMethod>.method>input").val(0);
				}
				else
				{
					var mobile = document.getElementById("mobile");
					if (!mobile.value)
					{
						alert("请输入手机号码！");
						mobile.focus();
						return false;
					}
					if (!/^1\d{10}$/.test(mobile.value))
					{
						alert("请输入正确的手机号码！");
						mobile.focus();
						return false;
					}
					$(".Recall .callMethod>.method>input").val(1);
				}
			}, "success": function ()
			{
				$(".Recall > .calling").show();
				setTimeout(function ()
				{
					$(".Recall > .calling").hide();
				}, 3000);
			}
		});
	})();
	//#endregion

	//#region 最新产品推荐
	(function ()
	{
		var items = $(".prodnew .prodscroll");
		if (items.length == 0)
			return false;
		var array = [];
		items.each(function (index, div)
		{
			var handle = Ebdoor.Effect.autoPlay($(".images ul", div), { positionBar: $(".scroll li", div), selectedClass: "current" });
			if (handle)
				array.push({ obj: div, handle: handle });
		});
		var scrollstop = function ()
		{
			var clientHeight = document.documentElement.clientHeight;
			$.each(array, function (index, obj)
			{
				var clientRect = obj.obj.getBoundingClientRect();
				if (clientRect.bottom < 0 || clientRect.top > clientHeight)
					obj.handle.stop();
				else
					obj.handle.continue();
			});
		};
		$win.bind("scrollstop", scrollstop);
		scrollstop();
	})();
	//#endregion

	//#region 产品浏览
	(function ()
	{
		var prodview = $(".prodview .content .content");
		if (prodview.length == 0)
			return;
		var unfold = $(".prodview .unfold");
		var unfold_off = $(".prodview .unfold_off");
		var resize = function ()
		{
			unfold.hide();
			unfold_off.hide();
			prodview.css("maxHeight", "");
			if (prodview.css("maxHeight") == prodview.css("height"))
				unfold.show();
		};
		resize();
		$win.resize(resize);
		unfold.bind("tap", function ()
		{
			prodview.css("maxHeight", "none");
			unfold.hide();
			unfold_off.show();
		});
		unfold_off.bind("tap", function ()
		{
			prodview.css("maxHeight", "");
			unfold.show();
			unfold_off.hide();
		});
	})();
	Ebdoor.Effect.autoPlay(".prodview .prodscroll>.images>ul", { positionBar: ".prodview .prodscroll>.scroll li", selectedClass: "current" });
	//#endregion

	//#region 转化工具
	(function ()
	{
		var products = $(".f_layer>ul");
		if (products.length < 1)
			return;

		var speedbar = $(".f_layer>.speedbar>.speed");
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

	//#region 新闻浏览页
	(function ()
	{
		var head = $("body>.newsbrowse>header");
		if (head.length == 0)
			return;
		var table = head.children();
		head.css("height", table.height());
		var topHeight = $("body>.pageTop").height();
		$win.bind("scrollstop", function ()
		{
			topHeight = $("body>.pageTop").height();
		}).bind("scroll scrollstop", function ()
		{
			if (Math.max(document.body.scrollTop, document.documentElement.scrollTop) >= topHeight)
				table.css("position", "fixed");
			else
				table.css("position", "");
		});
	})();
	//#endregion

	//#region 免费商铺页底
	$(".disclaimer>a").bind("tap", function ()
	{
		$(this).parent().hide();
		$(".e_footer span a").css("color", "");
	});
	$(".e_footer span a").bind("tap", function ()
	{
		$(".disclaimer").toggle();
		this.style.color = !this.style.color ? "#fd6801" : "";
	});
	$(".e_footer .arrow_up").bind("tap", function ()
	{
		$(".e_footer span a").trigger("click");
	});

	Ebdoor.Effect.autoPlay(".ebdad .ad_img ul", {
		playing: function (index) { $(".ebdad .speedbar .speed").css("marginLeft", index * 320); }
	});
	//#endregion
});
