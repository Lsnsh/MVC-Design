/*
	在父模块控制器中，发送请求，将请求的结果存储，再通知子模块渲染
	1.将各模块的位置定义 - View
	2.发送请求，获取数据并存储 - 控制器
	3.广播消息，通知子模块渲染 - 控制器
 */
define(function(require, exports, module) {
	// 引入样式文件
	require('home/home.css');

	// 引入子模块
	require('home/banner');
	require('home/descpt');
	require('home/images');

	
	MVC
	.addView('home', function() {
		// 获取元素
		var dom = $('#container');
		// 定义模板字符串
		var temp = [
			// 轮播图
			'<div class="banner" id="banner"></div>',
			// 描述
			'<div class="descpt"></div>',
			// 细节轮播图
			'<div class="images"></div>'
		].join('');
		// 渲染模板
		dom.html(temp);
		// 返回元素
		return dom;
	})
	.addCtrl('home', function(model, view, observer) {
		// 渲染视图
		view.render('home');
		// 异步请求获取数据并存储
		$.get('data/home.json', function(res) {
			if (res && res.errno === 0) {
				// 存储数据
				model.set('home', res.data);
				// 广播消息，通知子模块渲染视图
				observer.fire('homeDataComplete');
			}
		});
	});
});