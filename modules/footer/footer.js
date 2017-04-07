/*
	footer模块
	底部信息模块
	订阅消息名称:footerDataComplete
 */
define(function(require) {
	// 引入样式文件
	require('footer/footer.css');
	require('footer/copyright');

	MVC
	// 添加视图
	.addView('footer', function(model, tempFormat) {
		// 获取元素
		var dom = $('#footer');
		// 获取数据
		var data = model.get('footer');

		// 定义格式化模板字符串
		var temp = [
			'<div class="hr2"></div>',
			'<div class="posts">',
				'<h3>{#title1#}</h3>',
				'<ul class="postsList">{#postsUl#}</ul>',
			'</div>',
			'<div class="flickr">',
				'<h3>{#title2#}</h3>',
				'<ul class="flickrList">{#flickrUl#}</ul>',
			'</div>',
			'<div class="about">',
				'<h3>{#title3#}</h3>',
				'<p>{#msg1#}</p>',
				'<br />',
				'<p>{#msg2#}</p>',
			'</div>',
			'<div class="git last">',
				'<h3>{#title4#}</h3>',
				'<input type="text" name="name" /> Name*',
				'<input type="text" name="email" /> Email*',
				'<textarea name="" id="" cols="30" rows="10"></textarea>',
				'<input type="submit" value="submit" />',
			'</div>'
		].join('');
		// posts模板字符串
		var postsTemp = [
			'<li class="posts-item {#cls#}">',
				'<span>',
					'<em class="day">{#day#}</em>',
					'<em class="month">{#month#}</em>',
				'</span>',
				'<a href="">{#content#}</a>',
			'</li>'
		].join('');
		// flickr模板字符串
		var flickrTemp = [
			'<li class="flickr-item">',
				'<a href="javascript:void();">',
					'<img src="imgs/footer/{#src#}" alt="" />',
				'</a>',
			'</li>'
		].join('');

		// 定义html字符串
		var html = postsHtml = flickrHtml = '';
		// 格式化posts模板字符串
		data.posts.list.forEach(function(obj, index) {
			postsHtml += tempFormat(postsTemp, {
				cls: index === 0 ? 'first' : '',
				day: obj.day,
				month: obj.month,
				content: obj.content
			});
		});
		// 格式化filckr模板字符串
		data.img.list.forEach(function(value, index) {
			flickrHtml += tempFormat(flickrTemp, {
				src: value
			});
		});

		html = tempFormat(temp, {
			title1: data.posts.title,
			title2: data.img.title,
			title3: data.about.title,
			title4: data.touch.title,
			postsUl: postsHtml,
			flickrUl: flickrHtml,
			msg1: data.about.list[0],
			msg2: data.about.list[1]
		});

		// 渲染页面
		dom.html(html);
		// 返回dom
		return dom;
	})
	// 添加控制器
	.addCtrl('footer', function(model, view, observer) {
		// 初始化方法
		var init = function() {
			// 渲染视图
			view.render('footer');

			// 发布消息，通知版权模块可以渲染了
			observer.fire('render');
		}

		// 异步请求数据
		// 原json文件-31行，数组多个逗号，导致获取失败
		$.get('data/footer.json',function(res) {
			if(res && res.errno === 0) {
				// 向模型存储数据
				model.set('footer', res.data);
				// 发布消息
				observer.fire('footerDataComplete');
			}
		});

		// 订阅消息
		observer.regist('footerDataComplete', function() {
			init();
		});

	});
});