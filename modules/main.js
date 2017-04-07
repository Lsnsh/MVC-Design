/*
	主模块
		背景模块
			bg/bg.js
 */
define(function (require, exports, module) {
	
	// 引入背景模块
	require('bg/bg');

	// 引入头部模块
	require('header/header');

	// 引入主体模块
	require('home/home');

	// 引入脚部模块
	require('footer/footer');

	// 初始化MVC
	module.exports = function () {
		MVC.install();
	}
});