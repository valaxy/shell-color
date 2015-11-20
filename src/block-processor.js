module.exports = {
	_createLine: function () {
		this._lastLine = []
		this.trigger('line')
	},

	_appendSnippet: function (text) {
		var inlineTag = this._createInlineTag(text)
		this._lastLine.push(inlineTag)
		this.trigger('snippet', [inlineTag])
	},

	_onReset: function () {
		this._createLine()
	},

	_onWrite: function (text) {
		var snippets = text.split('\n')
		var firstSnippet = snippets[0]

		// add first snippet to last line
		if (firstSnippet != '') {
			this._appendSnippet(firstSnippet)
		}

		// add rest snippets
		for (var i = 1; i < snippets.length; i++) {
			this._createLine()
			var snippet = snippets[i]
			if (snippet != '') { // ignore empty string
				this._appendSnippet(snippet)
			}
		}
	}
}