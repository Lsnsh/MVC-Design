/*
	home模块-->子模块：descpt
		描述模块
		订阅消息名称:homeDataComplete
 */
define(function(require, exports, module) {
	// 引入样式文件
	require('home/descpt.css');

	MVC
	// 添加视图
	.addView('descpt', function(model, tempFormat) {
		// 获取元素
		var dom = $('#container > .descpt');
		// 获取数据
		var data = model.get('home.descpt');

		// 定义格式化模板字符串
		var temp = [
			'<h2 class="title">{#title#}</h2>',
			'<p class="content">{#content#}</p>',
			'<ul class="list">{#listUl#}</ul>',
			'{#divs#}',
			'<div class="clear"></div>',
			'<div class="hr1"></div>'
		].join('');
		// list子模板字符串
		var listTemp = '<li class="list-item">{#msg#}</li>';
		var divTemp = [
			'<div class="intro {#last#}">',
				'<img src="imgs/descpt/{#img#}" alt="" />',
				'<h4 class="title">{#tit#}</h4>',
				'<p class="content">{#cnt#}</p>',
			'</div>'
		].join('');

		// 定义html字符串
		var html = listHtml = divHtml = '';
		//格式化list子模板字符串
		data.list.forEach(function(value, index) {
			listHtml += tempFormat(listTemp, {
				msg: value
			});
		});
		// 格式化div模板字符串
		data.intro.forEach(function(obj, index) {
			divHtml += tempFormat(divTemp, {
				last: index === 3 ? 'last' : '',
				img: obj.img,
				tit: obj.title,
				cnt: obj.content
			});
		});
		// 格式化temp模板
		html = tempFormat(temp, {
			title: data.title,
			content: data.content,
			listUl: listHtml,
			divs: divHtml
		});

		// 渲染页面
		dom.html(html);
		// 返回dom
		return dom;
	})
	// 添加控制器
	.addCtrl('descpt', function(model, view, observer) {
		// 初始化方法
		var init = function() {
			// 渲染视图
			view.render('descpt');
		}

		// 订阅消息
		observer.regist('homeDataComplete', function(){
			init();
		});
	});
});