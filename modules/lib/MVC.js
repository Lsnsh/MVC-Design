// 使用一个闭包将MVC模块包裹
(function(window)
	{
		// 将模型、视图、控制器绑定到MVC命名空间内
		var MVC = {};

		// 定义模型容器
		var M = {};
		/**
		 * 模型模块
		 * 获取数据 get(str) = > return result => str对应的模型数据
		 * 添加数据 set(key,value) = > return this => MVC，便于链式调用
		 */
		MVC.Model = {
			/**
			 * 读取数据的方法
			 * @str		读取数据的路径
			 * 
			 * 如：M = {a:{b:{c:{d:666}}}};
			 * 		MVC.M.get('a.b.c.d'); ==>666
			 */
			get:function(str)
			{
				// 解析路径
				var path = str
					// 如果路径以M.或者.开头，将其替换成''
					.replace(/^M\.|^\./,'')
					// 根据.将字符串分隔
					.split('.');

				// 初始化结果
				var result = M;

				// ['a','b','c']从左到右依次读取
				// 读取结果为undefined/null/非对象时
				// return null;=>终止方法执行
				// 最后一项不做判断，直接读取
				// 遍历数组
				for(var i = 0; i < path.length; i++)
				{
					/*if(result[path[i]] === undefined || result[path[i]] === null || typeof result[path[i]] !== 'object')
					{
						// 终止执行
						return null;
					}*/
					if(result[path[i]] === undefined)
					{
						return null;
					}
					// 更新要读取的内容
					result = result[path[i]];
				}

				// 读取最后一项
				// result = result[path[i]] === undefined ? null : result[path[i]];

				// 返回读取结果
				return result;
			},
			set:function(key,value)
			{
				// 解析路径
				var path = key
					// 如果路径以M.或者.开头，将其替换成''
					.replace(/^M\.|^\./,'')
					// 根据.将字符串分隔
					.split('.');

				// 初始化结果
				var result = M;

				// 遍历添加
				for(var i = 0; i < path.length - 1; i++)
				{
					// 当对象存在且为值类型时，抛出异常，值类型数据不能添加属性
					if((result[path[i]] !== undefined && typeof result[path[i]] !== 'object') || result[path[i]] === null)
					{
						// 终止执行
						throw new Error(typeof result[path[i]] + '类型的数据，不能添加属性，值是:' + result[path[i]])
					}
					// 如果写入的项不存在，赋值为空对象
					if(result[path[i]] === undefined)
					{
						result[path[i]] = {};
					}

					// 更新要写入的对象
					result = result[path[i]]
				}

				// 赋值
				result[path[i]] = value;
				return this;
			}
		};

		// 定义视图容器
		var V = {};
		/**
		 * 视图模块
		 * add(id, fn) => return this;
		 * render(id) => return dom;
		 */
		MVC.View = {
			/**
			 * 添加视图方法
			 * @id		视图的id
			 * @fn 		视图的创建函数
			 * return 	this
			 */
			add: function (id, fn)
			{
				//存储视图创建方法
				V[id] = fn;
				// 返回当前对象
				return this;
			},
			/**
			 * 执行视图创建方法
			 * @id		视图的id
			 * return 	dom =>视图创建的元素
			 */
			render: function (id)
			{
				// 判断指定id的视图创建函数是否存在
				if(V[id])
				{

					// 执行视图的创建函数
					// 更改执行时作用域为MVC
					// 并且传递模型对象和格式化模板方法
					var dom = V[id].call(MVC,MVC.Model,MVC.tempFormat);

					// 返回dom元素
					return dom;
				}
				
			}
		};

		// 定义控制器容器
		var C = {};
		/**
		 * 控制器模块
		 * add(id, fn) => return this;
		 * init()
		 */
		MVC.Controller = {
			/**
			 * 添加控制器
			 * @id		控制器的id
			 * @fn 		控制器的方法
			 */
			add: function (id, fn)
			{
				// 存储控制器方法
				C[id] = fn;
				// 链式第爱用返回this
				return this;
			},
			/**
			 * 初始化所有控制器方法
			 * 
			 */
			init: function ()
			{
				for(var k in C)
				{
					C[k].call(MVC, MVC.Model, MVC.View, MVC.Observer);
				}
			}
		};

		/**
		 * 格式化模板的方法
		 * @str		模板字符串
		 * @data 	模板数据
		 * return	格式化后的模板字符串
		 */
		MVC.tempFormat = function (str,data)
		{
			//使用替换字符串方法
			//() [] {} ^ $ ? . / - + *
			// return str.replace(/\{#(\w+)#\}/g,function(match,$1)
			return str.replace(/\{#([\w\.]+)#\}/g,function(match,$1)
			{
				var result = data;
				// 第一步，使用split()将$1分隔成数组
				var path = $1.split('.');
				// 第二部，遍历数组，获取数据
				for(var i = 0; i < path.length; i++)
				{
					// 判断数据是否存在
					if(undefined === result[path[i]])
					{
						return '';
					}
					result = result[path[i]];
				}
				//返回数据
				// return data[$1];
				return result;
			});
		}

		// 定义消息队列对象，存储消息回调函数
		var _message = {};
		/**
		 * 观察者模式
		 * regist(type, fn)
		 * fire(type, obj)
		 * remove(type, fn)
		 */
		MVC.Observer = {
			/**
			 * 注册消息
			 * @type 消息名称
			 * @fn   回调函数
			 */
			regist:function(type, fn)
			{
				// 判断__message中
				// 是否有指定type的回调函数
				if(_message[type])
				{
					// 有则直接添加
					_message[type].push(fn);
				}
				else
				{
					// 创建指定对象数组后再存储
					_message[type] = [fn];
				}
			},
			/**
			 * 触发消息
			 * @type 消息名称
			 * @data 传递参数
			 */
			 fire:function(type, obj)
			 {
			 	//适配参数
			 	var params = {
			 		context: (obj && obj.context) || null,
			 		args: (obj && obj.args) || []
			 	}
			 	// 将type追加到args头部
			 	params.args.unshift(type);

			 	// 在消息管道中寻找是否有指定类型的回调函数
			 	if(_message[type])
			 	{
			 		for(var v of _message[type])
			 		{
			 			// 遍历执行，并且往回调函数中传递参数
			 			// apply()=>执行时改变作用域和传递参数
			 			// 参数为数组形式
			 			v.apply(params.context,params.args);
			 		}
			 	}
			 },
			 /**
			  * 注销消息
			  * @type 消息名称
			  * @fn   要注销的回调函数
			  */
			 remove:function(type, fn)
			 {
			 	// 判断指定消息是否存在
			 	if(_message[type])
			 	{
			 		// 遍历对应消息数组，找到指定fn将其移除
			 		// 从后往前遍历，因为遍历删除过程中，将某一项删除后，不会影响前面的数组，继而可以正常遍历。
			 		
			 		// 如果从前往后遍历，中途删除某一项后，会导致之后的项索引值改变，继续遍历可能会出现问题
			 		for(var i = _message[type].length - 1; i >= 0; i--)
			 		{
			 			// 判断每一项，是否是我们要移除的fn
			 			if(_message[type][i] === fn)
			 			{
			 				// 使用数组的splice将fn移除
			 				_message[type].splice(i,1);
			 			}
			 		}
			 	}
			 }
		};

		// 优化对模型、视图、控制器方法的操作
		// 优化添加模型的方法
		MVC.addModel = function(id, data)
		{
			// 调用MVC.Model.set
			MVC.Model.set(id, data);
			// 返回this链式调用
			return this;
		}
		// 优化添加视图的方法
		MVC.addView = function(id, fn)
		{
			// 调用MVC.View.add
			MVC.View.add(id, fn);
			// 返回this链式调用
			return this;
		}
		// 优化添加控制器的方法
		MVC.addCtrl = function(id, fn)
		{
			// 调用MVC.Controller.add
			MVC.Controller.add(id, fn);
			// 返回this链式调用
			return this;
		}
		// 封装install方法，页面加载完毕后初始化所有控制器
		MVC.install = function()
		{
			$(function()
				{
					MVC.Controller.init();
				});
		}

		
		// 在window上注册
		window.MVC = MVC;
})(window)


