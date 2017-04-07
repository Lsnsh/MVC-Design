/*
	home模块-->子模块：images
		最近动态模块
		订阅消息名称:homeDataComplete
 */
define(function(require, exports, module) {
	// 引入样式文件
	require('home/images.css');
	
	MVC
	// 添加视图
	.addView('images', function(model, tempFormat) {
		// 获取元素
		var dom = $('#container .images');
		// 获取数据
		var data = model.get('home.images');
		// 定义模板字符串
		var temp = [
			'<div class="scrollBtn">',
				'<span class="prev"></span>',
				'<span class="next"></span>',
			'</div>',
			'<h2>{#title#}</h2>',
			'<div class="imgsWrap">',
				'<ul class="latestImgs">{#imgList#}</ul>',
			'</div>'
		].join('');
		// 子模版字符串
		var liTemp = '<li class="latestImg-item"><img src="imgs/images/{#src#}" alt="" /></li>';
		// 定义html字符串
		var html = imgHtml = '';

		// 格式化子模板字符串
		data.list.forEach(function(value, index) {
				imgHtml += tempFormat(liTemp, {
					src:value
				});
			});

		// 格式化模板字符串
		html = tempFormat(temp, {
			title: data.title,
			imgList: imgHtml
		});

		// 渲染页面
		dom.html(html);

		// 返回dom
		return dom;
	})
	// 添加控制器
	.addCtrl('images', function(model, view, observer) {
		// 初始化方法
		var init = function() {
			// 渲染视图
			var dom = view.render('images');
			//获取元素
			var list = dom.find('.latestImgs');
			var lis = dom.find('.latestImgs li');

			var idx = 0;
			var lock = true;
			var timer = null;
			var rightEnd = false;
			var leftEnd = true;
			var len = lis.length;

			function toLeft() {
				if(!lock) {
					return ;
				}
				lock = false;

				idx --;
				if(idx < - (len - 5)) {
					leftEnd = true;
					idx = - (len - 5);
					console.log(1);
				}
				list.css({'left':idx * 184});

				setTimeout(function() {
						lock = true;
					}, 2000);
			}
			function toRigth() {
				if(!lock) {
					return ;
				}
				lock = false;

				if(idx < 0) {
					idx ++;
				}
				else {
					leftEnd = false;
					rightEnd = true;
				}
				
				list.css({'left':idx * 184});

				setTimeout(function() {
						lock = true;
					}, 2000);
			}
			function autoPlay() {
				// 自动轮播
				timer = setInterval(function() {
					if (leftEnd)
					{
						toRigth();
					}
					else if (rightEnd)
					{
						toLeft();
					}
				}, 5000);
			}

			// 图片列表向左滚动
			dom.delegate('.scrollBtn .prev', 'click', function() {
				toLeft();
			})
			// 图片列表向右滚动
			.delegate('.scrollBtn .next', 'click', function() {
				toRigth();
			})
			// 鼠标悬停停止轮播，移出重新开始轮播
			.delegate('.latestImgs', 'mouseenter', function() {
				clearInterval(timer);
			})
			.delegate('.latestImgs', 'mouseleave', function() {
				// 自动轮播
				autoPlay();
			})

			// 默认开启自动轮播
			autoPlay();
		}

		// 订阅消息
		observer.regist('homeDataComplete', function() {
				init();
			});
	});
});