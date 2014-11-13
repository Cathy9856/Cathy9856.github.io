/// <summary>
/// author:彭伟
/// date:2012/06/21
/// </summary>
/// <reference path="jquery-1.8.1-vsdoc.js" />
window.Ebdoor = window.Ebdoor || (function ($)
{
	/// <summary>
	/// init framework
	/// </summary>
	var Ebdoor = {
		"Version": "1.0"
	};

	window.isIE6 = window.ActiveXObject && (!window.XMLHttpRequest || document.compatMode === "BackCompat");

	(function ()
	{
		if (!$.noop)
			$.noop = function () { };

		//#region trim
		if (!String.prototype.trim)
			String.prototype.trim = function ()
			{
				return $.trim(this);
			};
		//#endregion

		String.prototype.byteLength = function ()
		{
			/// <summary>
			/// 获取字符串字节长度（单字节占一位，多字节占两位）
			/// </summary>
			/// <returns type="Number" />
			var length = 0;
			for (var index = 0; index < this.length; index++)
			{
				if (this.charCodeAt(index) > 255)
					length += 2;
				else
					length += 1;
			}
			return length;
		};

		String.prototype.subByteString = function (byteStartIndex, byteLength)
		{
			/// <summary>
			/// 按字节长度截取字符串（单字节占一位，多字节占两位）
			/// </summary>
			/// <param name="byteStartIndex" type="Number">开始位置</param>
			/// <param name="byteLength" type="Boolean">字节长度</param>
			/// <returns type="String" />
			var startIndex = 0, length = 0, temp = 0;
			if (byteStartIndex > 0)
				for (var index = 0; index < this.length; index++)
				{
					if (this.charCodeAt(index) > 255)
						temp++;
					startIndex = index;
					if (++temp >= byteStartIndex)
					{
						if (temp > byteStartIndex)
							byteLength--;
						else
							startIndex++;
						break;
					}
				}

			for (var index = startIndex, temp = 0; index < this.length;)
			{
				if (this.charCodeAt(index) > 255)
					temp++;
				length = ++index;
				if (++temp >= byteLength)
				{
					if (temp > byteLength)
						length--;
					break;
				}
			}

			return this.substring(startIndex, length);
		}

		String.prototype.endsWith = function (suffix, ignoreCase)
		{
			/// <summary>
			/// 判断字符串是否是以输入的字符串结束
			/// </summary>
			/// <param name="suffix" type="String">结尾字符串</param>
			/// <param name="ignoreCase" type="Boolean">是否忽略大小写</param>
			var str = this;
			if (ignoreCase)
			{
				str = str.toLowerCase();
				suffix = suffix.toLowerCase();
			}
			return str.indexOf(suffix, this.length - suffix.length) !== -1;
		};

		String.prototype.startsWith = function (suffix, ignoreCase)
		{
			/// <summary>
			/// 判断字符串是否是以输入的字符串结束
			/// </summary>
			/// <param name="suffix" type="String">结尾字符串</param>
			/// <param name="ignoreCase" type="Boolean">是否忽略大小写</param>
			var str = this;
			if (ignoreCase)
			{
				str = str.toLowerCase();
				suffix = suffix.toLowerCase();
			}
			return str.indexOf(suffix) === 0;
		};


		//jQuery扩展

		/*$.fn.stringify = function (obj)
		{
		JSON.stringify()
		}*/

		$.fn.zoom = function (option)
		{
			if (this.length > 0)
			{
				var zoomInfo = {};
				var zoomHandle = $("<div class='zoom'><img /><div>");
				var zoomRect = $("<div class='zoomRect' style='width:100px;height:100px;'></div>");
				zoomRect.mouseout(function ()
				{
					$(this).hide();
					zoomHandle.hide();
				}).mousemove(function (event)
				{
					var left = event.pageX;
					var top = event.pageY;
					if (left < zoomInfo.rectLeft)
						left = zoomInfo.rectLeft;
					else if (left > zoomInfo.rectRight)
						left = zoomInfo.rectRight;
					if (top < zoomInfo.rectTop)
						top = zoomInfo.rectTop;
					else if (top > zoomInfo.rectBottom)
						top = zoomInfo.rectBottom;
					left -= zoomInfo.rectWidth / 2;
					top -= zoomInfo.rectHeight / 2;
					zoomHandle.children().css({ "marginLeft": -(left - zoomInfo.left) * zoomInfo.scaling, "marginTop": -(top - zoomInfo.top) * zoomInfo.scaling });
					zoomRect.css({ "left": left, "top": top });
				});
				$(function ()
				{
					$(document.body).append(zoomHandle);
					$(document.body).append(zoomRect);
				});
				this.each(function (index, img)
				{
					var newImg = new Image();
					newImg.onload = function ()
					{
						if (this.width >= 500 || this.height >= 500)
						{
							$(img).mouseenter(function (event)
							{
								var my = $(this);
								if (zoomInfo.object !== this)
								{
									var bigWidth = Math.min(300, newImg.width);
									var bigHeight = Math.min(300, newImg.height);
									var offset = my.offset();
									zoomInfo.top = offset.top;
									zoomInfo.left = offset.left;
									zoomInfo.scaling = newImg.width / this.width;
									zoomInfo.rectHeight = zoomInfo.rectWidth = bigWidth * this.width / newImg.width;
									zoomInfo.rectTop = zoomInfo.top + zoomInfo.rectHeight / 2;
									zoomInfo.rectBottom = zoomInfo.top + this.height - zoomInfo.rectHeight / 2;
									zoomInfo.rectLeft = zoomInfo.left + zoomInfo.rectWidth / 2;
									zoomInfo.rectRight = zoomInfo.left + this.width - zoomInfo.rectWidth / 2;
									zoomInfo.object = this;
									var poff = my.parent().offset();
									zoomHandle.css({ "width": bigWidth, "height": bigHeight, "top": poff.top + my.parent().outerHeight(true) / 2 - bigHeight / 2, "left": poff.left + my.parent().outerWidth(true) + 10 }).children().attr("src", this.src);
									zoomRect.css({ "width": zoomInfo.rectWidth, "height": zoomInfo.rectHeight });
								}
								zoomHandle.show();
								zoomRect.show();
								var left = event.pageX;
								var top = event.pageY;
								if (left < zoomInfo.rectLeft)
									left = zoomInfo.rectLeft;
								else if (left > zoomInfo.rectRight)
									left = zoomInfo.rectRight;
								if (top < zoomInfo.rectTop)
									top = zoomInfo.rectTop;
								else if (top > zoomInfo.rectBottom)
									top = zoomInfo.rectBottom;
								left -= zoomInfo.rectWidth / 2;
								top -= zoomInfo.rectHeight / 2;
								zoomRect.css({ "left": left, "top": top });
							});
						}
					};
					newImg.src = img.src;
				});
			}
			return this;
		};

		$.fn.drag = function (dragHandle)
		{
			/// <summary>
			/// 拖动元素
			/// </summary>
			/// <param name="dragHandle" type="selector">默认为自己</param>
			/// <returns type="this" />
			var target = this;
			dragHandle = dragHandle ? $(dragHandle, target) : target;
			var diffX = 0, diffY = 0;
			dragHandle.css("cursor", "move");
			var mousemove;
			if (isIE6)
				mousemove = function (event)
				{
					target.css({ "left": document.documentElement.scrollLeft + event.clientX - diffX, "top": document.documentElement.scrollTop + event.clientY - diffY });
				}
			else
				mousemove = function (event)
				{
					target.css({ "left": event.clientX - diffX, "top": event.clientY - diffY });
				}
			var mouseup = function (event)
			{
				$(document).unbind("mousemove", mousemove).unbind("mouseup", mouseup);
			}
			dragHandle.mousedown(function (event)
			{
				var self = $(this);
				diffX = event.pageX - self.offset().left;
				diffY = event.pageY - self.offset().top;
				$(document).bind("mousemove", mousemove).bind("mouseup", mouseup);
			});
			return this;
		};

		if (window.ActiveXObject && !('oninput' in window)) (function ()
		{
			var isInput = function (elem)
			{
				return elem.nodeName === "INPUT" || elem.nodeName === "TEXTAREA";
			};
			var isFirstChange = true;
			var input = function (event)
			{
				if (isFirstChange && event.propertyName === "value")
				{
					isFirstChange = false;
					$.event.trigger('input', null, event.srcElement);
					isFirstChange = true;
				}
			};
			$.event.special.input = {
				setup: function ()
				{
					if (!isInput(this))
						return false;

					this.attachEvent("onpropertychange", input);
				},
				teardown: function ()
				{
					this.detachEvent("onpropertychange", input);
				}
			};
		})();
		$.fn.input = function (callback)
		{
			/// <summary>
			/// 文本输入事件
			/// </summary>
			return callback ? this.bind('input', callback) : this.trigger('input');
		};

		$.fn.maxByteLength = function (maxByteLength)
		{
			/// <summary>
			/// 文本最大字节长度
			/// </summary>
			/// <param name="maxByteLength" type="Number">最大字节长度</param>
			/// <returns type="this" />
			this.filter(function ()
			{
				var length = parseInt(maxByteLength || this.getAttribute("data-maxbytelength"));
				if (isNaN(length))
					return false;

				this.setAttribute("data-maxbytelength", length);
				this.setAttribute("maxLength", length);
				return true;
			}).input(function (event)
			{
				var length = parseInt(this.getAttribute("data-maxbytelength"));
				if (this.value.byteLength() > length)
				{
					this.value = this.value.subByteString(0, length);
					event.stopImmediatePropagation();
				}
			});
			return this;
		}

		$.event.special.pullmove = {
			setup: function ()
			{
				var pullend = function (event)
				{
					var self = $(this);
					if (Math.abs(event.startX - event.pageX) > 40)
					{
						if (event.startX - event.pageX > 0)
							event.type = "pullright";
						else
							event.type = "pullleft";

						self.trigger(event);
						event.type = "pullend";
					}
					else
						event.type = "pullcancel";
					self.trigger(event);
				}
				if ("ontouchstart" in window && "ontouchmove" in window && "ontouchend" in window)
				{
					$.event.add(this, "touchstart", function (event)
					{
						var self = $(this);
						var touch = event.originalEvent.touches[0];
						for (p in touch)
							event[p] = touch[p];
						var startX = event.pageX;
						var startY = event.pageY;
						var prevX = event.pageX;
						var prevY = event.pageY;

						event.type = "pullstart";
						self.trigger(event);

						var touchmove = function (event)
						{
							var touch = event.originalEvent.touches[0];
							for (p in touch)
								event[p] = touch[p];

							event.type = "pullmove";
							event.startX = startX;
							event.startY = startY;
							event.prevX = prevX;
							event.prevY = prevY;
							prevX = event.pageX;
							prevY = event.pageY;

							self.trigger(event);
							event.preventDefault();
						};
						var touchend = function (event)
						{
							self.unbind("touchmove", touchmove);

							var touch = event.originalEvent.changedTouches[0];
							for (p in touch)
								event[p] = touch[p];
							event.startX = startX;
							event.startY = startY;

							pullend.call(this, event);
						};

						self.bind("touchmove", function (event)
						{
							var touch = event.originalEvent.touches[0];
							if (Math.abs(startY - touch.pageY) > 10)
								self.unbind("touchmove", arguments.callee);
							else if (Math.abs(startX - touch.pageX) > 40)
								self.unbind("touchmove", arguments.callee).bind("touchmove", touchmove).one("touchend", touchend);
							else event.preventDefault();
						});
					});
				}
				else
				{
					$.event.add(this, "mousedown", function (event)
					{
						var self = $(this);
						var startX = event.pageX;
						var prevX = event.pageX;
						var startY = event.pageY;
						var prevY = event.pageY;

						event.type = "pullstart";
						self.trigger(event);

						var mousemove = function (event)
						{
							event.type = "pullmove";
							event.startX = startX;
							event.startY = startY;
							event.prevX = prevX;
							event.prevY = prevY;
							prevX = event.pageX;
							prevY = event.pageY;
							self.trigger(event);
						};
						$(document).bind("mousemove", mousemove).one("mouseup", function (event)
						{
							$.event.remove(document, "mousemove", mousemove);

							event.startX = startX;
							event.startY = startY;
							pullend.call(self[0], event);
						});
					});
				}
			}
		};
		$.each(["pullstart", "pullleft", "pullright", "pullend", "pullcancel"], function (index, event)
		{
			$.event.special[event] = { setup: function () { $(this).bind("pullmove", $.noop); } };
		});
	})();

	$(function ()
	{
		$("a[href='#']").live("click", function (event)
		{
			event.preventDefault();
		});
		Ebdoor.Util.processImageWhenError("img[data-error]");
	});

	Ebdoor.Cookie = (function ()
	{
		return {
			get: function (name)
			{
				/// <summary>
				/// 获得cookie
				/// </summary>
				/// <param name="name" type="String">cookie名称，必须</param>
				/// <returns type="String" />
				if (!name)
				{
					throw new Error("cookie名称是必须的");
				}
				var cookieName = encodeURIComponent(name) + "=";
				var cookieStart = document.cookie.indexOf(cookieName);
				var cookieValue = null;
				if (cookieStart > -1)
				{
					var cookieEnd = document.cookie.indexOf(";", cookieStart);
					if (cookieEnd === -1)
					{
						cookieEnd = document.cookie.length;
					}
					cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd).replace(/\+/g, ' '));
				}
				return cookieValue;
			},
			set: function (name, value, expires, domain, path, secure)
			{
				/// <summary>
				/// 设置cookie
				/// </summary>
				/// <param name="name" type="String">cookie名称，必须</param>
				/// <param name="value" type="String">cookie值，必须</param>
				/// <param name="expires" type="Date">cookie有效斯，可省</param>
				/// <param name="domain" type="String">cookie域，可省</param>
				/// <param name="path" type="String">cookie路径，可省</param>
				/// <param name="secure" type="Boolean">true或false，可省</param>
				if (!name || arguments.length < 2)
				{
					throw new Error("cookie名称和值是必须的");
				}
				var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
				if (expires instanceof Date)
					cookieText += "; expires=" + expires.toGMTString();
				if (!!domain)
					cookieText += "; doamin=" + domain;
				if (!!path)
					cookieText += "; path=" + path;
				if (secure)
					cookieText += "; secure";
				document.cookie = cookieText;
			},
			unset: function (name, domain, path, secure)
			{
				/// <summary>
				/// 删除cookie
				/// </summary>
				/// <param name="name" type="String">cookie名称，必须</param>
				/// <param name="domain" type="String">cookie域，可省</param>
				/// <param name="path" type="String">cookie路径，可省</param>
				/// <param name="secure" type="Boolean">true或false，可省</param>
				this.set(name, "", domain, new Date(0), path, secure);
			},
			getSub: function (name, subName)
			{
				/// <summary>
				/// 获得子cookie
				/// </summary>
				/// <param name="name" type="String">cookie父名称，必须</param>
				/// <param name="subName" type="String">cookie子名称，必须</param>
				/// <returns type="String" />
				if (!name || !subName)
				{
					throw new Error("cookie父名称和子名称是必须的");
				}
				var subCookies = this.getAll(name);
				if (!!subCookies)
					return subCookies[subName];
				return null;
			},
			getAll: function (name)
			{
				/// <summary>
				/// 获得所有子cookie
				/// </summary>
				/// <param name="name" type="String">cookie名称，必须</param>
				/// <returns type="Array" />
				if (!name)
				{
					throw new Error("cookie名称是必须的");
				}
				var cookieValue = this.get(name);
				if (!!cookieValue)
				{
					var subCookies = cookieValue.split('&');
					var result = {};
					for (var index = 0; index < subCookies.length; index++)
					{
						var parts = subCookies[index].split("=");
						result[decodeURIComponent(parts[0].replace(/\+/g, ' '))] = decodeURIComponent(parts[1].replace(/\+/g, ' '));
					}
					return result;
				}
				return null;
			},
			setSub: function (name, subName, value, expires, domain, path, secure)
			{
				/// <summary>
				/// 设置cookie
				/// </summary>
				/// <param name="name" type="String">cookie名称，必须</param>
				/// <param name="subName" type="String">cookie子名称，必须</param>
				/// <param name="value" type="String">cookie子值，必须</param>
				/// <param name="expires" type="Date">cookie有效斯，可省</param>
				/// <param name="domain" type="String">cookie域，可省</param>
				/// <param name="path" type="String">cookie路径，可省</param>
				/// <param name="secure" type="Boolean">true或false，可省</param>
				if (!name || !subName || !!value)
				{
					throw new Error("cookie父名称、子名称和子值是必须的");
				}
				var subCookies = this.getAll(name) || {};
				subCookies[subName] = value;
				this.setAll(name, subCookies, expires, domain, path, secure);
			},
			setAll: function (name, subCookies, expires, domain, path, secure)
			{
				/// <summary>
				/// 设置cookie
				/// </summary>
				/// <param name="name" type="String">cookie名称，必须</param>
				/// <param name="subCookies" type="Object">cookie值对象，必须</param>
				/// <param name="expires" type="Date">cookie有效斯，可省</param>
				/// <param name="domain" type="String">cookie域，可省</param>
				/// <param name="path" type="String">cookie路径，可省</param>
				/// <param name="secure" type="Boolean">true或false，可省</param>
				if (!name || arguments.length < 2 || typeof (subCookies) !== "object")
				{
					throw new Error("cookie名称和值对象是必须的");
				}
				var cookieText = encodeURIComponent(name) + "=";
				var subCookieParts = [];
				for (var subName in subCookies)
				{
					if (subName.length > 0 && subCookies.hasOwnProperty(subName))
					{
						subCookieParts.push(encodeURIComponent(subName) + "=" + encodeURIComponent(subCookies[subName]));
					}
				}
				this.set(name, cookieText + subCookieParts.join("&"), expires, domain, path, secure);
			}
		};
	})();

	Ebdoor.Validator = (function ()
	{
		return {
			hasSymbol: function (text)
			{
				/// <summary>
				/// 判断字符串中是否有符号
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return new RegExp("[~|`|!|@|#|\$|%|\^|&|\*|\(|\)|_|=|\+|\\\\|\||\{|\}|\[|:|\"|;|'|<|>|\,|/|\\.|\\?|\\]|\\-|\\x20]+").test(text);
			},
			hasUpperCase: function (text)
			{
				/// <summary>
				/// 判断字符串中是否有大写字符
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /[A-Z]+/.test(text);
			},
			hasLowerCase: function (text)
			{
				/// <summary>
				/// 判断字符串中是否有小写字符
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /[a-z]+/.test(text);
			},
			hasNumber: function (text)
			{
				/// <summary>
				/// 判断字符串中是否有数字
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /\d+/.test(str);
			},
			isNumber: function (text, dotNum)
			{
				/// <summary>
				/// 判断字符串是否是数值
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return isInteger(text) || isFloat(text);
			},
			isInteger: function (text)
			{
				/// <summary>
				/// 判断字符串是否是整数
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /^-?\d{1,308}$/.test(str);
			},
			isFloat: function (text)
			{
				/// <summary>
				/// 判断字符串是否是浮点数
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /^-?\d{1,308}\.\d{0,324}$/.test(str);
			},
			isEmail: function (text)
			{
				/// <summary>
				/// 判断字符串中是否是邮箱
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/.test(text);
			},
			isZipCode: function (text)
			{
				/// <summary>
				/// 判断字符串中是否是邮编
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /[1-9]\d{5}/.test(text);
			},
			isMobilePhone: function (text)
			{
				/// <summary>
				/// 判断字符串中是否存是手机
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /^0?1[358]\d{9}$/.test(text);
			},
			isTelphone: function (text)
			{
				/// <summary>
				/// 判断字符串中是否是电话号码
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /^(0[1-9]\d{1,2}-?)?\d{7,8}(-?\d{1,4})?$/.test(text);
			},
			isID: function (text)
			{
				/// <summary>
				/// 判断字符串是否是身份证
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /([0-9]{6}[0-9][0-9][0|1][0-9][0|1|2|3][0-9][0-9]{3})|([0-9]{6}[1|2][0|9][0-9][0-9][0|1][0-9][0|1|2|3][0-9][0-9]{4})|([0-9]{6}[1|2][0|9][0-9][0-9][0|1][0-9][0|1|2|3][0-9][0-9]{3}X)/.test(text);
			},
			isDomain: function (text)
			{
				/// <summary>
				/// 判断字符串是否是域名
				/// </summary>
				/// <param name="text" type="String">输入字符串</param>
				/// <returns type="Boolean" />
				return /^([\w-]+\.)+([\w-]+(\.)?)$/.test(text);
			}
		};
	})();

	Ebdoor.Dialog = (function ()
	{
		var dialogList = [];	//弹出框列表
		var isDialogShow = false;
		var WindowsList = {}; //窗体列表
		return {
			popup: function (div, option)
			{
				/// <summary>
				/// 创建模态窗口
				/// </summary>
				/// <param name="div" type="DOM">需要被创建为模态窗口的DOM元素引用</param>
				/// <param name="option" type="Object">选项，默认非全屏</param>
				/// <returns type="DOM" />
				option = option || {};
				var opacity = option.opacity || 0.5;
				var dialog = $(div);
				if (!option.noClone)
					dialog = dialog.clone(true, true);
				var dialog2 = dialog.appendTo(document.body).show();
				dialog = dialog2[0];
				dialog.close = function (event)
				{
					$(window).unbind("resize scroll", dialog.adjustPosition);
					if (background)
						document.body.removeChild(background);
					document.body.removeChild(dialog);
					dialog.adjustPosition = undefined;
					event.preventDefault();
					dialog2.triggerHandler("close");
					dialog2.unbind("close");
				};
				document.body.appendChild(dialog);
				var rootEelement = document.compatMode === "BackCompat" ? document.body : document.documentElement;
				var $win = $(window);
				var background = undefined;
				if (isIE6)
				{
					//#region IE6 Mode
					background = document.createElement('iframe');
					var style = background.style;
					dialog.style.position = style.position = "absolute";
					style.border = "none";
					document.body.appendChild(background);
					background.contentWindow.document.bgColor = option.bgColor || "black";
					if (option.fullScreen)
					{
						style.filter = 'alpha(opacity=' + opacity * 100 + ')';
						var resize = function ()
						{
							var rect1 = document.body.getBoundingClientRect();
							var rect2 = document.documentElement.getBoundingClientRect();
							style.left = style.top = 0;
							style.width = rect1.right - rect1.left;
							style.height = Math.max(rect1.bottom - rect1.top, rect2.bottom - rect2.top);
						}
						resize();
						$win.bind("resize", resize);
						dialog2.bind("close", function ()
						{
							$win.unbind("resize", resize);
						});
						dialog.adjustPosition = function ()
						{
							dialog.style.top = rootEelement.scrollTop + (rootEelement.clientHeight - dialog.clientHeight) / 2 + "px";
							dialog.style.left = rootEelement.scrollLeft + (rootEelement.clientWidth - dialog.clientWidth) / 2 + "px";
						};
					}
					else
					{
						style.width = option.width || dialog.clientWidth + "px";
						style.height = option.height || dialog.clientHeight + "px";
						style.filter = 'alpha(opacity=0)';
						dialog.adjustPosition = function ()
						{
							dialog.style.top = rootEelement.scrollTop + (rootEelement.clientHeight - dialog.clientHeight) / 2 + "px";
							dialog.style.left = rootEelement.scrollLeft + (rootEelement.clientWidth - dialog.clientWidth) / 2 + "px";
							style.top = rootEelement.scrollTop + (rootEelement.clientHeight - background.clientHeight) / 2 + "px";
							style.left = rootEelement.scrollLeft + (rootEelement.clientWidth - background.clientWidth) / 2 + "px";
						};
					}
					$(window).bind("scroll", dialog.adjustPosition);
					//#endregion
				}
				else
				{
					//#region Standard Mode
					if (option.fullScreen)
					{
						background = document.createElement("div");
						var style = background.style;
						style.position = "fixed";
						style.zIndex = 99998;
						style.background = option.bgColor || "black";
						style.filter = 'alpha(opacity=' + opacity * 100 + ')';
						style.opacity = opacity + "";
						document.body.appendChild(background);

						style.top = style.left = style.bottom = style.right = 0;
					}
					dialog.style.position = "fixed";
					dialog.adjustPosition = function ()
					{
						dialog.style.top = (rootEelement.clientHeight - dialog.clientHeight) / 2 + "px";
						dialog.style.left = (rootEelement.clientWidth - dialog.clientWidth) / 2 + "px";
					};
					//#endregion
				}
				var closor = option.closor ? $(option.closor, dialog) : $(dialog);
				closor.click(dialog.close);
				$win.bind("resize", dialog.adjustPosition);
				dialog.style.zIndex = 99999;
				dialog.adjustPosition();
				if (option.draggable || option.dragHandle || dialog.getAttribute("draggable") === "true")
					(option.fullScreen ? dialog2 : dialog2.add(background)).drag(option.dragHandle);
				return dialog2;
			},
			popupDialog: function (panle, option)
			{
				/// <summary>
				/// 将指定的元素显示在外面（含外框）
				/// </summary>
				option = $.extend({ closeButton: true, title: "友情提示", fullScreen: true, opacity: 0.01 }, option);
				var dialog = $("<div id='dialog'><div class='title'><div class='border'><span></span><a href='#'>×</a></div></div><div class='content'></div></div>");
				dialog.find("span").text(option.title);
				if (!option.closeButton)
					dialog.find("a").remove();
				option.noClone = true;
				option.dragHandle = ".title";
				option.closor = (option.closor ? option.closor + "," : "") + ".title a";
				var content = dialog.children(".content");
				if (option.width)
				{
					content.css("width", option.width - 10);
					dialog.css("width", option.width - 2);
				}
				if (option.height)
				{
					content.css("height", option.height - 41);
					dialog.css("height", option.height - 2);
				}
				content.append($(panle).clone(true, true).show());
				var popup = this.popup;

				if (typeof (option.onclose) === "function")
					dialog.bind("close", option.onclose);
				dialog.bind("close", function ()
				{
					var obj = dialogList.shift();
					if (obj)
						popup(obj.dialog, obj.option);
					else
						isDialogShow = false;
				});
				if (isDialogShow)
					dialogList.push({ dialog: dialog, option: option });
				else
				{
					isDialogShow = true;
					this.popup(dialog, option);
				}
			},
			alert: function (message, option)
			{
				option = $.extend({ title: "友情提示", closeButton: true, closor: ".confirm", width: (message || "").byteLength() * 10 + 100, height: 160 }, option);
				var panle = $("<div class='message'></div><div class='confirm'><div class='border'><div>确定</div></div></div>");
				panle.filter(".message").text(message);
				this.popupDialog(panle, option);
			},
			error: function (message, option)
			{
				option = $.extend({ title: "提示", closeButton: false, closor: ".confirm", width: (message || "").byteLength() * 10 + 100, height: 160 }, option);
				var panle = $("<div class='message'></div><div class='confirm'><div class='border'><div>确定</div></div></div>");
				panle.filter(".message").text(message);
				this.popupDialog(panle, option);
			},
			confirm: function (message, callback, option)
			{
				option = $.extend({ title: "提示", closeButton: true, closor: ".confirm, .cancel", width: (message || "").byteLength() * 10 + 100, height: 160 }, option);
				var panle = $("<div class='message'></div><div class='buttons'><div class='confirm'><div class='border'><div>确定</div></div></div><div class='cancel'><div>取消</div></div></div>");
				panle.filter(".message").text(message);
				if (typeof (callback) === "function")
				{
					panle.find(".confirm").click(function ()
					{
						callback(true);
					});
					panle.find(".cancel").click(function ()
					{
						callback(false);
					});
				}
				this.popupDialog(panle, option);
			},
			openCenterWindow: function (url, name, width, height)
			{
				/// <summary>
				/// 打开居中窗口
				/// </summary>
				/// <param name="url" type="String">Url</param>
				/// <param name="name" type="String">窗口名称，默认为url的MD5值</param>
				/// <param name="width" type="Number">窗口宽，默认400px</param>
				/// <param name="height" type="Number">窗口高，默认300px</param>
				name = name || Ebdoor.Security.ComputeMD5(url);
				if (WindowsList[name] && !WindowsList[name].closed)
				{
					var winHandle = WindowsList[name];
					winHandle.focus();
					return;
				}
				width = width || 400;
				height = height || 300;
				var sw = screen.availWidth || screen.width;
				var sh = screen.availHeight || screen.height;
				var l = width < sw ? (sw - width) / 2 : 0;
				var t = height < sh ? (sh - height) / 2 : 0;
				var features = ' width=' + width + ',height=' + height + ',left=' + l + ',top=' + t;
				var winHandle = window.open(url, name, features);
				WindowsList[name] = winHandle;
				winHandle.focus();
			}
		};
	})();

	Ebdoor.Util = (function ()
	{
		var getImageMaxSize = function (img)
		{
			var currentStyle = img.currentStyle || document.defaultView.getComputedStyle(img);
			if (isIE6)
			{
				var maxWidth = $.data(img, "maxWidth");
				var maxHeight = $.data(img, "maxHeight");
				if (!maxWidth || !maxHeight)
				{
					maxWidth = parseInt(currentStyle.width);
					maxHeight = parseInt(currentStyle.height);
					setImageMaxSize(img, maxWidth, maxHeight);
				}
			}
			else
			{
				maxWidth = parseInt(currentStyle.maxWidth);
				maxHeight = parseInt(currentStyle.maxHeight);
			}
			return { "maxWidth": maxWidth, "maxHeight": maxHeight };
		}
		var setImageMaxSize = function (img, maxWidth, maxHeight)
		{
			$.data(img, "maxWidth", maxWidth);
			$.data(img, "maxHeight", maxHeight);
		};
		return {
			getImageMaxSize: getImageMaxSize,
			openCenterWindow: Ebdoor.Dialog.openCenterWindow,
			createPopDialog: Ebdoor.Dialog.popup,
			processImageWhenError: function (imgs)
			{
				/// <summary>
				/// 附加图片调整方法
				/// </summary>
				/// <param name="imgs" type="DOM">需要被调整的图片</param>
				imgs = $(imgs);
				var allImg = imgs.length;
				var adjust = function ()
				{
					if (--allImg > 0)
						setTimeout(adjust, 1);
					var img = new Image();
					var element = imgs[allImg];
					img.onerror = function ()
					{
						var widthHeight = getImageMaxSize(element);
						var size = Math.min(widthHeight.maxWidth, widthHeight.maxHeight);
						if (size < 100)
							size = 5050;
						else if (size < 200)
							size = 100100;
						else if (size < 250)
							size = 200200;
						else
							size = 250250;
						element.src = Ebdoor.Domain.Resource + "/Image/Common/NoImg/" + size + ".jpg";
					};
					img.src = element.src;
				};
				if (allImg > 0)
					adjust();
				return imgs;
			},
			scaleImage: function (img, maxWidth, maxHeight)
			{
				if (!isIE6)
					return;

				//maxWidth和maxHeight可省，增加这两个参数用于当更改图片尺寸时的垂直居中
				img.style.maxWidth = maxWidth || img.width;
				img.style.maxHeight = maxHeight || img.height;
				setImageMaxSize(img, maxWidth, maxHeight);
				//hasLoadFunc参数用于限制图片只有一个用于垂直居中的调整方法
				if (!img.hasLoadFunc)
				{
					img.hasLoadFunc = true;
					//如果图片更改了SRC后再次等比例缩小图片
					img.attachEvent("onload", function ()
					{
						var bbb = true;
						var t = new Image();
						//在不更改图片样式的情况下获得图片的真实尺寸
						t.onload = function ()
						{
							//#region 解决IE6的BUG
							if (!bbb)
								return;
							bbb = false;
							img.style.width = img.style.height = "";
							//#endregion
							//将图片宽和高设置为自动，因为在模式表中已经将图片的宽和高设为固定值了
							img.style.width = img.style.height = "auto";
							var maxWidth = parseInt(img.style.maxWidth);
							var maxHeight = parseInt(img.style.maxHeight);
							if (this.width > maxWidth || this.height > maxHeight)
								//如果图片的宽高比比外框的宽高比大（或者说图片更长些）的时候，宽为固定值，高为自动，否则相反
								if (this.width / this.height > maxWidth / maxHeight)
									img.style.width = maxWidth;
								else
									img.style.height = maxHeight;
						}
						t.src = img.src;
					});
				}
				//图片已经加载成功时触发load事件
				if (img.complete)
					img.src = img.src;
			},
			preview: function (file, viewImage)
			{
				viewImage = $(viewImage);
				if (window.FileReader)
				{
					var url = null;
					if (window.createObjectURL)
						url = window.createObjectURL(file);
					else if (window.URL)
						url = window.URL.createObjectURL(file);
					else if (window.webkitURL)
						url = window.webkitURL.createObjectURL(file);
					else
					{
						var reader = new FileReader();
						reader.onload = function (event)
						{
							viewImage.attr("src", event.target.result);
						};
						reader.readAsDataURL(file);
					}

					viewImage.attr("src", url);
				}
				else
				{
					viewImage.attr("src", file);
				}
			},
			addFavorite: function (name)
			{
				/// <summary>
				/// 添加到收藏夹
				/// </summary>
				/// <param name="name" type="String">收藏名</param>
				if (!!window.external)
				{
					window.external.addFavorite(document.location.href, addName);
				}
				else if (!!window.sidebar)
				{
					window.sidebar.addPanel(addName, document.location.href);
				}
			},
			setHomePage: function (url)
			{
				/// <summary>
				/// 设置为首页
				/// </summary>
				/// <param name="url" type="String">链接</param>
				if (!!window.ActiveXObject) // IE
				{
					document.body.style.behavior = 'url(#default#homepage)';
					document.body.setHomepage(url);
				}
				else
				{
					if (window.sidebar) // Firefox
					{
						if (window.netscape)
						{
							try
							{
								netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
							}
							catch (e)
							{
								alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config \\n然后将项 signed.applets.codebase_principal_support 值改为 true");
								return;
							}
						}
						var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
						prefs.setCharPref('browser.startup.homepage', url);
					}
				}
			}
		};
	})();

	Ebdoor.Domain = (function ()
	{
		var suffix = "com";
		if (new RegExp("\\.Ebdoor\\.(\\w+)?$", "ig").test(location.host))
		{
			suffix = RegExp.$1;
		}

		return {
			Agent: "http://Agent.Ebdoor." + suffix,
			Manage: "http://Manage.Ebdoor." + suffix,
			Post: "http://Post.Ebdoor." + suffix,
			Product: "http://Product.Ebdoor." + suffix,
			Resource: "http://Resource.Ebdoor." + suffix,
			Shop: "http://Shop.Ebdoor." + suffix,
			Www: "http://www.Ebdoor." + suffix,
			Search: "http://Search.Ebdoor." + suffix,
			Download: "http://Download.Ebdoor." + suffix,
			Dynjs: "http://Dynjs.Ebdoor." + suffix,
			Info: "http://Info.Ebdoor." + suffix,
			Docs: "http://Docs.Ebdoor." + suffix,
			EMarketing: "http://EMarketing.Ebdoor." + suffix,
			YiZhanTong: "http://YiZhanTong.Ebdoor." + suffix,
			DMP: "http://DMP.Ebdoor." + suffix,
			Login: "http://Login.Ebdoor." + suffix,
			Buy: "http://Buy.Ebdoor." + suffix,
			Expo: "http://Expo.Ebdoor." + suffix,
			TopNews: "http://TopNews.Ebdoor." + suffix,
			MarketingNews: "http://MarketingNews.Ebdoor." + suffix,
			QualityReport: "http://QualityReport.Ebdoor." + suffix,
			Yist: "http://Yist.Ebdoor." + suffix,
			QianSJ: "http://QianSJ.Ebdoor." + suffix,
			SJBao: "http://SJBao.Ebdoor." + suffix,
			ProdService: "http://ProdService.Ebdoor." + suffix,
			ToolsSite: "http://ToolsSite.Ebdoor." + suffix,
			Help: "http://Help.Ebdoor." + suffix,
			Report: "http://Report.Ebdoor." + suffix,
			Mmm: "http://m.Ebdoor." + suffix,
			MSearch: "http://Search.m.Ebdoor." + suffix,
			MProduct: "http://Product.m.Ebdoor." + suffix,
			MShop: "http://Shop.m.Ebdoor." + suffix,
			BizCounter: "http://bizcounter.Ebdoor." + suffix
		};
	})();

	Ebdoor.Effect = (function ()
	{
		return {
			changePage: function (itemContainer, option)
			{
				/// <summary>
				/// 左右翻页效果
				/// </summary>
				/// <param name="itemContainer" type="Object">项目容器选择器，可以为字符串、jQuery对象或DOM对象</param>
				/// <param name="option" type="Object">参数</param>
				var container = $(itemContainer);
				if (container.length === 0)
					return;
				option = $.extend({ prevY: "", prevN: "", nextY: "", nextN: "", interval: 1000, scrollStart: $.noop, scrollEnd: $.noop, totalItem: container.children().length, showIndex: 0 }, option);
				option.prevObj = $(option.prevObj);
				option.nextObj = $(option.nextObj);
				option.itemWidth || (option.itemWidth = container.children(":first").outerWidth(true));
				option.showCount || (option.showCount = Math.floor(container.parent().width() / option.itemWidth));

				if (option.totalItem > option.showCount)
				{
					option.prevObj.click(function ()
					{
						if (option.prevObj.hasClass(option.prevY) && option.showIndex > 0)
						{
							option["direct"] = "left";
							option.scrollStart.apply(option);
							container.stop(true, true).animate({ "marginLeft": "+=" + option.itemWidth * option.showCount }, option.interval, function ()
							{
								option.nextObj.removeClass(option.nextN).addClass(option.nextY);
								if (parseInt(container.css("marginLeft")) >= 0)
								{
									option.prevObj.removeClass(option.prevY).addClass(option.prevN);
									container.stop(true, true).animate({ "marginLeft": 0 }, 300, function ()
									{
										option.showIndex = 0;
										option.scrollEnd.apply(option);
									});
								}
								else
								{
									option.showIndex -= option.showCount;
									option.scrollEnd.apply(option);
								}
							});
						}
					});
					option.nextObj.click(function ()
					{
						if (option.nextObj.hasClass(option.nextY) && option.totalItem > option.showIndex)
						{
							option["direct"] = "right";
							option.scrollStart.apply(option);
							container.stop(true, true).animate({ "marginLeft": "-=" + option.itemWidth * option.showCount }, option.interval, function ()
							{
								option.prevObj.removeClass(option.prevN).addClass(option.prevY);
								if (parseInt(container.css("marginLeft")) <= -option.itemWidth * (option.totalItem - option.showCount))
								{
									container.stop(true, true).animate({ "marginLeft": -option.itemWidth * (option.totalItem - option.showCount) }, function ()
									{
										option.showIndex = option.totalItem - option.showCount;
										option.scrollEnd.apply(option);
									});
									if (!option.hasNewData)
										option.nextObj.removeClass(option.nextY).addClass(option.nextN);
									else
									{
										option.hasNewData = false;
										option.totalItem = container.children().length;
									}
								}
								else
								{
									option.showIndex += option.showCount;
									option.scrollEnd.apply(option);
								}
							});
						}
					}).removeClass(option.nextN).addClass(option.nextY);
				}
			},
			autoScroll: function (itemContainer, option)
			{
				/// <summary>
				/// 向左或向上自动滚动
				/// </summary>
				/// <param name="itemContainer" type="Object">项目容器选择器，可以为字符串、jQuery对象或DOM对象</param>
				/// <param name="option" type="Object">参数</param>
				var container = $(itemContainer);
				if (container.length == 0)
					return;
				var children = container[0].children;
				var firstChild = container.children(":first");
				if (children.length <= Math.floor(container.parent().width() / firstChild.outerWidth()) * Math.floor(container.parent().height() / firstChild.outerHeight()))
					return;
				option = $.extend({ duration: 0, interval: 200, itemWidth: firstChild.outerWidth(true), itemHeight: firstChild.outerHeight(true), direct: firstChild.position().top == container.children(":last").position().top ? "left" : "up", scrollStart: $.noop, scrollEnd: $.noop }, option);
				var action = null;
				var easing = option.duration <= 1 ? "linear" : "swing";
				if (option.direct === "left")
					action = function ()
					{
						container.animate({ "marginLeft": "-=" + option.itemWidth }, option.interval, easing, function ()
						{
							container.css("marginLeft", "+=" + option.itemWidth).append(children[0]);
							option.timer = setTimeout(action, option.duration);
						});
					}
				else
					action = function ()
					{
						container.animate({ "marginTop": "-=" + option.itemHeight }, option.interval, easing, function ()
						{
							container.css("marginTop", "+=" + option.itemHeight).append(children[0]);
							option.timer = setTimeout(action, option.duration);
						});
					}
				option.timer = setTimeout(action, option.duration);
				if (option.duration < 1)
				{
					container.hover(function ()
					{
						container.stop(true);
					}, function ()
					{
						action();
					});
				}
			},
			autoScrollWithIndexer: function (itemContainer, indexerContainer, suspendInterval, option)
			{
				/// <summary>
				/// 带有数字的切换效果
				/// </summary>
				/// <param name="itemContainer" type="Object">项目容器选择器，可以为字符串、jQuery对象或DOM对象</param>
				/// <param name="indexerContainer" type="Object">指示器选择器，可以为字符串、jQuery对象或DOM对象</param>
				/// <param name="suspendInterval" type="Integer">每个项目所需要的时间，默认2000毫秒</param>
				/// <param name="option" type="Object">其它可选项</param>
				var container = $(itemContainer);
				var indexer = $(indexerContainer);
				var childrenCount = container.children().length;
				option = $.extend({ indexerCurrentClass: "current", scrollStart: $.noop, scrollEnd: $.noop, duration: 0 }, option || {});
				if (container.length == 0 || indexer.length == 0 || childrenCount.length == 0)
					return;
				var sb = "";
				for (var index = 1; index <= childrenCount; index++)
				{
					sb += "<li><a>" + (option.showNumber ? index : "") + "</a></li>"
				}
				indexer.html(sb);
				suspendInterval = suspendInterval || 5000;
				container = container.find("li");
				indexer = indexer.find("a");
				indexer.eq(0).addClass(option.indexerCurrentClass);
				if (childrenCount > 1)
				{
					option.container = container;
					option.indexer = indexer;
					option.suspendInterval = suspendInterval;
					var length = indexer.length;
					var action = function ()
					{
						clearTimeout(timeouter);
						option.scrollStart.call(option, index);
						index = (index + 1) % length;
						container.stop(true, true).hide(option.duration).eq(index).show(option.duration);
						indexer.removeClass(option.indexerCurrentClass).eq(index).addClass(option.indexerCurrentClass);
						timeouter = setTimeout(action, suspendInterval);
						option.scrollEnd.call(option, index);
					}
					option.prev = function ()
					{
						index = (index - 2 + length) % length;
						action();
					}
					option.next = action
					index = 0;
					var timeouter = setTimeout(action, suspendInterval);
					indexer.hover(function ()
					{
						if (!$(this).hasClass(option.indexerCurrentClass))
						{
							index = (indexer.index((this)) + length - 1) % length;
							action();
						}
					});
					return option;
				}
			},
			showBIgImage: function (smallImageList, bigImage, option)
			{
				smallImageList = $(smallImageList);
				bigImage = $(bigImage);
				option = option || {};
				option = $.extend({ currentClass: "current", interval: 5000, beginChange: $.noop, endChange: $.noop, changeEvent: "click", originalImageAttr: "data-original" }, option || {});
				if (smallImageList.length > 0)
				{
					if (smallImageList.length == 1)
					{
						bigImage.attr("src", smallImageList.addClass("current").attr(option.originalImageAttr));
					}
					else
					{
						var index = 0;
						var timer;
						var changer = function ()
						{
							clearTimeout(timer);
							var current = smallImageList.eq(index);
							option.beginChange.call(current, smallImageList, bigImage, option);
							smallImageList.removeClass("current");
							bigImage.attr("src", current.addClass("current").attr(option.originalImageAttr));
							option.endChange.call(current, smallImageList, bigImage, option);
							timer = setTimeout(changer, option.interval);
						}
						changer();
						smallImageList.bind(option.changeEvent, function ()
						{
							index = smallImageList.index(this);
							changer();
						});
					}
				}
			},
			autoPlay: function (itemContainer, option)
			{
				/// <summary>
				/// 向左或向上自动滚动
				/// </summary>
				/// <param name="itemContainer" type="Object">项目容器选择器，可以为字符串、jQuery对象或DOM对象</param>
				/// <param name="option" type="Object">参数</param>
				var container = $(itemContainer);
				if (container.length == 0)
					return false;

				option = $.extend({ duration: 300, interval: 5000, positionBar: "", selectedClass: "selected", playEventType: "click", prevButton: null, nextButton: null, playing: $.noop, played: $.noop }, option || {});

				var itemsLength = container.children().length;
				var firstChild = container.children(":first");
				var lastChild = container.children(":last");
				var cssProp;
				if (option.direction !== "up")
				{
					if (!option.windowSize)
						option.windowSize = firstChild.outerWidth(true, true);
					cssProp = "marginLeft";
				}
				else
				{
					if (!option.windowSize)
						option.windowSize = firstChild.outerHeight(true, true);
					cssProp = "marginTop";
				};
				var play = function (index, currentIndex)
				{
					var showIndex = index;
					if (itemsLength > 2)
						if (index == 0 && currentIndex == itemsLength - 1)
						{
							showIndex = itemsLength;
							var item = firstChild.clone(true, true);
							container.append(item);
						}
						else if (currentIndex == 0 && index == itemsLength - 1)
						{
							showIndex = 0;
							var item = lastChild.clone(true, true);
							firstChild.before(item);
							container.css(cssProp, -option.windowSize);
						}
					var obj = {};
					obj[cssProp] = -showIndex * option.windowSize;
					container.stop(true, true).animate(obj, option.duration, function ()
					{
						if (itemsLength > 2 && (index == 0 && currentIndex == itemsLength - 1 || currentIndex == 0 && index == itemsLength - 1))
						{
							container.css(cssProp, -index * option.windowSize);
							item.remove();
						}
						option.played(index);
					});
				};

				var timer;
				var currentIndex = -1;
				var action = function (index, isAuto)
				{
					clearTimeout(timer);
					option.playing(index, currentIndex);
					if (option.positionBar)
						option.positionBar.removeClass(option.selectedClass).eq(index).addClass(option.selectedClass);
					play(index, isAuto ? currentIndex : -1);
					currentIndex = index;
					timer = setTimeout(function ()
					{
						index = (index + 1) % itemsLength;
						action(index, true);
					}, option.interval);
				}

				var isstop = false;
				var result = {
					play: function (index)
					{
						action(index, false);
						return this;
					}, stop: function ()
					{
						isstop = true;
						clearTimeout(timer);
						return this;
					}, 'continue': function ()
					{
						if (isstop)
						{
							action((currentIndex + 1) % itemsLength, true);
							isstop = false;
						}
						return this;
					}, playprev: function ()
					{
						action((currentIndex + itemsLength - 1) % itemsLength, true);
						return this;
					}, playnext: function ()
					{
						action((currentIndex + 1) % itemsLength, true);
						return this;
					}
				};
				
				if (itemsLength < 2)
				{
					if (option.positionBar)
						option.positionBar = $(option.positionBar);
					action(0, true);
					clearTimeout(timer);
					return false;
				}
				else
				{
					if (option.positionBar)
						option.positionBar = $(option.positionBar).each(function (index, bar)
						{
							$(bar).bind(option.playEventType, function ()
							{
								action(index, false);
							});
						});
					if (option.prevButton)
						option.prevButton = $(option.prevButton).click(function ()
						{
							result.playprev();
						});
					if (option.nextButton)
						option.nextButton = $(option.nextButton).click(function ()
						{
							result.playnext();
						});

					action(0, true);
				}

				return result;
			}
		};
	})();

	Ebdoor.Security = (function ()
	{
		var base64Key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var sAscii = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
		/* convert integer to hex string */
		var sHex = "0123456789ABCDEF";
		function hex(i)
		{
			h = "";
			for (j = 0; j <= 3; j++)
			{
				h += sHex.charAt((i >> (j * 8 + 4)) & 0x0F) +
				sHex.charAt((i >> (j * 8)) & 0x0F);
			}
			return h;
		}

		/* add, handling overflows correctly */
		function add(x, y)
		{
			return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
		}

		/* MD5 rounds functions */
		function R1(A, B, C, D, X, S, T)
		{
			q = add(add(A, (B & C) | (~B & D)), add(X, T));
			return add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		}
		function R2(A, B, C, D, X, S, T)
		{
			q = add(add(A, (B & D) | (C & ~D)), add(X, T));
			return add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		}
		function R3(A, B, C, D, X, S, T)
		{
			q = add(add(A, B ^ C ^ D), add(X, T));
			return add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		}
		function R4(A, B, C, D, X, S, T)
		{
			q = add(add(A, C ^ (B | ~D)), add(X, T));
			return add((q << S) | ((q >> (32 - S)) & (Math.pow(2, S) - 1)), B);
		}
		return {
			EncodeToBase64: function (input)
			{
				/// <summary>
				/// 将输入对象编码为base64
				/// </summary>
				/// <param name="input" type="String">输入字符串</param>
				/// <returns type="String" />
				if (!input || typeof (input) !== "string")
					return "";
				input = escape(input + "");
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;
				do
				{
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2))
					{
						enc3 = enc4 = 64;
					}
					else if (isNaN(chr3))
					{
						enc4 = 64;
					}
					output = output + base64Key.charAt(enc1) + base64Key.charAt(enc2) + base64Key.charAt(enc3) + base64Key.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);
				return output;
			},
			DecodeBase64: function (input)
			{
				/// <summary>
				/// 将输入Base64字符串解码
				/// </summary>
				/// <param name="input" type="String">输入的Base64字符串</param>
				/// <returns type="String" />
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input))
				{
					throw new Error("输入字符串中包含无效字符，输入字符串中只能包含“A-Z”、“a-z”、“0-9”、“+”、“/”和“=”");
				}
				do
				{
					enc1 = base64Key.indexOf(input.charAt(i++));
					enc2 = base64Key.indexOf(input.charAt(i++));
					enc3 = base64Key.indexOf(input.charAt(i++));
					enc4 = base64Key.indexOf(input.charAt(i++));
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					output = output + String.fromCharCode(chr1);
					if (enc3 != 64)
					{
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64)
					{
						output = output + String.fromCharCode(chr3);
					}
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				}
				while (i < input.length);

				return unescape(output);
			},
			ComputeMD5: function (inputString)
			{
				/// <summary>
				/// 计算输入字符串的MD5值
				/// </summary>
				/// <param name="inputString" type="String">输入的Base64字符串</param>
				/// <returns type="String" />
				/* Calculate length in machine words, including padding */
				var wLen = (((inputString.length + 8) >> 6) + 1) << 4;
				var X = new Array(wLen);

				/* Convert string to array of words */
				var j = 4, i;
				for (i = 0; (i * 4) < inputString.length; i++)
				{
					X[i] = 0;
					for (j = 0; (j < 4) && ((j + i * 4) < inputString.length) ; j++)
					{
						X[i] += (sAscii.indexOf(inputString.charAt((i * 4) + j)) + 32) << (j * 8);
					}
				}

				/* Append padding bits and length */
				if (j == 4)
				{
					X[i++] = 0x80;
				}
				else
				{
					X[i - 1] += 0x80 << (j * 8);
				}
				for (; i < wLen; i++)
				{
					X[i] = 0;
				}
				X[wLen - 2] = inputString.length * 8;

				/* hard-coded initial values */
				a = 0x67452301;
				b = 0xefcdab89;
				c = 0x98badcfe;
				d = 0x10325476;

				/* Process each 16-word block in turn */
				for (i = 0; i < wLen; i += 16)
				{
					aO = a;
					bO = b;
					cO = c;
					dO = d;

					a = R1(a, b, c, d, X[i + 0], 7, 0xd76aa478);
					d = R1(d, a, b, c, X[i + 1], 12, 0xe8c7b756);
					c = R1(c, d, a, b, X[i + 2], 17, 0x242070db);
					b = R1(b, c, d, a, X[i + 3], 22, 0xc1bdceee);
					a = R1(a, b, c, d, X[i + 4], 7, 0xf57c0faf);
					d = R1(d, a, b, c, X[i + 5], 12, 0x4787c62a);
					c = R1(c, d, a, b, X[i + 6], 17, 0xa8304613);
					b = R1(b, c, d, a, X[i + 7], 22, 0xfd469501);
					a = R1(a, b, c, d, X[i + 8], 7, 0x698098d8);
					d = R1(d, a, b, c, X[i + 9], 12, 0x8b44f7af);
					c = R1(c, d, a, b, X[i + 10], 17, 0xffff5bb1);
					b = R1(b, c, d, a, X[i + 11], 22, 0x895cd7be);
					a = R1(a, b, c, d, X[i + 12], 7, 0x6b901122);
					d = R1(d, a, b, c, X[i + 13], 12, 0xfd987193);
					c = R1(c, d, a, b, X[i + 14], 17, 0xa679438e);
					b = R1(b, c, d, a, X[i + 15], 22, 0x49b40821);

					a = R2(a, b, c, d, X[i + 1], 5, 0xf61e2562);
					d = R2(d, a, b, c, X[i + 6], 9, 0xc040b340);
					c = R2(c, d, a, b, X[i + 11], 14, 0x265e5a51);
					b = R2(b, c, d, a, X[i + 0], 20, 0xe9b6c7aa);
					a = R2(a, b, c, d, X[i + 5], 5, 0xd62f105d);
					d = R2(d, a, b, c, X[i + 10], 9, 0x2441453);
					c = R2(c, d, a, b, X[i + 15], 14, 0xd8a1e681);
					b = R2(b, c, d, a, X[i + 4], 20, 0xe7d3fbc8);
					a = R2(a, b, c, d, X[i + 9], 5, 0x21e1cde6);
					d = R2(d, a, b, c, X[i + 14], 9, 0xc33707d6);
					c = R2(c, d, a, b, X[i + 3], 14, 0xf4d50d87);
					b = R2(b, c, d, a, X[i + 8], 20, 0x455a14ed);
					a = R2(a, b, c, d, X[i + 13], 5, 0xa9e3e905);
					d = R2(d, a, b, c, X[i + 2], 9, 0xfcefa3f8);
					c = R2(c, d, a, b, X[i + 7], 14, 0x676f02d9);
					b = R2(b, c, d, a, X[i + 12], 20, 0x8d2a4c8a);

					a = R3(a, b, c, d, X[i + 5], 4, 0xfffa3942);
					d = R3(d, a, b, c, X[i + 8], 11, 0x8771f681);
					c = R3(c, d, a, b, X[i + 11], 16, 0x6d9d6122);
					b = R3(b, c, d, a, X[i + 14], 23, 0xfde5380c);
					a = R3(a, b, c, d, X[i + 1], 4, 0xa4beea44);
					d = R3(d, a, b, c, X[i + 4], 11, 0x4bdecfa9);
					c = R3(c, d, a, b, X[i + 7], 16, 0xf6bb4b60);
					b = R3(b, c, d, a, X[i + 10], 23, 0xbebfbc70);
					a = R3(a, b, c, d, X[i + 13], 4, 0x289b7ec6);
					d = R3(d, a, b, c, X[i + 0], 11, 0xeaa127fa);
					c = R3(c, d, a, b, X[i + 3], 16, 0xd4ef3085);
					b = R3(b, c, d, a, X[i + 6], 23, 0x4881d05);
					a = R3(a, b, c, d, X[i + 9], 4, 0xd9d4d039);
					d = R3(d, a, b, c, X[i + 12], 11, 0xe6db99e5);
					c = R3(c, d, a, b, X[i + 15], 16, 0x1fa27cf8);
					b = R3(b, c, d, a, X[i + 2], 23, 0xc4ac5665);

					a = R4(a, b, c, d, X[i + 0], 6, 0xf4292244);
					d = R4(d, a, b, c, X[i + 7], 10, 0x432aff97);
					c = R4(c, d, a, b, X[i + 14], 15, 0xab9423a7);
					b = R4(b, c, d, a, X[i + 5], 21, 0xfc93a039);
					a = R4(a, b, c, d, X[i + 12], 6, 0x655b59c3);
					d = R4(d, a, b, c, X[i + 3], 10, 0x8f0ccc92);
					c = R4(c, d, a, b, X[i + 10], 15, 0xffeff47d);
					b = R4(b, c, d, a, X[i + 1], 21, 0x85845dd1);
					a = R4(a, b, c, d, X[i + 8], 6, 0x6fa87e4f);
					d = R4(d, a, b, c, X[i + 15], 10, 0xfe2ce6e0);
					c = R4(c, d, a, b, X[i + 6], 15, 0xa3014314);
					b = R4(b, c, d, a, X[i + 13], 21, 0x4e0811a1);
					a = R4(a, b, c, d, X[i + 4], 6, 0xf7537e82);
					d = R4(d, a, b, c, X[i + 11], 10, 0xbd3af235);
					c = R4(c, d, a, b, X[i + 2], 15, 0x2ad7d2bb);
					b = R4(b, c, d, a, X[i + 9], 21, 0xeb86d391);

					a = add(a, aO);
					b = add(b, bO);
					c = add(c, cO);
					d = add(d, dO);
				}
				return hex(a) + hex(b) + hex(c) + hex(d);
			},
			ComputeSHA1: function (msg)
			{
				function rotate_left(n, s)
				{
					var t4 = (n << s) | (n >>> (32 - s));
					return t4;
				};
				function lsb_hex(val)
				{
					var str = "";
					var i;
					var vh;
					var vl;
					for (i = 0; i <= 6; i += 2)
					{
						vh = (val >>> (i * 4 + 4)) & 0x0f;
						vl = (val >>> (i * 4)) & 0x0f;
						str += vh.toString(16) + vl.toString(16);
					}
					return str;
				};
				function cvt_hex(val)
				{
					var str = "";
					var i;
					var v;
					for (i = 7; i >= 0; i--)
					{
						v = (val >>> (i * 4)) & 0x0f;
						str += v.toString(16);
					}
					return str;
				};
				function Utf8Encode(string)
				{
					string = string.replace(/\r\n/g, "\n");
					var utftext = "";
					for (var n = 0; n < string.length; n++)
					{
						var c = string.charCodeAt(n);
						if (c < 128)
						{
							utftext += String.fromCharCode(c);
						}
						else if ((c > 127) && (c < 2048))
						{
							utftext += String.fromCharCode((c >> 6) | 192);
							utftext += String.fromCharCode((c & 63) | 128);
						}
						else
						{
							utftext += String.fromCharCode((c >> 12) | 224);
							utftext += String.fromCharCode(((c >> 6) & 63) | 128);
							utftext += String.fromCharCode((c & 63) | 128);
						}
					}
					return utftext;
				};
				var blockstart;
				var i, j;
				var W = new Array(80);
				var H0 = 0x67452301;
				var H1 = 0xEFCDAB89;
				var H2 = 0x98BADCFE;
				var H3 = 0x10325476;
				var H4 = 0xC3D2E1F0;
				var A, B, C, D, E;
				var temp;
				msg = Utf8Encode(msg);
				var msg_len = msg.length;
				var word_array = new Array();
				for (i = 0; i < msg_len - 3; i += 4)
				{
					j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
					msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
					word_array.push(j);
				}
				switch (msg_len % 4)
				{
					case 0:
						i = 0x080000000;
						break;
					case 1:
						i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
						break;
					case 2:
						i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
						break;
					case 3:
						i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
						break;
				}
				word_array.push(i);
				while ((word_array.length % 16) != 14) word_array.push(0);
				word_array.push(msg_len >>> 29);
				word_array.push((msg_len << 3) & 0x0ffffffff);
				for (blockstart = 0; blockstart < word_array.length; blockstart += 16)
				{
					for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
					for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
					A = H0;
					B = H1;
					C = H2;
					D = H3;
					E = H4;
					for (i = 0; i <= 19; i++)
					{
						temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
						E = D;
						D = C;
						C = rotate_left(B, 30);
						B = A;
						A = temp;
					}
					for (i = 20; i <= 39; i++)
					{
						temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
						E = D;
						D = C;
						C = rotate_left(B, 30);
						B = A;
						A = temp;
					}
					for (i = 40; i <= 59; i++)
					{
						temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
						E = D;
						D = C;
						C = rotate_left(B, 30);
						B = A;
						A = temp;
					}
					for (i = 60; i <= 79; i++)
					{
						temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
						E = D;
						D = C;
						C = rotate_left(B, 30);
						B = A;
						A = temp;
					}
					H0 = (H0 + A) & 0x0ffffffff;
					H1 = (H1 + B) & 0x0ffffffff;
					H2 = (H2 + C) & 0x0ffffffff;
					H3 = (H3 + D) & 0x0ffffffff;
					H4 = (H4 + E) & 0x0ffffffff;
				}
				var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
				return temp.toUpperCase();
			}
		}
	})();

	Ebdoor.BizCounter = (function ()
	{
		return {
			GetBizClickUrl: function (relElement, memberPKId)
			{
				return Ebdoor.Domain.BizCounter + "/BizClick.ashx?relElement=" + encodeURIComponent(relElement) + "&memberPKId=" + encodeURIComponent(memberPKId);
			},
			CountBiz: function (relElement, memberPKId)
			{
				new Image().src = BizCounter.GetBizClickUrl(relElement, memberPKId);
			}
		};
	})();

	Ebdoor.TraceLog = (function ()
	{
		var site = Ebdoor.Domain.Www;
		return {
			BrowseProduct: function (id)
			{
				new Image().src = site + "/Product/ProductBrowseCounter.aspx?ProductPKId=" + id;
			},
			BrowseProductMeterial: function (id)
			{
				new Image().src = site + "/Product/ProductMaterial/ProductMaterialBrowseCounter.aspx?MaterialPKId=" + id;
			},
			BrowseProductReport: function (id)
			{
				new Image().src = site + "/Product/ProductReport/ProductReportBrowseCounter.aspx?ReportPKId=" + id;
			},
			BrowseProductCommerce: function (id)
			{
				new Image().src = site + "/Product/CommerceInfo/CommerceBrowseCounter.aspx?CommerceInfoPKId=" + id;
			},
			BrowseProductSubject: function (id)
			{
				new Image().src = site + "/Product/ReportSubject/ReportSubjectBrowseCounter.aspx?SubjectPKId=" + id;
			}
		}
	})();
	return Ebdoor;
})(window.jQuery);