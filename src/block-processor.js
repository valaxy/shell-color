module.exports = {
	_appendSnippet: function (text) {
		var inlineTag = this._createInlineTag(text)
		this.trigger('snippet', [inlineTag])
	},


	// when init
	_onReset: function () {
		this.trigger('lineStart')
	},


	// when ShellColor receive text push
	_onWrite: function (text) {
		var snippets = text.split('\n')
		var firstSnippet = snippets[0]

		// first snippet belongs to last line
		if (firstSnippet != '') {
			this._appendSnippet(firstSnippet)
		}

		// add rest snippets
		for (var i = 1; i < snippets.length; i++) {
			this.trigger('lineEnd')
			this.trigger('lineStart')
			var snippet = snippets[i]
			if (snippet != '') { // ignore empty string
				this._appendSnippet(snippet)
			}
		}
	}
}