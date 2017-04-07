/*
	home模块——>子模块：banner
		轮播图模块
		订阅消息名称:homeDataComplete
 */
define(function(require, exports, module) {
	// 引入banner.css
	require('./banner.css');

	MVC
	.addView('banner', function(model, tempFormat) {
		// 获取元素
		var dom = $('#banner');
		// 获取数据
		var data = model.get('home.banner');

		//定义模板字符串
		var temp = [
			'<ul class="banner-img" id="banner-img">{#bannerImgs#}</ul>',
			'<ul class="banner-btn"><li class="btn left"></li>{#bannerBtns#}<li class="btn right"></li></ul>',
			'<p>{#title#}</p>',
			'<div class="hr2"></div>'
		].join('');
		// 子模板
		var bannerImgsTemp = '<li class="{#show#}"><img src="imgs/banner/{#src#}.jpg" alt="" /><p class="intro">{#intro#}</p></li>';
		var bannerBtnsTemp = '<li class="{#show#}"></li>';

		// 定义视图结构字符串
		var html = imgsHtml = btnsHtml = '';
		// 格式化模板
		data.list.forEach(function(obj, index) {
			// 拼接图片组
			imgsHtml += tempFormat(bannerImgsTemp, {
				show: index === 0 ? 'show' : '',
				src: obj.src,
				intro: obj.intro
			});

			// 拼接按钮组
			btnsHtml += tempFormat(bannerBtnsTemp, {
				show:index === 0 ? 'show' : ''
			});
		});
		html = tempFormat(temp, {
			bannerImgs: imgsHtml,
			bannerBtns: btnsHtml,
			title: data.title
		});

		// 追加到页面中
		dom.html(html);
		// 返回dom
		return dom;
	})
	.addCtrl('banner', function(model, view, observer) {
		
		var init = function() {
			// 渲染页面
			var dom = view.render('banner');
			// 定义信号量
			var idx = 0;
			// 节流变量
			var lock = true;
			// 定时器变量
			var timer = null;
			
			// 获取轮播图图片组
			var imgLists = dom.find('.banner-img li');
			// 小圆点列表
			var btnLists = dom.find('.banner-btn li:not([class~="btn"])');
			
			btnLists.each(function (index, value) {
				this.idx = index;
				this.onclick = function() {
					idx = this.idx;
					// 改变展示的图片
					imgLists.eq(idx).addClass('show').siblings().removeClass('show');
					// 改变展示的小圆点
					btnLists.eq(idx).addClass('show').siblings().removeClass('show');
				}
			});


			var toRight = function() {
				// 节流
				if(!lock) {
					return ;
				}
				lock = false;

				// 改变信号量
				idx ++;
				// 越界重置
				if(idx > btnLists.length - 1) {
					idx = 0;
				}

				// 改变展示的图片
				imgLists.eq(idx).addClass('show').siblings().removeClass('show');
				// 改变展示的小圆点
				btnLists.eq(idx).addClass('show').siblings().removeClass('show');

				// 延迟解锁
				setTimeout(function() {
					lock = true;
				}, 1000);
			}
			var toLeft = function() {
				if(!lock) {
					return ;
				}
				lock = false;

				idx --;

				if(idx < 0) {
					idx = btnLists.length - 1;
				}

				// 改变展示的图片
				imgLists.eq(idx).addClass('show').siblings().removeClass('show');
				// 改变展示的小圆点
				btnLists.eq(idx).addClass('show').siblings().removeClass('show');

				setTimeout(function() {
					lock = true;
				}, 1000);
			}
			var autoPlay = function(){
				// 定时自动轮播
				timer = setInterval(function() {
					toRight();
				}, 5000);
			}
			var stop = function(){
				clearInterval(timer)
			}
			var start = function(){
				autoPlay();
			}

			// 鼠标进入图片时停止自动轮播
			dom.delegate('.banner-img', 'mouseenter', function() {
				stop();
			})
			// 鼠标移出图片时重新开始自动轮播
			.delegate('.banner-img', 'mouseleave', function() {
				start();
			})
			// 注册轮播图向右按钮事件
			.delegate('.right', 'click', function() {
				toRight();
			})
			// 轮播图向左按钮事件
			.delegate('.left', 'click', function() {
				toLeft();
			})
			// 左右按钮
			.delegate('.banner-btn', 'mouseenter', function() {
				stop();
			})
			.delegate('.banner-btn', 'mouseleave', function() {
				start();
			})

			// 默认开启自动轮播
			autoPlay();
		}

		// 订阅消息
		observer.regist('homeDataComplete', function ()
			{
				// 接收到消息后，初始化页面
				init();
			});
	});

});