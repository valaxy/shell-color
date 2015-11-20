var sgrHelp = require('./sgr-help')

// tip: when you add groups, the groups will also show in split array
var ESCAPE_CODE_REG = /\x1b\[(?:(\d+)(?:;(\d+))*)?m/
var ESCAPE_CODE_REG_MUL = /\x1b\[(?:\d+(?:;\d+)*)?m/g
var ESCAPE_CODE_REG_FOR_SPLIT2 = /(\x1b\[(?:\d+(?:;\d+)*)?m)/g

// color
var DEFAULT_FOREGROUND_COLOR = 'white'
var DEFAULT_BACKGROUND_COLOR = 'black'

/**
 * Create a new ShellColor instance
 * @class ShellColor
 * @paras options
 *      colorMap:           a color map
 *      lineFeedTransform: 'keep' | 'brTag'(default) | 'blockTag'
 *      lineFeedBlockTag:   default is 'p', useful only if lineFeedTransform == 'blockTag'
 *      textInlineTag:      default is 'span'
 */
var ShellColor = function (options) {
	options = options || {}
	options.colorMap = options.colorMap || {}
	options.defaultForegroundColor = options.defaultForegroundColor || DEFAULT_FOREGROUND_COLOR
	options.defaultBackgroundColor = options.defaultBackgroundColor || DEFAULT_BACKGROUND_COLOR
	options.lineFeedTransform = options.lineFeedTransform || 'brTag'
	this._help = sgrHelp(options)
	this.reset()
}


var consumeCodes = function (help, sgr, escapeMatch) {
	if (escapeMatch.length == 3 && escapeMatch[1] == undefined && escapeMatch[2] == undefined) {
		return help.consumeSGR(0, sgr) // default
	}

	// escapeMatch[0] == total string
	for (var i = 1; i < escapeMatch.length; i++) {
		var code = Number(escapeMatch[i])
		help.consumeSGR(code, sgr)
	}
}

ShellColor.prototype._transformText_keep = function () {

}

ShellColor.prototype._transformText_brTag = function () {

}

ShellColor.prototype._transformText_blockTag = function () {

}

/**
 * Convert string which has style info to html tags.
 * @param str - a string which has style info about styles
 * @returns {Array} html tags include text, tag is used for hold styles
 */
ShellColor.prototype.convertToHTMLTags = function (str) {
	// distinguish text and ansi escape code
	var blocks = str.split(ESCAPE_CODE_REG_FOR_SPLIT2)

	var tags = []
	for (var i = 0; i < blocks.length; i++) {
		var s = blocks[i]

		var escapeMatch = s.match(ESCAPE_CODE_REG)
		if (escapeMatch) { // ansi escape code
			consumeCodes(this._help, this._sgr, escapeMatch)
		} else {           // normal text
			var span = this._help.createTagBySGR(this._sgr)
			span.innerText = s
			tags.push(span)
		}
	}

	return tags
}


/**
 * Convert string which has style info to html.
 * @memberof! ShellColor
 * @param {string} str - a string which has style info about styles
 * @returns {string} converted HTML
 */
ShellColor.prototype.convertToHTML = function (str) {
	var tags = this.convertToHTMLTags(str)
	var html = ''
	tags.forEach(function (tag) {
		html += tag.outerHTML
	})
	return html
}


/**
 * Eliminate the ansi escape code in the string.
 * @memberof! ShellColor
 * @param {string} str - a string with ansi escape code
 * @returns {string} returns the text without ansi escape code
 */
ShellColor.prototype.strip = function (str) {
	return str.replace(ESCAPE_CODE_REG_MUL, '')
}


/**
 * Reset SGR parameters
 */
ShellColor.prototype.reset = function () {
	this._sgr = this._help.getDefaultSGR()
}

module.exports = ShellColor


//var encodeStr = function (str) {
//	var s = ''
//	for (var i = 0; i < str.length; i++) {
//		s += '&#' + str.charCodeAt(i) + ';'
//	}
//	return s
//}