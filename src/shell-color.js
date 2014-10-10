define(function (require, exports) {

	var COLOR_REG_MUL = /\[(\d+);(\d+)m([\s\S]*)\[m/g; // 1:背景颜色 2:字体颜色 3正文文本
	var COLOR_REG = /\[(\d+);(\d+)m([\s\S]*)\[m/;
	var COLOR_REG_FOR_SPLIT = /(\[\d+;\d+m[\s\S]*\[m)/g;

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


	// create a new ShellColor instance.

	/**
	 * linux shell color format is: [`backColor`;`fontColor`m`text`[m <br/>
	 * `backColor` is a number <br/>
	 * `fontColor` is a number <br/>
	 * `text` is a string <br/>
	 * for example: [1;29m I love U [m` <br/>
	 * terms: color mark,
	 * @class ShellColor
	 */
	function ShellColor() {
		// nothing
	}


	/**
	 * eliminate the color mark in the string.
	 * @memberof! ShellColor
	 * @param {string} str - a string with linux shell color mark
	 * @returns {string} returns the text without linux shell color mark
	 */
	ShellColor.prototype.removeMark = function (str) {
		return str.replace(COLOR_REG_MUL, function (match, backColor, fontColor, text) {
			return text;
		});
	};


	/**
	 * convert color mark to html tag.
	 * @memberof! ShellColor
	 * @param {string} str - a string with linux shell color mark
	 * @returns {string} a string with html tag inserted, tags are used for display color
	 */
	ShellColor.prototype.convertMarkToTag = function (str) {
		return str.replace(COLOR_REG_MUL, function (match, backColor, fontColor, text) {
			return "<span style='color:" + getColor(Number(fontColor)) + "'>" + encodeStr(text) + "</span>"
		});
	};


	/**
	 * convert to html
	 * @memberof! ShellColor
	 * @param {string} str - a string with linux shell color mark
	 * @returns {string} a string has color tag and all the plan text are convert to html escape entity
	 */
	ShellColor.prototype.convertToHtml = function (str) {
		// 把有颜色和没有颜色的字符串分别处理
		var strs = str.split(COLOR_REG_FOR_SPLIT);

		var finalStr = '';
		for (var i = 0; i < strs.length; i++) {
			var str = strs[i];
			if (str.match(COLOR_REG)) { // 带有颜色信息
				str = this.convertMarkToTag(str);
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