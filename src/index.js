define(function (require, exports, module) {

	var sgrHelp        = require('./sgr-help'),
	    EventEmitter   = require('wolfy87-eventemitter'),
	    BlockProcessor = require('./block-processor')


// tip: when you add groups, the groups will also show in split array
	var ESCAPE_CODE_REG = /\x1b\[(?:(\d+)(?:;(\d+))*)?m/
	var ESCAPE_CODE_REG_MUL = /\x1b\[(?:\d+(?:;\d+)*)?m/g
	var ESCAPE_CODE_REG_FOR_SPLIT2 = /(\x1b\[(?:\d+(?:;\d+)*)?m)/g

// color
	var DEFAULT_FOREGROUND_COLOR = 'white'
	var DEFAULT_BACKGROUND_COLOR = 'black'

	var createTagBySGR = function (tagName, sgr) {
		var colorMap = this._options.colorMap
		var tag = document.createElement(tagName)
		tag.style.color = getCssColor(sgr.color, colorMap)
		tag.style.background = getCssColor(sgr.background, colorMap)
		tag.style.fontWeight = sgr.bold ? 'weight' : 'normal'
		tag.style.fontStyle = sgr.italic ? 'italic' : 'normal'
		tag.style.textDecoration = sgr.underline ? 'underline' : ''
		tag.style.textDecoration += sgr.deletion ? ' line-through' : ''
		tag.style.textDecoration += sgr.overline ? ' overline' : ''
		return tag
	}

	/** Get color css by SGR color name */
	var getCssColor = function (sgrColor, colorMap) {
		if (sgrColor in colorMap) {
			return colorMap[sgrColor]
		}

		switch (sgrColor) {
			case 'black':
				return '#000000'
			case 'red':
				return '#FF4136'
			case 'green':
				return '#2ECC40'
			case 'yellow':
				return '#FFDC00'
			case 'blue':
				return '#0074D9'
			case 'magenta':
				return '#85144B'
			case 'cyan':
				return '#001F3F'
			case 'white':
				return '#FFFFFF'
			default:
				throw sgrColor + ' is invalid SGR color name'
		}
	}

	//_createInlineTag: function (text) {
	//	var inlineTag = this._help.createTagBySGR(this._options.snippetTag, this._sgr)
	//	inlineTag.innerText = text
	//	return inlineTag
	//},

	/**
	 * Create a new ShellColor instance
	 * @class ShellColor
	 * @paras options
	 *      colorMap:                a color map
	 *      defaultForegroundColor:
	 *      defaultBackgroundColor:
	 *      snippetTag:              default is 'span'
	 * @Event:
	 *      lineStart: trigger at line start
	 *      snippet:   trigger at output text
	 *      lineEnd:   trigger at line end
	 */
	var ShellColor = function (options) {
		options = options || {}
		options.colorMap = options.colorMap || {}
		options.defaultForegroundColor = options.defaultForegroundColor || DEFAULT_FOREGROUND_COLOR
		options.defaultBackgroundColor = options.defaultBackgroundColor || DEFAULT_BACKGROUND_COLOR
		options.snippetTag = options.snippetTag || 'span'
		Object.assign(this, BlockProcessor)

		this._options = options
		this._help = sgrHelp(options)
	}


	//------------------------------------------------------------------------------------------------------
	// Instance API
	//------------------------------------------------------------------------------------------------------

	Object.assign(ShellColor.prototype, {


		reset: function () {

		},

		write: function () {

		}

	}, EventEmitter.prototype)


//------------------------------------------------------------------------------------------------------
// Class API
//------------------------------------------------------------------------------------------------------

	Object.assign(ShellColor, {
		/**
		 * Eliminate the ansi escape code in the string.
		 * @memberof! ShellColor
		 * @param {string} str - a string with ansi escape code
		 * @returns {string} returns the text without ansi escape code
		 */
		strip: function (str) {
			return str.replace(ESCAPE_CODE_REG_MUL, '')
		},

		/**
		 * Convert string which has style info to html tags.
		 * @param str - a string which has style info about styles
		 * @param options:
		 *      lineTag:    default is p
		 *      snippetTag: default is span
		 *      others of ShellColor
		 * @returns {Array} html tags include text, tag is used for hold styles
		 */
		toBlockTags: function (str, options) {
			options = options || {}
			options.lineTag = options.lineTag || 'p'
			options.snippetTag = options.snippetTag || 'span'

			var sc = new ShellColor(options)
			var tags = []
			var lastLine
			sc.on('lineStart', function () {
				lastLine = document.createElement(options.lineTag)
				tags.push(lastLine)
			}).on('snippet', function (tag) {
				lastLine.appendChild(tag)
			})
			sc.reset()
			sc.write(str)

			return tags
		},


		/** Convert string to all inline tags
		 ** text: the string
		 ** options:
		 **     snippetTag: default is span
		 **     others of ShellColor
		 */
		toInlineTags: function (text, options) {
			options = options || {}
			options.snippetTag = options.snippetTag || 'span'

			var sc = new ShellColor(options)
			var tags = []
			sc.on('lineEnd', function () {
				var br = document.createElement('br')
				tags.push(br)
			})
			sc.on('snippet', function (tag) {
				tags.push(tag)
			})
			sc.reset()
			sc.write(text)

			return tags
		}
	})

	module.exports = ShellColor
})

//InlineProcessor = require('./inline-processor'),

//options.lineFeedMode = options.lineFeedMode || 'brTag'
//
//switch (options.lineFeedMode) {
//	case 'brTag':
//		Object.assign(this, InlineProcessor)
//		break
//	case 'blockTag':
//		Object.assign(this, BlockProcessor)
//		break
//}