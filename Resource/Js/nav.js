 //变美项目下拉
$(function() {
	$(".menu-list li").each(function(index){
		$(this).hover(function(){
			$(".menu-con .subview:eq("+ index +")").show().siblings().hide();
		},function(){
		$("..menu-con").hide();
		})
	})
	// var bBtn = false;
	// var bW=false;
	// var navW=0;
	
	// $('.category-menu').hover(function() {
		// $('.menu-List').queue(function(next) {
			// $(this).css({
				// 'display': 'block',
				// 'overflow':'hidden'
			// });
			// next();
		// }).animate({
			// 'height': '+=420px'
		// },
		// 300,
		// function() {
			// $('ul.menu-list-ul>li').each(function() {
				
				// $(this).hover(function() {
					
					// $(this).queue(function(next) {
						
						// var ins = $(this).index();
						// $(this).addClass('menuItemColor');

						// $('.subview').css({
							// 'width': 0,
							// 'display': 'none'
						// });
						
						// function toNavW(){
							// if (!bBtn) {
							// if(parseInt($('header').width())>=1190){
								// bW=true;
							// }else{
								// bW=false;
							// }
							
							// navW=bW?975:765;
							
							// $('.menu-con').addClass('box-shadow');
							// $('.menu-con').stop().css({
								// 'display': 'block'
							// }).animate({
								// 'width': navW
							// });
							// $('.subview').eq(ins).stop().css({
								// 'display': 'block'
								
							// }).animate({
								// 'width': navW
							// },
							// function() {
								// bBtn = true;
							// });
						// } else {
							// $('.subview').eq(ins).stop().css({
								// 'display': 'block'
							// }).animate({
								// 'width': navW
							// },
							// 0);
						// }
						// }
						// toNavW();
						// $(document).bind('ready',toNavW);
						// $(window).bind('resize',function(){
						    // $(document).unbind('ready',toNavW);
							// $(document).bind('ready',toNavW);
						// });						
						// next();
					// });

					// //$(this).find('h3,p a').css('color', '#fff');
				// },
				// function() {
					// $(this).removeClass('menuItemColor');
				// });

			// });

		// });

	// },
	// function() {
		// $(this).queue(function(next) {
			// bBtn = false;
			// // $(this).find('.menu-list').stop().css({
				// // 'height': 0,
				// // 'display': 'none'
			// // });
			// $('.subview').css({
				// 'width': 0,
				// 'display': 'none'
			// });
			// $('.menu-con').removeClass('box-shadow');
			// $('.menu-con').css({
				// 'width': 0,
				// 'display': 'none'
			// });
			// $('ul.menu-list_ul>li').each(function() {
				// $(this).removeClass('menuItemColor');
				// //$(this).find('h3').css('color', '#000');
				// //$(this).find('p a').css('color', '#888');
			// })

			// next();

		// });

	// });

});