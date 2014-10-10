define(function (require, exports) {
	var ShellColor = require('https://rawgit.com/valaxy/shell-color/master/src/shell-color.js');

	exports.init = function () {

		var str =
				"[1;31mchange line\nI'm new line[m\n" + // 文本中间有换行符
				"[1;33m<div>I'm a html tag</div>[m\n" + // 文本中间有html标签
				"normal text" // 普通文本
			;


		var sc = new ShellColor;
		var convertStr = sc.convertToHtml(str);
		$('.html').html(convertStr);

	}
});