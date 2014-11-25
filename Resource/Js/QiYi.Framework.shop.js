window.QiYi = window.QiYi || (function ($)
{
	
	(function ()
	{
		//jQuery扩展

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
	})();
	return QiYi;
})(window.jQuery);