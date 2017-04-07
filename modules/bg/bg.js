define(function(require, exports, module) {
	// 引入对应css文件
	require('bg/bg.css');

	// 模块包含M、V、C
	MVC.addModel('bg', {
		// 随机显示一张图片
		num: parseInt(Math.random() * 6),
		wholeNum: 6
	})
	// 添加视图
	.addView('bg', function(model, tempFormat) {
		// 视图七步走
		var dom = $('<div id="bg" class="bg"></div>');
		var data = model.get('bg');
		var temp = '<div class="bg-item item-{#item#} {#isShow#}"></div>';
		var html = '';

		for(var i = 0; i < data.wholeNum; i++) {
			html+= tempFormat(temp,
				{
					item: i,
					isShow: data.num === i ? 'show' : ''
				});
		}
		
		dom.html(html);
		// 将容器追加在body最前面
		dom.prependTo('body');
		// 返回dom
		return dom;
	})
	// 添加控制器
	.addCtrl('bg', function(model, view, observer) {
		// 渲染视图
		var dom = view.render('bg');
		// 获取图片总数
		var wholeNum = model.get('bg.wholeNum');
		// 随机切换背景
		setInterval(function() {
			// 随机一个数
			var num = parseInt(Math.random() * wholeNum);
			// 改变类
			dom
				// 找到所有图片元素
				.find('.bg-item')
				// 选中第num张图片
				.eq(num)
				// 添加类，显示
				.addClass('show')
				// 选择其他兄弟元素
				.siblings()
				// 移除类，隐藏
				.removeClass('show');
			// 更新模型中的数据
			model.set('bg.num', num);
		}, 15000);
	});

});