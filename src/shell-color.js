define(function (require, exports) {

	// linux shell color format:
	//      [<backColor>;<fontColor>m<text>[m
	//
	// - <backColor> a number
	// - <fontColor> a number
	// - <text> string
	//
	// example:
	// - `[1;29m I love U [m`


	var COLOR_REG_MUL = /\[(\d+);(\d+)m(.*)\[m/g; // 1:背景颜色 2:字体颜色 3正文文本
	var COLOR_REG = /\[(\d+);(\d+)m(.*)\[m/;
	var COLOR_REG_FOR_SPLIT = /(\[\d+;\d+m.*\[m)/g;

	function getColor(code) {
		switch (code) {
			case 29: // @todo why 29???/
				return 'white';
			case 30:
				return 'black';
			case 31:
				return 'red';
			case 32:
				return 'green';
			case 33:
				return 'yellow';
			case 34:
				return 'blue';
			case 35:
				return '';
			case 36:
				return '';
			case 37:
				return 'white';
			default:
				return 'default';
		}
	}


	function encodeStr(str) {
		var s = '';
		for (var i = 0; i < str.length; i++) {
			s += '&#' + str.charCodeAt(i) + ';';
		}
		return s;
	}

	var ShellColor = function () {
		// nothing
	};


	/**
	 * eliminate the color info
	 * @param str
	 * @returns {XML|*|string|void}
	 */
	ShellColor.prototype.removeColorInfo = function (str) {
		return str.replace(COLOR_REG_MUL, function (match, backColor, fontColor, text) {
			return text;
		});
	};


	ShellColor.prototype.withColorMark = function (str) {
		return str.replace(COLOR_REG_MUL, function (match, backColor, fontColor, text) {
			return "<span style='color:" + getColor(Number(fontColor)) + "'>" + encodeStr(text) + "</span>"
		});
	};


	ShellColor.prototype.toHtmlWithColorMark = function (str) {
		// 把有颜色和没有颜色的字符串分别处理
		var strs = str.split(COLOR_REG_FOR_SPLIT);

		var finalStr = '';
		for (var i = 0; i < strs.length; i++) {
			var str = strs[i];
			if (str.match(COLOR_REG)) { // 带有颜色信息
				str = this.withColorMark(str);
			} else { // 正常的文本
				str = encodeStr(str);
			}
			finalStr += str;
		}

		// &#10; 是换行符
		finalStr = finalStr.replace(/&#10;/g, '<br/>');
		return finalStr;
	};

	return ShellColor;

});