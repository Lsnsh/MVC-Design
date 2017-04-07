/*
	footer模块
	版权信息模块
 */
define(function(require) {
	require('footer/copyright.css');
	
	MVC
	// 添加视图
	.addView('copyright', function(model, tempFormat) {
		// 获取元素
		var dom = $('#main');
		// 获取数据
		var data = {"copyright": "© 2011 Zeences Design. All Right Reserved."};
		// 定义格式化模板字符串
		var temp = '<div id="copyright" class="copyright"><p>{#copyright#}</p></div>';
		// 定义html字符串
		var html = '';
		// 格式化模板字符串
		html = tempFormat(temp, data);
		// 渲染页面
		dom.append(html);
		// 返回dom
		return dom;
	})
	// 添加控制器
	.addCtrl('copyright', function(model, view, observer) {
			function init() {
				// 渲染视图
				view.render('copyright');
			}

			// 订阅消息
			observer.regist('render', function() {
				init();
			});
		});
});