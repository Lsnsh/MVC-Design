/*
	定义模型、视图、控制器
	消息name：headerDataComplete
*/
define(function(require, exports, module) {
	// 引入header.css
	require('header/header.css');
	
	MVC
	// 添加视图
	.addView('header', function(model,tempFormat) {
		// 获取元素
		var dom = $('#header');
		// 获取数据
		var data = model.get('header');

		// 定义模板字符串
		var temp = [
					'<div class="inner">',
						'<div class="logo-container">',
							'<img src="imgs/header/logo.png" alt="" />',
							'<ul>{#iconUl#}</ul>',
						'</div>',
						'<ul class="nav shadow">{#navUl#}</ul>',
					'</div>'].join('');
		var iconTemp = '<li><a href="{#href#}"><img src="imgs/header/{#img#}" alt="" /></a></li>';
		var navTemp = '<li class="{#cls#}"><a href="{#href#}">{#title#}</a>{#childList#}</li>';
		var childNavTemp = '<ul class="childList">{#childNavUl#}</ul>'

		var html = iconHtml = navHtml = childNavHtml = '';
		// 格式化图标
		data.icon.forEach(function(obj, index) {
			iconHtml += tempFormat(iconTemp, obj);
		});

		// 格式化导航栏
		data.nav.forEach(function(obj1, index1) {
				// 清空自导航栏格式化内容
				childNavHtml = '';
				// 判断是否有子列表
				if(obj1.list) {
					// 遍历子列表
					obj1.list.forEach(function(obj2, index2) {
						// 格式化子导航栏
						childNavHtml += tempFormat(navTemp, {
							cls:'child-nav-item',
							href:obj2.href,
							title:obj2.title,
							childList:''
						});
					});
					// 再次格式化子导航栏，添加ul标签
					childNavHtml = tempFormat(childNavTemp, {
						childNavUl:childNavHtml
					});
				}
				// 格式化一级导航栏
				navHtml += tempFormat(navTemp, {
					cls:'nav-item',
					href:obj1.href,
					title:obj1.title,
					childList:childNavHtml
				});
			});

		//格式化html
		html = tempFormat(temp, {
			iconUl:iconHtml,
			navUl:navHtml
		});

		// 渲染在页面中
		dom.html(html);
		// 返回dom元素
		return dom;
	})
	// 添加控制器
	.addCtrl('header', function(model, view, observer) {
		function init() {
			// 渲染视图
			var dom = view.render('header');

			// 鼠标移入，滚下列表
			dom.delegate('.nav-item', 'mouseenter', function (event) {
				$(this).find('ul').stop().slideDown(200);
			})
			// 鼠标移出，回滚列表
			.delegate('.nav-item', 'mouseleave', function (event) {
				$(this).find('ul').stop().slideUp(200);
			})
		}

		// 异步请求数据
		$.get('data/header.json', function (res)
			{
				if(res && res.errno === 0)
				{
					// 存储数据
					model.set('header', res.data);
					// 发送消息
					observer.fire('headerDataComplete');
				}
			});

		// 订阅消息
		observer.regist('headerDataComplete', function()
			{
				init();
			});
		
	});

});